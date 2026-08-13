import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  Trash2,
  Pencil,
} from "lucide-react";

import api from "../../services/api";

// ============================================================
// EVENT TYPES / COLORS
// ============================================================

const EVENT_TYPES = [
  {
    value: "meeting",
    label: "Meeting",
    badge:
      "border-violet-500/20 bg-violet-500/15 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.08)]",
    dot: "bg-violet-400",
  },
  {
    value: "project",
    label: "Project",
    badge:
      "border-emerald-500/20 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.08)]",
    dot: "bg-emerald-400",
  },
  {
    value: "call",
    label: "Call",
    badge:
      "border-amber-500/20 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.08)]",
    dot: "bg-amber-400",
  },
  {
    value: "task",
    label: "Task",
    badge:
      "border-blue-500/20 bg-blue-500/15 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.08)]",
    dot: "bg-blue-400",
  },
];

// ============================================================
// HELPERS
// ============================================================

const pad = (value) => String(value).padStart(2, "0");

const formatDateForInput = (date) => {
  if (!date) return "";

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
};

const getDateKey = (date) => {
  if (!date) return "";

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
};

const parseEventDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getEventType = (eventType) => {
  return (
    EVENT_TYPES.find((type) => type.value === eventType) ||
    EVENT_TYPES[0]
  );
};

const getTimeForInput = (dateValue) => {
  const date = parseEventDate(dateValue);

  if (!date) return "09:00";

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getEventDateTime = (date, time) => {
  if (!date) return "";

  return `${date}T${time || "09:00"}:00`;
};

// ============================================================
// COMPONENT
// ============================================================

export default function Calendar() {
  // Current month
  const [currentDate, setCurrentDate] = useState(new Date());

  // Events
  const [events, setEvents] = useState([]);

  // Loading/error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Editing
  const [editingEvent, setEditingEvent] = useState(null);

  // Saving
  const [saving, setSaving] = useState(false);

  // Form
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "09:00",
    event_type: "meeting",
  });

  // ==========================================================
  // FETCH EVENTS
  // ==========================================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/events");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.events || [];

      setEvents(data);
    } catch (err) {
      console.error("Failed to load events:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load events. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial event loading is intentionally triggered from this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
  }, []);

  // ==========================================================
  // CALENDAR DAYS
  // ==========================================================

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();

    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const previousMonthLastDay = new Date(
      year,
      month,
      0
    ).getDate();

    const days = [];

    // Previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      const day = previousMonthLastDay - i;

      days.push({
        date: new Date(year, month - 1, day),
        currentMonth: false,
      });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    // Next month
    let nextDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, nextDay),
        currentMonth: false,
      });

      nextDay++;
    }

    return days;
  }, [currentDate]);

  // ==========================================================
  // EVENTS BY DATE
  // ==========================================================

  const eventsByDate = useMemo(() => {
    const grouped = {};

    events.forEach((event) => {
      const eventDate = parseEventDate(event.event_date);

      if (!eventDate) return;

      const key = getDateKey(eventDate);

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(event);
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        const dateA = parseEventDate(a.event_date)?.getTime() || 0;
        const dateB = parseEventDate(b.event_date)?.getTime() || 0;

        return dateA - dateB;
      });
    });

    return grouped;
  }, [events]);

  // ==========================================================
  // MONTH TITLE
  // ==========================================================

  const monthTitle = currentDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const previousMonth = () => {
    setCurrentDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // ==========================================================
  // MODAL
  // ==========================================================

  const openCreateModal = (selectedDate = null) => {
    setEditingEvent(null);

    setForm({
      title: "",
      description: "",
      event_date: selectedDate
        ? formatDateForInput(selectedDate)
        : formatDateForInput(new Date()),
      event_time: "09:00",
      event_type: "meeting",
    });

    setError("");
    setShowModal(true);
  };

  const openEditModal = (event) => {
    const eventDate = parseEventDate(event.event_date);

    setEditingEvent(event);

    setForm({
      title: event.title || "",
      description: event.description || "",
      event_date: eventDate
        ? formatDateForInput(eventDate)
        : "",
      event_time: getTimeForInput(event.event_date),
      event_type: event.event_type || "meeting",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingEvent(null);
  };

  // ==========================================================
  // FORM
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // CREATE / UPDATE
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Event title is required.");
      return;
    }

    if (!form.event_date) {
      setError("Please select a date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const eventDateTime = getEventDateTime(
        form.event_date,
        form.event_time
      );

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        event_date: eventDateTime,
        event_type: form.event_type,
      };

      if (editingEvent) {
        const response = await api.put(
          `/events/${editingEvent.id}`,
          payload
        );

        const updatedEvent = response.data;

        setEvents((previous) =>
          previous.map((item) =>
            item.id === editingEvent.id
              ? updatedEvent
              : item
          )
        );
      } else {
        const response = await api.post(
          "/events",
          payload
        );

        setEvents((previous) => [
          ...previous,
          response.data,
        ]);
      }

      setShowModal(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("Failed to save event:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save event."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Delete "${event.title || "this event"}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/events/${event.id}`);

      setEvents((previous) =>
        previous.filter(
          (item) => item.id !== event.id
        )
      );
    } catch (err) {
      console.error("Failed to delete event:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete event."
      );
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="relative min-h-full overflow-hidden bg-[#050816]">
      {/* Premium background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[700px]
            rounded-full
            bg-violet-700/20
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            -right-40
            top-[20%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-600/15
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            -bottom-64
            left-1/2
            h-[500px]
            w-[700px]
            -translate-x-1/2
            rounded-full
            bg-cyan-600/10
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            [background-size:40px_40px]
          "
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-emerald-400/20
                bg-emerald-500/10
                shadow-[0_0_35px_rgba(16,185,129,0.12)]
              "
            >
              <CalendarDays
                size={31}
                strokeWidth={1.8}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Calendar
              </h1>

              <p className="mt-1 text-sm text-slate-400 sm:text-base">
                Manage your events and schedule.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openCreateModal()}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              via-purple-600
              to-blue-600
              px-6
              py-3.5
              font-semibold
              text-white
              shadow-[0_10px_40px_rgba(99,102,241,0.35)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_15px_50px_rgba(99,102,241,0.45)]
            "
          >
            <Plus size={20} />
            New Event
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mb-5
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-300
            "
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Calendar */}
        <div
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.10]
            bg-[#080d20]/85
            shadow-[0_25px_100px_rgba(0,0,0,0.45)]
            backdrop-blur-2xl
          "
        >
          {/* Calendar Header */}
          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-white/[0.08]
              px-6
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              lg:px-7
            "
          >
            <div>
              <h2 className="text-2xl font-bold text-white">
                {monthTitle}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Plan your work, meetings and important events.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToToday}
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-200
                  transition
                  hover:border-violet-400/30
                  hover:bg-violet-500/10
                  hover:text-white
                "
              >
                Today
              </button>

              <button
                type="button"
                onClick={previousMonth}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  text-slate-300
                  transition
                  hover:border-violet-400/30
                  hover:bg-violet-500/10
                  hover:text-white
                "
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={nextMonth}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  text-slate-300
                  transition
                  hover:border-violet-400/30
                  hover:bg-violet-500/10
                  hover:text-white
                "
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 border-b border-white/[0.08] bg-white/[0.015]">
            {[
              "SUN",
              "MON",
              "TUE",
              "WED",
              "THU",
              "FRI",
              "SAT",
            ].map((day, index) => (
              <div
                key={day}
                className={`
                  flex
                  h-14
                  items-center
                  justify-center
                  text-xs
                  font-semibold
                  tracking-wide
                  ${
                    index === 0
                      ? "text-pink-400"
                      : index === 6
                      ? "text-sky-400"
                      : "text-slate-400"
                  }
                `}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex h-[500px] items-center justify-center">
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    mb-4
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-2
                    border-white/10
                    border-t-violet-400
                  "
                />

                <p className="text-sm text-slate-500">
                  Loading calendar...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {calendarDays.map(
                ({ date, currentMonth }, index) => {
                  const dateKey = getDateKey(date);
                  const dayEvents =
                    eventsByDate[dateKey] || [];

                  const today = isSameDay(
                    date,
                    new Date()
                  );

                  const isSunday =
                    date.getDay() === 0;

                  const isSaturday =
                    date.getDay() === 6;

                  return (
                    <div
                      key={`${dateKey}-${index}`}
                      onDoubleClick={() =>
                        openCreateModal(date)
                      }
                      className={`
                        group
                        relative
                        min-h-[125px]
                        border-b
                        border-r
                        border-white/[0.07]
                        p-3
                        transition-all
                        duration-200
                        hover:bg-white/[0.025]
                        ${
                          !currentMonth
                            ? "bg-black/[0.08]"
                            : ""
                        }
                      `}
                    >
                      {/* Date */}
                      <div className="flex items-start justify-between">
                        <div
                          className={`
                            flex
                            h-9
                            min-w-9
                            items-center
                            justify-center
                            rounded-full
                            px-2
                            text-sm
                            font-semibold
                            transition-all
                            ${
                              today
                                ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-[0_0_25px_rgba(124,58,237,0.55)]"
                                : !currentMonth
                                ? "text-slate-700"
                                : isSunday
                                ? "text-pink-400"
                                : isSaturday
                                ? "text-sky-400"
                                : "text-slate-200"
                            }
                          `}
                        >
                          {date.getDate()}
                        </div>

                        {currentMonth && (
                          <button
                            type="button"
                            onClick={() =>
                              openCreateModal(date)
                            }
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-lg
                              bg-white/5
                              text-slate-500
                              opacity-0
                              transition
                              group-hover:opacity-100
                              hover:bg-violet-500/20
                              hover:text-violet-300
                            "
                            title="Add event"
                          >
                            <Plus size={15} />
                          </button>
                        )}
                      </div>

                      {/* Events */}
                      <div className="mt-3 space-y-2">
                        {dayEvents
                          .slice(0, 3)
                          .map((event) => {
                            const color =
                              getEventType(
                                event.event_type
                              );

                            return (
                              <div
                                key={event.id}
                                className={`
                                  group/event
                                  relative
                                  flex
                                  items-center
                                  gap-2
                                  rounded-xl
                                  border
                                  px-2.5
                                  py-2
                                  text-xs
                                  font-medium
                                  transition-all
                                  duration-200
                                  hover:-translate-y-0.5
                                  ${color.badge}
                                `}
                                title={
                                  event.description ||
                                  event.title
                                }
                              >
                                <span
                                  className={`
                                    h-2
                                    w-2
                                    shrink-0
                                    rounded-full
                                    ${color.dot}
                                  `}
                                />

                                <span className="min-w-0 flex-1 truncate">
                                  {event.title ||
                                    "Untitled Event"}
                                </span>

                                <div
                                  className="
                                    absolute
                                    right-1
                                    top-1/2
                                    flex
                                    -translate-y-1/2
                                    gap-1
                                    rounded-lg
                                    bg-black/60
                                    p-1
                                    opacity-0
                                    backdrop-blur
                                    transition
                                    group-hover/event:opacity-100
                                  "
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditModal(
                                        event
                                      );
                                    }}
                                    className="
                                      rounded
                                      p-1
                                      text-slate-300
                                      hover:bg-white/10
                                      hover:text-white
                                    "
                                    title="Edit"
                                  >
                                    <Pencil size={12} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(
                                        event
                                      );
                                    }}
                                    className="
                                      rounded
                                      p-1
                                      text-red-300
                                      hover:bg-red-500/20
                                      hover:text-red-200
                                    "
                                    title="Delete"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                        {dayEvents.length > 3 && (
                          <div className="px-1 text-[11px] text-slate-500">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Legend */}
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-7
              gap-y-3
              border-t
              border-white/[0.08]
              bg-white/[0.015]
              px-6
              py-4
              lg:px-7
            "
          >
            {EVENT_TYPES.map((type) => (
              <div
                key={type.value}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <span
                  className={`
                    h-3
                    w-3
                    rounded-full
                    ${type.dot}
                  `}
                />

                {type.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-4
            backdrop-blur-md
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
              rounded-[28px]
              border
              border-white/10
              bg-[#0a1023]
              shadow-[0_30px_100px_rgba(0,0,0,0.65)]
            "
          >
            {/* Modal header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/10
                px-6
                py-5
              "
            >
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingEvent
                    ? "Edit Event"
                    : "Create Event"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add an event to your calendar.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/5
                  text-slate-400
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="relative z-20 space-y-5 p-6"
            >
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Event Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="e.g. Project Review"
                  autoFocus
                  required
                  autoComplete="off"
                  className="
                    relative
                    z-20
                    block
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-4
                    py-3
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    transition
                    focus:border-violet-500/50
                    focus:bg-white/[0.06]
                    focus:ring-2
                    focus:ring-violet-500/10
                    pointer-events-auto
                    cursor-text
                  "
                />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-500
                      "
                    />

                    <input
                      type="date"
                      name="event_date"
                      value={form.event_date}
                      onChange={handleChange}
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        py-3
                        pl-11
                        pr-4
                        text-white
                        outline-none
                        transition
                        focus:border-violet-500/50
                        focus:ring-2
                        focus:ring-violet-500/10
                      "
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Time
                  </label>

                  <div className="relative">
                    <Clock
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-500
                      "
                    />

                    <input
                      type="time"
                      name="event_time"
                      value={form.event_time}
                      onChange={handleChange}
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        py-3
                        pl-11
                        pr-4
                        text-white
                        outline-none
                        transition
                        focus:border-violet-500/50
                        focus:ring-2
                        focus:ring-violet-500/10
                      "
                    />
                  </div>
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Event Type
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {EVENT_TYPES.map((type) => {
                    const selected =
                      form.event_type === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            event_type: type.value,
                          }))
                        }
                        className={`
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-sm
                          font-medium
                          transition
                          ${
                            selected
                              ? type.badge
                              : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                          }
                        `}
                      >
                        <span
                          className={`
                            h-2.5
                            w-2.5
                            rounded-full
                            ${type.dot}
                          `}
                        />

                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add details about this event..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-4
                    py-3
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    transition
                    focus:border-violet-500/50
                    focus:bg-white/[0.06]
                    focus:ring-2
                    focus:ring-violet-500/10
                  "
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-4
                    py-3
                    font-medium
                    text-slate-300
                    transition
                    hover:bg-white/[0.08]
                    hover:text-white
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    to-blue-600
                    px-4
                    py-3
                    font-semibold
                    text-white
                    shadow-[0_8px_30px_rgba(99,102,241,0.25)]
                    transition
                    hover:from-violet-500
                    hover:to-blue-500
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {saving ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />

                      {editingEvent
                        ? "Update Event"
                        : "Create Event"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}