import { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/events");

      setEvents(
        Array.isArray(response.data)
          ? response.data
          : response.data.events || []
      );
    } catch (error) {
      console.error("Failed to load events:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load events."
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openCreateForm = () => {
    setEditingEvent(null);

    setForm({
      title: "",
      description: "",
      event_date: "",
    });

    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);

    setForm({
      title: event.title || "",
      description: event.description || "",
      event_date: event.event_date
        ? event.event_date.substring(0, 10)
        : "",
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter an event title.");
      return;
    }

    if (!form.event_date) {
      toast.error("Please select an event date.");
      return;
    }

    try {
      setSaving(true);

      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, {
          title: form.title.trim(),
          description: form.description.trim(),
          event_date: form.event_date,
        });

        toast.success("Event updated successfully.");
      } else {
        await api.post("/events", {
          title: form.title.trim(),
          description: form.description.trim(),
          event_date: form.event_date,
        });

        toast.success("Event created successfully.");
      }

      setShowForm(false);
      setEditingEvent(null);

      setForm({
        title: "",
        description: "",
        event_date: "",
      });

      await fetchEvents();
    } catch (error) {
      console.error("Event save error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save event."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);

      toast.success("Event deleted.");

      setEvents((current) =>
        current.filter((event) => event.id !== id)
      );
    } catch (error) {
      console.error("Delete event error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete event."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date not set";

    return new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#070b17] text-white lg:ml-72">
      <div className="mx-auto max-w-7xl p-6 lg:p-10">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <CalendarDays
                size={25}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Events
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your schedule and upcoming events.
              </p>
            </div>

          </div>

          <button
            onClick={openCreateForm}
            className="
              flex items-center justify-center gap-2
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-blue-600
              px-5 py-3
              font-medium
              shadow-lg
              transition
              hover:from-violet-500
              hover:to-blue-500
            "
          >
            <Plus size={18} />
            New Event
          </button>

        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2
              size={32}
              className="animate-spin text-violet-400"
            />
          </div>
        ) : events.length === 0 ? (

          <div className="
            rounded-3xl
            border border-white/10
            bg-white/[0.04]
            p-12
            text-center
          ">

            <CalendarDays
              size={42}
              className="mx-auto mb-4 text-slate-600"
            />

            <h2 className="text-xl font-semibold">
              No events yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first event to get started.
            </p>

            <button
              onClick={openCreateForm}
              className="
                mt-6
                rounded-xl
                bg-violet-600
                px-5 py-3
                text-sm font-medium
                hover:bg-violet-500
              "
            >
              Create Event
            </button>

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {events.map((event) => (
              <div
                key={event.id}
                className="
                  rounded-3xl
                  border border-white/10
                  bg-white/[0.04]
                  p-6
                  transition
                  hover:-translate-y-1
                  hover:border-emerald-500/20
                  hover:bg-white/[0.06]
                "
              >

                <div className="mb-5 flex items-start justify-between">

                  <div className="rounded-xl bg-emerald-500/10 p-3">
                    <CalendarDays
                      size={21}
                      className="text-emerald-400"
                    />
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => openEditForm(event)}
                      className="
                        rounded-lg p-2
                        text-slate-500
                        hover:bg-white/10
                        hover:text-white
                      "
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(event.id)}
                      className="
                        rounded-lg p-2
                        text-slate-500
                        hover:bg-red-500/10
                        hover:text-red-400
                      "
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>

                <h2 className="truncate text-xl font-semibold">
                  {event.title}
                </h2>

                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
                  <CalendarDays size={15} />
                  {formatDate(event.event_date)}
                </div>

                {event.description && (
                  <p className="
                    mt-4
                    line-clamp-4
                    text-sm
                    leading-6
                    text-slate-400
                  ">
                    {event.description}
                  </p>
                )}

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Modal */}
      {showForm && (
        <div className="
          fixed inset-0 z-[100]
          flex items-center justify-center
          bg-black/70
          p-4
          backdrop-blur-sm
        ">

          <div className="
            relative z-10
            w-full max-w-xl
            rounded-3xl
            border border-white/10
            bg-[#0d1222]
            p-6
            shadow-2xl
          ">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  {editingEvent
                    ? "Edit Event"
                    : "Create Event"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingEvent
                    ? "Update your event details."
                    : "Add an event to your schedule."}
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="
                  rounded-xl p-2
                  text-slate-500
                  hover:bg-white/5
                  hover:text-white
                "
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>
                <label className="text-sm text-slate-400">
                  Event Title
                </label>

                <input
                  autoFocus
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Project Presentation"
                  className="
                    mt-2 w-full
                    rounded-xl
                    border border-white/10
                    bg-white/[0.04]
                    px-4 py-3
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-violet-500/50
                    focus:ring-2
                    focus:ring-violet-500/20
                  "
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Date
                </label>

                <input
                  type="date"
                  name="event_date"
                  value={form.event_date}
                  onChange={handleChange}
                  className="
                    mt-2 w-full
                    rounded-xl
                    border border-white/10
                    bg-white/[0.04]
                    px-4 py-3
                    text-white
                    outline-none
                    focus:border-violet-500/50
                  "
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the event..."
                  rows="5"
                  className="
                    mt-2 w-full
                    resize-none
                    rounded-xl
                    border border-white/10
                    bg-white/[0.04]
                    px-4 py-3
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-violet-500/50
                    focus:ring-2
                    focus:ring-violet-500/20
                  "
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="
                  flex w-full
                  items-center justify-center gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-blue-600
                  px-4 py-3
                  font-medium
                  transition
                  hover:from-violet-500
                  hover:to-blue-500
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
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

            </form>

          </div>

        </div>
      )}

    </div>
  );
}