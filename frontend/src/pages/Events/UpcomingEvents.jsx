import { useEffect, useState } from "react";
import {
  CalendarDays,
  ArrowUpRight,
  RefreshCw,
  Clock3,
} from "lucide-react";

import api from "../../services/api";
import Skeleton from "../../components/UI/Skeleton";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/events");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.events || [];

      /*
       * Sort events by event date.
       */
      const sortedEvents = [...data].sort((a, b) => {
        const dateA = new Date(a.event_date).getTime();
        const dateB = new Date(b.event_date).getTime();

        return dateA - dateB;
      });

      setEvents(sortedEvents.slice(0, 5));
    } catch (err) {
      console.error("FAILED TO LOAD EVENTS");
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);
      console.error("Message:", err.message);

      setError(true);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date not set";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not set";
    }

    return parsedDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="
        h-full
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        p-6
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-white/15
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <CalendarDays
                size={20}
                className="text-emerald-400"
              />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Upcoming Events
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Your upcoming schedule
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            p-3
          "
        >
          <CalendarDays
            size={20}
            className="text-emerald-400"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                rounded-2xl
                border
                border-white/5
                bg-white/[0.03]
                p-4
              "
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
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-10 text-center">
          <div
            className="
              mx-auto
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-red-500/10
            "
          >
            <RefreshCw
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

          <button
            onClick={fetchEvents}
            className="
              mt-4
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2
              text-sm
              text-slate-300
              transition
              hover:bg-white/10
            "
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && events.length === 0 && (
        <div className="py-10 text-center">
          <div
            className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-emerald-500/10
            "
          >
            <CalendarDays
              size={28}
              className="text-emerald-400"
            />
          </div>

          <p className="font-medium text-slate-300">
            No upcoming events
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Add an event to see it here.
          </p>
        </div>
      )}

      {/* Events */}
      {!loading && !error && events.length > 0 && (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="
                group
                rounded-2xl
                border
                border-white/5
                bg-white/[0.03]
                p-4
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-emerald-500/20
                hover:bg-white/[0.06]
                hover:shadow-lg
                hover:shadow-emerald-950/20
              "
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className="
                    shrink-0
                    rounded-xl
                    bg-emerald-500/10
                    p-2.5
                  "
                >
                  <CalendarDays
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className="
                        truncate
                        font-medium
                        text-white
                        transition-colors
                        group-hover:text-emerald-300
                      "
                    >
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

                  {/* Date */}
                  <div className="mt-2 flex items-center gap-2">
                    <CalendarDays
                      size={14}
                      className="text-emerald-400"
                    />

                    <p className="text-sm font-medium text-emerald-400">
                      {formatDate(event.event_date)}
                    </p>
                  </div>

                  {/* Time */}
                  {formatTime(event.event_date) && (
                    <div className="mt-1 flex items-center gap-2">
                      <Clock3
                        size={13}
                        className="text-slate-600"
                      />

                      <p className="text-xs text-slate-500">
                        {formatTime(event.event_date)}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  {event.description && (
                    <p
                      className="
                        mt-2
                        line-clamp-2
                        text-sm
                        text-slate-500
                      "
                    >
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