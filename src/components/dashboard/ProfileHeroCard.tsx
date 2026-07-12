import {
  User,
  Target,
  Scale,
  Ruler,
  Flame,
  Beef,
  Dumbbell,
  Utensils,
} from "lucide-react";
import type { Profile } from "../../types/supabase";

interface Props {
  profile: Profile;
}

function Item({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-zinc-900/70 p-4 border border-zinc-800">
      <div className="text-orange-400">{icon}</div>

      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

export default function ProfileHeroCard({ profile }: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
          {profile.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>

          <p className="text-gray-400">{profile.goal}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Item
          icon={<Scale size={20} />}
          label="Weight"
          value={`${profile.weight_kg} kg`}
        />

        <Item
          icon={<Ruler size={20} />}
          label="Height"
          value={`${profile.height_cm} cm`}
        />

        <Item
          icon={<Flame size={20} />}
          label="Calories Goal"
          value={`${profile.calorie_goal ?? 0} kcal`}
        />

        <Item
          icon={<Beef size={20} />}
          label="Protein Goal"
          value={`${profile.protein_goal ?? 0} g`}
        />

        <Item
          icon={<Target size={20} />}
          label="Goal"
          value={profile.goal ?? "-"}
        />

        <Item
          icon={<Dumbbell size={20} />}
          label="Workout"
          value={profile.workout_location ?? "-"}
        />

        <Item
          icon={<Utensils size={20} />}
          label="Diet"
          value={profile.diet_type ?? "-"}
        />

        <Item
          icon={<User size={20} />}
          label="Age"
          value={profile.age ?? "-"}
        />
      </div>
    </div>
  );
}
