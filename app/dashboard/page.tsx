"use client";

import { useEffect, useState } from "react";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";

import ReusableModal from "@/components/ReusableModal";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getApiErrorMessage,
  Question,
  QuestionForm,
  useCreateQuestion,
  useDeleteQuestion,
  useQuestions,
  useUpdateQuestion,
  Difficulty,
} from "@/hooks/useQuestions";
import { TableSkeleton } from "@/components/TableSkeleton";

const emptyForm: QuestionForm = {
  title: "",
  description: "",
  topic: "",
  difficulty: "Easy",
};

export default function Dashboard() {
  const [form, setForm] = useState<QuestionForm>(emptyForm);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"" | Difficulty>("");
  const [topicFilter, setTopicFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const debouncedTopicFilter = useDebounce(topicFilter, 500);

  const {
    data,
    isLoading,
    isFetching,
    error: questionsError,
    refetch,
  } = useQuestions({
    page,
    limit,
    search: debouncedSearch,
    difficulty: difficultyFilter || undefined,
    topic: debouncedTopicFilter,
  });

  const isSearching = isFetching && !isLoading;

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const questions = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

  const submitting =
    createQuestion.isPending ||
    updateQuestion.isPending ||
    deleteQuestion.isPending;

  const tableError = questionsError ? getApiErrorMessage(questionsError) : "";

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, difficultyFilter, debouncedTopicFilter]);

  function openAddModal() {
    setModalMode("add");
    setSelectedQuestion(null);
    setForm(emptyForm);
    setError("");
    setIsFormModalOpen(true);
  }

  function openEditModal(question: Question) {
    setModalMode("edit");
    setSelectedQuestion(question);

    setForm({
      title: question.title || "",
      description: question.description || "",
      topic: question.topic || "",
      difficulty: question.difficulty || "Easy",
    });

    setError("");
    setIsFormModalOpen(true);
  }

  function openDeleteModal(question: Question) {
    setSelectedQuestion(question);
    setError("");
    setIsDeleteModalOpen(true);
  }

  function closeFormModal() {
    if (submitting) return;

    setIsFormModalOpen(false);
    setSelectedQuestion(null);
    setForm(emptyForm);
    setError("");
  }

  function closeDeleteModal() {
    if (submitting) return;

    setIsDeleteModalOpen(false);
    setSelectedQuestion(null);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");

      if (modalMode === "edit") {
        if (!selectedQuestion?._id) return;

        await updateQuestion.mutateAsync({
          id: selectedQuestion._id,
          payload: form,
        });
      } else {
        await createQuestion.mutateAsync(form);
      }

      closeFormModal();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleDelete() {
    if (!selectedQuestion?._id) return;

    try {
      setError("");

      await deleteQuestion.mutateAsync(selectedQuestion._id);

      closeDeleteModal();

      if (questions.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#191919] text-white">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Dashboard
            </h1>

            <p className="mt-2 text-white/60">Manage your questions.</p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90"
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_180px_180px_auto]"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title..."
              className="w-full rounded-xl border border-white/10 bg-[#222] py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-white/40 focus:border-white/30"
            />

            {isSearching && (
              <Loader2
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-white/40"
              />
            )}
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value as "" | Difficulty);
              setPage(1);
            }}
            className="rounded-xl border border-white/10 bg-[#222] px-4 py-3 text-sm outline-none transition focus:border-white/30"
          >
            <option value="">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <input
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              setPage(1);
            }}
            placeholder="Topic..."
            className="rounded-xl border border-white/10 bg-[#222] px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-white/30"
          />

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </form>

        {(error || tableError) && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error || tableError}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b border-white/10 bg-white/[0.04]">
                <tr>
                  <th className="w-20 px-5 py-4 text-sm font-medium text-white/70">
                    Sr No.
                  </th>

                  <th className="px-5 py-4 text-sm font-medium text-white/70">
                    Title
                  </th>

                  <th className="px-5 py-4 text-sm font-medium text-white/70">
                    Topic
                  </th>

                  <th className="px-5 py-4 text-sm font-medium text-white/70">
                    Difficulty
                  </th>

                  <th className="px-5 py-4 text-sm font-medium text-white/70">
                    Created At
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-medium text-white/70">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <TableSkeleton />
                ) : questions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-white/60"
                    >
                      No questions found.
                    </td>
                  </tr>
                ) : (
                  questions.map((question, index) => (
                    <tr
                      key={question._id}
                      className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-white/60">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {question.title}
                          </p>

                          {question.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-white/50">
                              {question.description}
                            </p>
                          )}

                          {question.slug && (
                            <p className="mt-1 text-xs text-white/40">
                              {question.slug}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-white/70">
                        {question.topic || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs capitalize text-white/80">
                          {question.difficulty || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-white/60">
                        {question.createdAt
                          ? new Date(question.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(question)}
                            className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() => openDeleteModal(question)}
                            className="rounded-lg border border-red-500/20 p-2 text-red-300 transition hover:bg-red-500/10"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-5 py-4 md:flex-row">
            <p className="text-sm text-white/50">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <ReusableModal
        open={isFormModalOpen}
        title={modalMode === "add" ? "Add Question" : "Edit Question"}
        description={
          modalMode === "add"
            ? "Create a new question."
            : "Update this question."
        }
        onClose={closeFormModal}
        footer={
          <>
            <button
              type="button"
              onClick={closeFormModal}
              disabled={submitting}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="question-form"
              disabled={submitting}
              className="rounded-xl bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : modalMode === "add"
                  ? "Create"
                  : "Update"}
            </button>
          </>
        }
      >
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form id="question-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">Title</label>

            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter question title"
              className="w-full rounded-xl border border-white/10 bg-[#191919] px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-white/30"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter question description"
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#191919] px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-white/30"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Topic</label>

            <input
              value={form.topic}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  topic: e.target.value,
                }))
              }
              placeholder="Example: React, MongoDB, JavaScript"
              className="w-full rounded-xl border border-white/10 bg-[#191919] px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-white/30"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Difficulty
            </label>

            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  difficulty: e.target.value as Difficulty,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#191919] px-4 py-3 text-sm outline-none transition focus:border-white/30"
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </form>
      </ReusableModal>

      <ReusableModal
        open={isDeleteModalOpen}
        title="Delete Question"
        description="This will soft delete the question."
        onClose={closeDeleteModal}
        footer={
          <>
            <button
              onClick={closeDeleteModal}
              disabled={submitting}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={submitting}
              className="rounded-xl bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <p className="text-sm text-white/70">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">
            {selectedQuestion?.title}
          </span>
          ?
        </p>
      </ReusableModal>
    </main>
  );
}
