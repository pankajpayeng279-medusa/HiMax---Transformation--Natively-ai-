import { motion } from 'framer-motion';
import { ArrowRight, Dumbbell, UtensilsCrossed, LineChart, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const features = [
  {
    icon: <Dumbbell className="w-6 h-6" />,
    title: 'AI Workout Coach',
    description: 'Personalized training plans that adapt to your progress, powered by advanced AI.',
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6" />,
    title: 'Smart Nutrition',
    description: 'Meal plans and macros calculated for your goals, preferences, and dietary needs.',
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Transformation Tracking',
    description: 'Visual progress tracking with AI-powered analysis of your transformation journey.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-time Adaptation',
    description: 'Your plan evolves as you do — the AI adjusts based on your performance and feedback.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Science-Backed',
    description: 'Every recommendation is grounded in exercise science and nutritional research.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community Support',
    description: 'Connect with others on the same journey, share wins, and stay accountable.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Get started with basic AI coaching features.',
    features: ['Basic workout plans', 'Nutrition tracking', 'Weekly progress reports', 'Community access'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'Unlock the full power of AI-driven transformation.',
    features: ['Advanced AI coaching', 'Personalized meal plans', 'Real-time progress tracking', 'Priority support', 'Custom workout builder', 'Advanced analytics'],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Elite',
    price: '$49',
    period: '/mo',
    description: 'For those who demand the absolute best.',
    features: ['Everything in Pro', '1-on-1 AI coaching sessions', 'DNA-based nutrition', 'Recovery optimization', 'Competition prep mode', 'API access'],
    cta: 'Go Elite',
    highlighted: false,
  },
];

const testimonials = [
  {
    name: 'Marcus R.',
    role: 'Lost 45 lbs in 6 months',
    quote: 'HiMax completely changed my approach to fitness. The AI coach feels like having a personal trainer in my pocket 24/7.',
    avatar: 'MR',
  },
  {
    name: 'Sarah K.',
    role: 'Competed in first bodybuilding show',
    quote: 'The nutrition planning alone is worth it. I finally understand what my body needs to perform at its best.',
    avatar: 'SK',
  },
  {
    name: 'David L.',
    role: 'Transformed from skinny to muscular',
    quote: 'I tried everything for years. HiMax was the first thing that actually gave me a plan that worked for MY body.',
    avatar: 'DL',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
              H
            </div>
            <span className="font-bold text-lg">HiMax</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/login?signup=true">
              <Button size="sm">Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8">
              <Zap className="w-4 h-4" />
              AI-Powered Personal Transformation
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Transform Your Body
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                With AI Intelligence
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
              HiMax combines cutting-edge AI with proven fitness science to create
              a personalized transformation plan that adapts to you — not the other way around.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login?signup=true">
                <Button size="lg" className="gap-2">
                  Start Your Transformation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-1">
                <div className="bg-black/60 rounded-xl p-8 sm:p-12">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-1 space-y-4">
                      <div className="h-32 bg-white/5 rounded-lg animate-pulse" />
                      <div className="h-24 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <div className="h-40 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <div className="col-span-3 sm:col-span-2 space-y-4">
                      <div className="h-16 bg-white/5 rounded-lg animate-pulse" />
                      <div className="h-48 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: '0.15s' }} />
                      <div className="h-32 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: '0.25s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50K+', label: 'Active Users' },
            { value: '2M+', label: 'Workouts Logged' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '4.9', label: 'App Store Rating' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Transform</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform handles every aspect of your fitness journey,
              from workout planning to nutrition tracking and progress analysis.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start free and upgrade when you're ready. No hidden fees, cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-xl border ${
                  plan.highlighted
                    ? 'border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/20'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-semibold text-blue-400 mb-4 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login?signup=true">
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Real Transformations</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from people who have transformed their lives with HiMax.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
          <div className="relative p-12 rounded-3xl bg-white/5 border border-white/10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of people who have already transformed their bodies and lives with HiMax.
            </p>
            <Link to="/login?signup=true">
              <Button size="lg" className="gap-2">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs">
              H
            </div>
            <span className="font-semibold text-sm">HiMax</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>
          <p className="text-sm text-gray-600">© 2025 HiMax. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}