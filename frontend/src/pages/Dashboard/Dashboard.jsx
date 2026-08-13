import { useEffect } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Hero from "../../components/Hero/Hero";
import Stats from "../../components/Stats/Stats";
import Analytics from "../../components/Analytics/Analytics";
import TodayTasks from "../../components/Tasks/TodayTasks";
import RecentProjects from "../../components/Projects/RecentProjects";
import RecentNotes from "../../pages/Notes/RecentNotes";
import UpcomingEvents from "../../pages/Events/UpcomingEvents";
import PageTransition from "../../components/UI/PageTransition";

export default function Dashboard() {
  useEffect(() => {
    // Refresh the dashboard when the page becomes visible again.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        window.dispatchEvent(
          new CustomEvent("devforge:dashboard-refresh")
        );
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-8">
          {/* Hero */}
          <Hero />

          {/* Statistics */}
          <Stats />

          {/* Analytics + Tasks */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <Analytics />
            </div>

            <TodayTasks />
          </section>

          {/* Projects + Notes */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RecentProjects />
            <RecentNotes />
          </section>

          {/* Events */}
          <UpcomingEvents />
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}