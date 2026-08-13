import { useEffect, useMemo, useState } from "react";
import {
  StickyNote,
  Plus,
  Search,
  Grid2X2,
  List,
  Pencil,
  Trash2,
  CalendarDays,
  X,
  Loader2,
  FileText,
  Star,
} from "lucide-react";

import api from "../../services/api";
import toast from "react-hot-toast";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  // --------------------------------------------------
  // FETCH NOTES
  // --------------------------------------------------

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notes");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.notes || [];

      setNotes(data);
    } catch (error) {
      console.error("Failed to load notes:", error);
      toast.error("Unable to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial note loading is intentionally triggered from this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotes();
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((note) => {
      return (
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
      );
    });
  }, [notes, search]);

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const openCreateForm = () => {
    setEditingNote(null);

    setForm({
      title: "",
      content: "",
    });

    setShowForm(true);
  };

  const openEditForm = (note) => {
    setEditingNote(note);

    setForm({
      title: note.title || "",
      content: note.content || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingNote(null);

    setForm({
      title: "",
      content: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a note title");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Please enter note content");
      return;
    }

    try {
      setSaving(true);

      if (editingNote) {
        await api.put(`/notes/${editingNote.id}`, {
          title: form.title,
          content: form.content,
        });

        toast.success("Note updated successfully");
      } else {
        await api.post("/notes", {
          title: form.title,
          content: form.content,
        });

        toast.success("Note created successfully");
      }

      closeForm();
      await fetchNotes();
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/notes/${id}`);

      setNotes((previous) =>
        previous.filter((note) => note.id !== id)
      );

      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  };

  // --------------------------------------------------
  // COLORS
  // --------------------------------------------------

  const getNoteTheme = (index) => {
    const themes = [
      {
        icon: "bg-yellow-500/10",
        iconText: "text-yellow-400",
        glow: "bg-yellow-500/10",
        border: "hover:border-yellow-400/30",
        tag: "border-yellow-400/20 bg-yellow-400/10 text-yellow-400",
      },
      {
        icon: "bg-blue-500/10",
        iconText: "text-blue-400",
        glow: "bg-blue-500/10",
        border: "hover:border-blue-400/30",
        tag: "border-blue-400/20 bg-blue-400/10 text-blue-400",
      },
      {
        icon: "bg-emerald-500/10",
        iconText: "text-emerald-400",
        glow: "bg-emerald-500/10",
        border: "hover:border-emerald-400/30",
        tag: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
      },
      {
        icon: "bg-pink-500/10",
        iconText: "text-pink-400",
        glow: "bg-pink-500/10",
        border: "hover:border-pink-400/30",
        tag: "border-pink-400/20 bg-pink-400/10 text-pink-400",
      },
      {
        icon: "bg-violet-500/10",
        iconText: "text-violet-400",
        glow: "bg-violet-500/10",
        border: "hover:border-violet-400/30",
        tag: "border-violet-400/20 bg-violet-400/10 text-violet-400",
      },
      {
        icon: "bg-cyan-500/10",
        iconText: "text-cyan-400",
        glow: "bg-cyan-500/10",
        border: "hover:border-cyan-400/30",
        tag: "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
      },
    ];

    return themes[index % themes.length];
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* =====================================================
          PREMIUM BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Purple glow */}
        <div
          className="
            absolute
            left-[25%]
            top-[-180px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-violet-600/15
            blur-[150px]
          "
        />

        {/* Blue glow */}
        <div
          className="
            absolute
            right-[-150px]
            top-[-100px]
            h-[600px]
            w-[600px]
            rounded-full
            bg-blue-600/15
            blur-[160px]
          "
        />

        {/* Cyan bottom glow */}
        <div
          className="
            absolute
            bottom-[-250px]
            right-[15%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-500/10
            blur-[160px]
          "
        />

        {/* Pink glow */}
        <div
          className="
            absolute
            bottom-[-200px]
            left-[15%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-fuchsia-600/8
            blur-[150px]
          "
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="relative z-10 mx-auto max-w-[1500px] px-5 py-8 lg:px-10">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

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
                border-yellow-400/20
                bg-yellow-500/10
                shadow-lg
                shadow-yellow-950/20
              "
            >
              <FileText
                size={30}
                className="text-yellow-400"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Notes
              </h1>

              <p className="mt-1 text-base text-slate-400">
                Capture ideas, knowledge and important information.
              </p>
            </div>

          </div>

          <button
            onClick={openCreateForm}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-blue-600
              px-6
              py-3.5
              font-semibold
              text-white
              shadow-xl
              shadow-violet-950/30
              transition-all
              duration-300
              hover:-translate-y-1
              hover:from-violet-500
              hover:to-blue-500
              hover:shadow-violet-500/20
            "
          >
            <Plus size={19} />
            New Note
          </button>

        </div>

        {/* =================================================
            STATISTICS
        ================================================== */}

        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.035]
              p-5
              backdrop-blur-xl
              transition
              hover:border-yellow-400/20
              hover:bg-white/[0.05]
            "
          >
            <p className="text-sm text-slate-400">
              Total Notes
            </p>

            <div className="mt-3 flex items-center justify-between">

              <p className="text-3xl font-bold">
                {notes.length}
              </p>

              <div className="rounded-xl bg-yellow-500/10 p-3">
                <StickyNote
                  size={20}
                  className="text-yellow-400"
                />
              </div>

            </div>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.035]
              p-5
              backdrop-blur-xl
              transition
              hover:border-violet-400/20
              hover:bg-white/[0.05]
            "
          >
            <p className="text-sm text-slate-400">
              Showing
            </p>

            <div className="mt-3 flex items-center justify-between">

              <p className="text-3xl font-bold">
                {filteredNotes.length}
              </p>

              <div className="rounded-xl bg-violet-500/10 p-3">
                <Search
                  size={20}
                  className="text-violet-400"
                />
              </div>

            </div>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.035]
              p-5
              backdrop-blur-xl
              transition
              hover:border-blue-400/20
              hover:bg-white/[0.05]
            "
          >
            <p className="text-sm text-slate-400">
              Workspace
            </p>

            <div className="mt-3 flex items-center justify-between">

              <p className="text-3xl font-bold">
                Personal
              </p>

              <div className="rounded-xl bg-blue-500/10 p-3">
                <FileText
                  size={20}
                  className="text-blue-400"
                />
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================== */}

        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-xl">

            <Search
              size={19}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.035]
                py-3.5
                pl-12
                pr-5
                text-sm
                text-white
                outline-none
                backdrop-blur-xl
                placeholder:text-slate-600
                transition
                focus:border-violet-500/50
                focus:ring-2
                focus:ring-violet-500/10
              "
            />

          </div>

          <div
            className="
              flex
              w-fit
              rounded-2xl
              border
              border-white/10
              bg-white/[0.035]
              p-1
              backdrop-blur-xl
            "
          >

            <button
              onClick={() => setViewMode("grid")}
              className={`
                flex
                items-center
                gap-2
                rounded-xl
                px-5
                py-2.5
                text-sm
                transition
                ${
                  viewMode === "grid"
                    ? "bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-950/20"
                    : "text-slate-500 hover:text-white"
                }
              `}
            >
              <Grid2X2 size={16} />
              Grid
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`
                flex
                items-center
                gap-2
                rounded-xl
                px-5
                py-2.5
                text-sm
                transition
                ${
                  viewMode === "list"
                    ? "bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-950/20"
                    : "text-slate-500 hover:text-white"
                }
              `}
            >
              <List size={16} />
              List
            </button>

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================== */}

        {loading ? (

          <div className="flex min-h-[400px] items-center justify-center">

            <Loader2
              size={38}
              className="animate-spin text-violet-400"
            />

          </div>

        ) : filteredNotes.length === 0 ? (

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.035]
              p-20
              text-center
              backdrop-blur-xl
            "
          >

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10">

              <StickyNote
                size={30}
                className="text-yellow-400"
              />

            </div>

            <h2 className="text-xl font-semibold">
              {search ? "No matching notes" : "No notes yet"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "Create your first note to get started."}
            </p>

            {!search && (
              <button
                onClick={openCreateForm}
                className="
                  mt-6
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-blue-600
                  px-5
                  py-3
                  font-medium
                  transition
                  hover:from-violet-500
                  hover:to-blue-500
                "
              >
                Create Note
              </button>
            )}

          </div>

        ) : viewMode === "grid" ? (

          /* =================================================
             GRID
          ================================================== */

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredNotes.map((note, index) => {

              const theme = getNoteTheme(index);

              return (
                <div
                  key={note.id}
                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    p-6
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white/[0.055]
                    hover:shadow-2xl
                    ${theme.border}
                  `}
                >

                  {/* Card glow */}

                  <div
                    className={`
                      pointer-events-none
                      absolute
                      -right-20
                      -top-20
                      h-40
                      w-40
                      rounded-full
                      blur-3xl
                      opacity-60
                      transition
                      group-hover:opacity-100
                      ${theme.glow}
                    `}
                  />

                  <div className="relative">

                    {/* Top */}

                    <div className="mb-6 flex items-start justify-between">

                      <div
                        className={`
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          ${theme.icon}
                        `}
                      >
                        <StickyNote
                          size={22}
                          className={theme.iconText}
                        />
                      </div>

                      <div className="flex items-center gap-1">

                        {index === 0 && (
                          <button
                            className="
                              rounded-xl
                              p-2
                              text-yellow-400
                              transition
                              hover:bg-yellow-500/10
                            "
                          >
                            <Star
                              size={16}
                              fill="currentColor"
                            />
                          </button>
                        )}

                        <button
                          onClick={() => openEditForm(note)}
                          className="
                            rounded-xl
                            p-2
                            text-slate-500
                            transition
                            hover:bg-white/10
                            hover:text-white
                          "
                          title="Edit note"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(note.id)}
                          className="
                            rounded-xl
                            p-2
                            text-slate-500
                            transition
                            hover:bg-red-500/10
                            hover:text-red-400
                          "
                          title="Delete note"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </div>

                    {/* Title */}

                    <h2 className="truncate text-xl font-semibold text-white">
                      {note.title || "Untitled Note"}
                    </h2>

                    {/* Content */}

                    <p
                      className="
                        mt-3
                        min-h-[100px]
                        line-clamp-4
                        text-sm
                        leading-6
                        text-slate-400
                      "
                    >
                      {note.content || "No content available."}
                    </p>

                    {/* Footer */}

                    <div
                      className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        border-t
                        border-white/5
                        pt-4
                      "
                    >

                      <span className="flex items-center gap-1.5 text-xs text-slate-500">

                        <CalendarDays size={13} />

                        {formatDate(note.created_at)}

                      </span>

                      <span
                        className={`
                          rounded-full
                          border
                          px-3
                          py-1
                          text-xs
                          ${theme.tag}
                        `}
                      >
                        Note
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          /* =================================================
             LIST
          ================================================== */

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.035]
              backdrop-blur-xl
            "
          >

            {filteredNotes.map((note, index) => {

              const theme = getNoteTheme(index);

              return (
                <div
                  key={note.id}
                  className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-white/5
                    p-5
                    transition
                    last:border-b-0
                    hover:bg-white/[0.035]
                    lg:flex-row
                    lg:items-center
                  "
                >

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      ${theme.icon}
                    `}
                  >
                    <StickyNote
                      size={21}
                      className={theme.iconText}
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate font-semibold text-white">
                      {note.title}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-500">
                      {note.content}
                    </p>

                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={13} />
                    {formatDate(note.created_at)}
                  </span>

                  <div className="flex items-center gap-1">

                    <button
                      onClick={() => openEditForm(note)}
                      className="
                        rounded-xl
                        p-2
                        text-slate-500
                        hover:bg-white/10
                        hover:text-white
                      "
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(note.id)}
                      className="
                        rounded-xl
                        p-2
                        text-slate-500
                        hover:bg-red-500/10
                        hover:text-red-400
                      "
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </main>

      {/* =====================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showForm && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/75
            p-4
            backdrop-blur-md
          "
        >

          <div
            className="
              relative
              w-full
              max-w-xl
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[#080d20]
              p-7
              shadow-2xl
              shadow-violet-950/40
            "
          >

            {/* Modal glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-violet-600/20
                blur-3xl
              "
            />

            <div className="relative">

              <div className="mb-7 flex items-start justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-yellow-500/10 p-2.5">

                      <StickyNote
                        size={20}
                        className="text-yellow-400"
                      />

                    </div>

                    <h2 className="text-xl font-semibold">
                      {editingNote ? "Edit Note" : "Create Note"}
                    </h2>

                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {editingNote
                      ? "Update your note."
                      : "Write something worth remembering."}
                  </p>

                </div>

                <button
                  onClick={closeForm}
                  className="
                    rounded-xl
                    p-2
                    text-slate-500
                    transition
                    hover:bg-white/10
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
                    Title
                  </label>

                  <input
                    autoFocus
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Note title"
                    className="
                      mt-2
                      w-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-4
                      py-3.5
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
                    Content
                  </label>

                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Write your note..."
                    rows={8}
                    className="
                      mt-2
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-4
                      py-3.5
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
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-blue-600
                    px-5
                    py-3.5
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-violet-950/30
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
                      {editingNote
                        ? "Update Note"
                        : "Create Note"}
                    </>
                  )}

                </button>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
