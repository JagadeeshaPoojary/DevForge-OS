import { useEffect, useState } from "react";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import api from "../../services/api";
import Skeleton from "../../components/UI/Skeleton";


export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError(false);

        const response = await api.get("/events");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.events || [];

        setEvents(data.slice(0, 5));
      } catch (error) {
        console.error("FAILED TO LOAD EVENTS");
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        console.error("Message:", error.message);

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Upcoming Events
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your upcoming schedule
          </p>
        </div>

        <div className="rounded-xl bg-emerald-500/20 p-3">
          <CalendarDays
            size={20}
            className="text-emerald-400"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div className="flex items-center gap-3">

                <Skeleton className="h-10 w-10 rounded-xl" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>

              </div>
            </div>
          ))}

        </div>

      ) : error ? (

        /* Error State */
        <div className="py-10 text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
            <CalendarDays
              size={24}
              className="text-red-400"
            />
          </div>

          <p className="font-medium text-red-400">
            Unable to load events
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please check your connection and try again.
          </p>

        </div>

      ) : events.length === 0 ? (

        /* Empty State */
        <div className="py-10 text-center">

          <CalendarDays
            size={32}
            className="mx-auto mb-3 text-slate-600"
          />

          <p className="text-slate-400">
            No upcoming events
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add an event to see it here.
          </p>

        </div>

      ) : (

        /* Events */
        <div className="space-y-3">

          {events.map((event) => (
            <div
              key={event.id}
              className="
                group
                rounded-2xl
                border
                border-white/5
                bg-white/5
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-emerald-500/20
                hover:bg-white/10
                hover:shadow-lg
                hover:shadow-emerald-950/20
              "
            >

              <div className="flex items-start gap-3">

                {/* Icon */}
                <div className="shrink-0 rounded-xl bg-emerald-500/10 p-2">
                  <CalendarDays
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-2">

                    <h3 className="truncate font-medium text-white transition-colors group-hover:text-emerald-300">
                      {event.title || "Untitled Event"}
                    </h3>

                    <ArrowUpRight
                      size={15}
                      className="
                        shrink-0
                        text-slate-600
                        opacity-0
                        transition-all
                        duration-200
                        group-hover:text-emerald-400
                        group-hover:opacity-100
                      "
                    />

                  </div>

                  <p className="mt-1 text-sm text-emerald-400">
                    {event.event_date
                      ? new Date(
                          event.event_date
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Date not set"}
                  </p>

                  {event.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {event.description}
                    </p>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}