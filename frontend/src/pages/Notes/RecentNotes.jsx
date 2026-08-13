import { useEffect, useState } from "react";
import {
  FileText,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";
import Skeleton from "../../components/UI/Skeleton";

export default function RecentNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/notes");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.notes || [];

      setNotes(data.slice(0, 5));
    } catch (err) {
      console.error("FAILED TO LOAD NOTES");
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);
      console.error("Message:", err.message);

      setError(true);
      setNotes([]);
    } finally {
      setLoading(false);
    }
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
            <div className="rounded-xl bg-pink-500/10 p-2.5">
              <FileText
                size={20}
                className="text-pink-400"
              />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Recent Notes
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Your latest ideas and notes
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            border-pink-500/20
            bg-pink-500/10
            p-3
          "
        >
          <FileText
            size={20}
            className="text-pink-400"
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
            Unable to load notes
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please check your connection and try again.
          </p>

          <button
            onClick={fetchNotes}
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
      {!loading && !error && notes.length === 0 && (
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
              bg-pink-500/10
            "
          >
            <FileText
              size={28}
              className="text-pink-400"
            />
          </div>

          <p className="font-medium text-slate-300">
            No notes yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Create a note to see it here.
          </p>
        </div>
      )}

      {/* Notes List */}
      {!loading && !error && notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
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
                hover:border-pink-500/20
                hover:bg-white/[0.06]
                hover:shadow-lg
                hover:shadow-pink-950/20
              "
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className="
                    shrink-0
                    rounded-xl
                    bg-pink-500/10
                    p-2
                  "
                >
                  <FileText
                    size={18}
                    className="text-pink-400"
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
                        group-hover:text-pink-300
                      "
                    >
                      {note.title || "Untitled Note"}
                    </h3>

                    <ArrowUpRight
                      size={15}
                      className="
                        shrink-0
                        text-slate-600
                        opacity-0
                        transition-all
                        duration-200
                        group-hover:text-pink-400
                        group-hover:opacity-100
                      "
                    />
                  </div>

                  {(note.content || note.description) && (
                    <p
                      className="
                        mt-1
                        line-clamp-2
                        text-sm
                        text-slate-500
                      "
                    >
                      {note.content || note.description}
                    </p>
                  )}

                  {note.created_at && (
                    <p className="mt-2 text-xs text-slate-600">
                      {new Date(
                        note.created_at
                      ).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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