import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Target,
  Calendar,
  Dumbbell,
  UtensilsCrossed,
  Flame,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { useEffect, useState } from "react";
import type { Profile } from "../types/supabase";
import profileService from "../services/profileService";
import ProfileHeroCard from "../components/dashboard/ProfileHeroCard";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { formatNumber, formatMinutes, formatDate } from "../utils/formatters";

const todaysMeals = [
  {
    id: 1,
    name: "Breakfast",
    description: "Oatmeal with protein powder & berries",
    calories: 450,
    time: "8:00 AM",
  },
  {
    id: 2,
    name: "Lunch",
    description: "Grilled chicken salad with avocado",
    calories: 580,
    time: "12:30 PM",
  },
  {
    id: 3,
    name: "Snack",
    description: "Greek yogurt with almonds",
    calories: 220,
    time: "3:00 PM",
  },
  {
    id: 4,
    name: "Dinner",
    description: "Planned: Salmon with quinoa & veggies",
    calories: 620,
    time: "7:00 PM",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDashboard();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const data = await profileService.get(user.id);
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadProfile();
  }, [user]);

  const firstName = profile?.name?.split(" ")[0] || "Champion";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-gray-400 text-sm">
          {error || "We couldn't load your dashboard right now."}
        </p>
        <Button variant="outline" onClick={refetch} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      </div>
    );
  }

  const {
    stats,
    recentWorkouts,
    nutritionToday,
    weeklyProgress,
    recommendation,
  } = data;

  const caloriePercent =
    nutritionToday.goal > 0
      ? Math.round((nutritionToday.calories / nutritionToday.goal) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold mb-1">Welcome back, {firstName}</h1>
        <p className="text-gray-400 text-sm">
          Here's your transformation overview for today.
        </p>
      </motion.div>

      {profile && <ProfileHeroCard profile={profile} />}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          label="Today's Calories"
          value={`${formatNumber(nutritionToday.calories)} / ${formatNumber(nutritionToday.goal)}`}
          change={`${caloriePercent}% of goal`}
          changeType={caloriePercent < 100 ? "positive" : "negative"}
          icon={<Flame className="w-4 h-4" />}
        />
        <StatCard
          label="Weekly Workouts"
          value={`${stats.workoutsCompleted}`}
          change="Total this month"
          changeType="neutral"
          icon={<Dumbbell className="w-4 h-4" />}
        />
        <StatCard
          label="Streak"
          value={`${stats.currentStreak} days`}
          change="Current streak"
          changeType="neutral"
          icon={<Activity className="w-4 h-4" />}
        />
        <StatCard
          label="Active Minutes"
          value={formatMinutes(stats.activeMinutes)}
          change="This month"
          changeType="neutral"
          icon={<Target className="w-4 h-4" />}
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weight Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Weight Trend</h2>
                <span className="text-xs text-gray-500">Last 7 days</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyProgress}
                    margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#27272A"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d: string) =>
                        new Date(d).toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      }
                      tick={{ fontSize: 12, fill: "#A1A1AA" }}
                      axisLine={{ stroke: "#27272A" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={["dataMin - 0.5", "dataMax + 0.5"]}
                      tick={{ fontSize: 12, fill: "#A1A1AA" }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#141416",
                        border: "1px solid #27272A",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#FAFAFA",
                      }}
                      labelFormatter={(label: React.ReactNode) =>
                        formatDate(String(label))
                      }
                      formatter={(value: any) => [`${value} lbs`, "Weight"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        fill: "#10B981",
                        stroke: "#141416",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#10B981",
                        stroke: "#141416",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Recent Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card padding="none">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-semibold">Recent Workouts</h2>
                <Link
                  to="/dashboard/coach"
                  className="text-sm text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          workout.completed ? "bg-primary" : "bg-gray-600"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {workout.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {formatDate(workout.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-text-muted">
                      <span>
                        {workout.completed ? `${workout.duration} min` : "—"}
                      </span>
                      <span className="w-16 text-right">
                        {workout.completed
                          ? `${workout.exercises} exercises`
                          : "Rest day"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Today's Meals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card padding="none">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-semibold">Today's Meals</h2>
                <Link
                  to="/dashboard/nutrition"
                  className="text-sm text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                >
                  Meal plan <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {todaysMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4 text-text-muted" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{meal.name}</div>
                        <div className="text-xs text-text-muted">
                          {meal.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {meal.calories} cal
                      </div>
                      <div className="text-xs text-text-muted">{meal.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/dashboard/coach">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                  >
                    <Dumbbell className="w-4 h-4" />
                    Start Workout
                  </Button>
                </Link>
                <Link to="/dashboard/nutrition">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    Log Meal
                  </Button>
                </Link>
                <Link to="/dashboard/progress">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                  >
                    <TrendingUp className="w-4 h-4" />
                    View Progress
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* AI Recommendation */}
          {recommendation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm text-primary">
                    AI Coach
                  </h3>
                </div>
                <h4 className="font-semibold mb-2">{recommendation.title}</h4>
                <p className="text-sm text-text-muted mb-4 leading-relaxed">
                  {recommendation.description}
                </p>
                <Link to={`/dashboard/${recommendation.actionType}`}>
                  <Button variant="primary" className="w-full gap-2">
                    {recommendation.actionLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}

          {/* Upcoming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card>
              <h3 className="font-semibold mb-4">Upcoming</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Lower Body</div>
                    <div className="text-text-muted">Tomorrow, 7:00 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover">
                  <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Progress Check-in</div>
                    <div className="text-text-muted">Friday, 9:00 AM</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
