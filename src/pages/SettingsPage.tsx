import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, LogOut } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl"
    >
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-gray-400 text-sm mb-8">Manage your account and preferences.</p>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold">Profile</h2>
              <p className="text-sm text-gray-500">Your personal information</p>
            </div>
          </div>
          <div className="space-y-4">
            <Input
              label="Full Name"
              defaultValue={user?.user_metadata?.full_name || ''}
              readOnly
            />
            <Input
              label="Email"
              type="email"
              defaultValue={user?.email || ''}
              readOnly
            />
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold">Preferences</h2>
              <p className="text-sm text-gray-500">Customize your experience</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 text-center py-6">
            Preferences coming soon.
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-gray-500">Manage your alerts</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 text-center py-6">
            Notification settings coming soon.
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold">Security</h2>
              <p className="text-sm text-gray-500">Password and account security</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 text-center py-6">
            Security settings coming soon.
          </div>
        </Card>

        {/* Sign Out */}
        <Card>
          <Button
            variant="outline"
            onClick={signOut}
            className="w-full justify-center gap-2 text-red-400 border-red-500/20 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Card>
      </div>
    </motion.div>
  );
}
