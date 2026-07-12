"use client";

import { useEffect, useState } from "react";
import { Edit, Loader2, Plus, Search, Star, Trash2 } from "lucide-react";

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
  useUpdateRevisionStatus,
  Difficulty,
} from "@/hooks/useQuestions";
import { TableSkeleton } from "@/components/TableSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 500);

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
  });

  const isSearching = isFetching && !isLoading;

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();
  const updateRevisionStatus = useUpdateRevisionStatus();

  const questions = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

  const submitting =
    createQuestion.isPending ||
    updateQuestion.isPending ||
    deleteQuestion.isPending;

  const tableError = questionsError ? getApiErrorMessage(questionsError) : "";

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, difficultyFilter]);

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

  async function handleRevision(
    questionId: string,
    currentRevisionStatus: boolean,
  ) {
    try {
      setError("");

      await updateRevisionStatus.mutateAsync({
        id: questionId,
        revision: !currentRevisionStatus,
      });
    } catch (error) {
      setError(getApiErrorMessage(error));
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">Manage your questions.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus size={18} />
              Add Question
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_220px_auto]"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title..."
              className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring"
            />

            {isSearching && (
              <Loader2
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
              />
            )}
          </div>

          <Select
            value={difficultyFilter || "all"}
            onValueChange={(value) => {
              setDifficultyFilter(value === "all" ? "" : (value as Difficulty));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11 min-h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground shadow-none data-[size=default]:h-11 focus:ring-1 focus:ring-ring focus:ring-offset-0">
              <SelectValue placeholder="All Difficulty" />
            </SelectTrigger>

            <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground">
              <SelectItem value="all">All Difficulty</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="h-12 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </form>

        {(error || tableError) && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error || tableError}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="w-20 px-5 py-4 text-sm font-medium text-muted-foreground">
                    Sr No.
                  </th>

                  <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                    Title
                  </th>

                  <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                    Topic
                  </th>

                  <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                    Difficulty
                  </th>

                  <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                    Created At
                  </th>
                  <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                    Revision
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-medium text-muted-foreground">
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
                      colSpan={7}
                      className="px-5 py-10 text-center text-muted-foreground"
                    >
                      No questions found.
                    </td>
                  </tr>
                ) : (
                  questions.map((question, index) => (
                    <tr
                      key={question._id}
                      className="border-b border-border transition last:border-b-0 hover:bg-muted/40"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-muted-foreground">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {question.title}
                          </p>

                          {question.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {question.description}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {question.topic || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs capitalize text-muted-foreground">
                          {question.difficulty || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {question.createdAt
                          ? new Date(question.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleRevision(
                              question._id,
                              question.revision ?? false,
                            )
                          }
                          className={`rounded-lg p-2 transition hover:bg-muted ${
                            question.revision
                              ? "text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                          aria-label={
                            question.revision
                              ? "Remove from revision"
                              : "Mark for revision"
                          }
                          title={
                            question.revision
                              ? "Remove from revision"
                              : "Mark for revision"
                          }
                        >
                          <Star
                            size={20}
                            className={question.revision ? "fill-current" : ""}
                          />
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(question)}
                            className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() => openDeleteModal(question)}
                            className="rounded-lg border border-red-500/30 p-2 text-red-500 transition hover:bg-red-500/10"
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

          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
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
              className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="question-form"
              disabled={submitting}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        <form id="question-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Title
            </label>

            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter question title"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
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
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Topic
            </label>

            <input
              value={form.topic}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  topic: e.target.value,
                }))
              }
              placeholder="Example: React, MongoDB, JavaScript"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Difficulty
            </label>

            <Select
              value={form.difficulty}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  difficulty: value as Difficulty,
                }))
              }
            >
              <SelectTrigger className="h-auto w-full rounded-xl border-input bg-background px-4 py-3 text-sm">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
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
              className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
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
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">
            {selectedQuestion?.title}
          </span>
          ?
        </p>
      </ReusableModal>
    </main>
  );
}
