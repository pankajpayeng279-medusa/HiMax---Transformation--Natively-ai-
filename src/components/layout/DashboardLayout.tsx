import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./Sidebar";
import Spinner from "../ui/Spinner";
import { useEffect, useState } from "react";
import profileService from "../../services/profileService";

export default function DashboardLayout() {
  const { user, loading } = useAuth();

  const [checkingProfile, setCheckingProfile] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkProfile() {
      if (!user) {
        if (isMounted) setCheckingProfile(false);
        return;
      }

      try {
        const profile = await profileService.get(user.id);

        console.log("Current User:", user);
        console.log("Fetched Profile:", profile);

        if (isMounted && (!profile || !profile.completed_onboarding)) {
          setNeedsOnboarding(true);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setNeedsOnboarding(true);
      } finally {
        if (isMounted) setCheckingProfile(false);
      }
    }

    checkProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // ===== DEVELOPMENT ONLY =====
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
