"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Check, Plus, RotateCcw, Trash2, Pencil, X } from "lucide-react";
import { AccountAvatar } from "@/components/account-avatar";
import { HealthPill } from "@/components/health-pill";
import { accounts, actionItems } from "@/lib/mockData";
import { cn, formatRelative, priorityClasses } from "@/lib/utils";
import type { ActionItem } from "@/lib/types";

const TODAY = new Date("2026-05-19");

// Collapse all nespresso-* accounts into one display entry
const nesAccounts = accounts.filter((a) => a.id.startsWith("nespresso"));
const nonNesAccounts = accounts.filter((a) => !a.id.startsWith("nespresso"));

const displayAccounts = [
  ...nonNesAccounts,
  {
    id: "nespresso",
    name: "Nespresso",
    initials: "NN",
    logoColor: "bg-amber-700",
    health: "watch" as const,
    healthScore: 0,
    industry: "Food & Beverage",
    segment: "Enterprise" as const,
    region: "EMEA / AMER",
  },
].sort((a, b) => a.name.localeCompare(b.name));

function normalizeId(id: string) {
  return id.startsWith("nespresso") ? "nespresso" : id;
}

// ── Action card ──────────────────────────────────────────────────────────────

interface CardProps {
  item: ActionItem;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (v: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onResolve?: () => void;
  onReopen?: () => void;
  onDelete: () => void;
  showAccount: boolean;
  resolved?: boolean;
}

function ActionCard({
  item,
  editingId,
  editTitle,
  setEditTitle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onResolve,
  onReopen,
  onDelete,
  showAccount,
  resolved,
}: CardProps) {
  const editing = editingId === item.id;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  return (
    <div
      className={cn(
        "group rounded-lg border bg-card p-3 shadow-sm transition-colors",
        resolved && "opacity-60",
      )}
    >
      {/* title row */}
      <div className="flex items-start gap-2">
        {/* resolve / reopen toggle */}
        <button
          onClick={resolved ? onReopen : onResolve}
          title={resolved ? "Reopen" : "Mark resolved"}
          className={cn(
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-2 transition-colors",
            resolved
              ? "bg-emerald-500 ring-emerald-500 hover:bg-white hover:ring-slate-300"
              : "bg-white ring-slate-300 hover:bg-emerald-50 hover:ring-emerald-400",
          )}
        >
          {resolved && <Check className="h-2.5 w-2.5 text-white" />}
        </button>

        {/* title / edit input */}
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              ref={ref}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveEdit();
                if (e.key === "Escape") onCancelEdit();
              }}
              className="w-full rounded border bg-background px-1 py-0.5 text-sm outline-none ring-2 ring-ring"
            />
          ) : (
            <p
              className={cn(
                "text-sm font-medium leading-snug",
                resolved && "line-through text-muted-foreground",
              )}
            >
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </p>
          )}
        </div>

        {/* action buttons — visible on hover */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {editing ? (
            <>
              <button onClick={onSaveEdit} className="rounded p-0.5 hover:bg-slate-100" title="Save">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              </button>
              <button onClick={onCancelEdit} className="rounded p-0.5 hover:bg-slate-100" title="Cancel">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </>
          ) : (
            <>
              <button onClick={onStartEdit} className="rounded p-0.5 hover:bg-slate-100" title="Edit">
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </button>
              <button onClick={onDelete} className="rounded p-0.5 hover:bg-slate-100" title="Delete">
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* meta row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
            priorityClasses[item.priority],
          )}
        >
          {item.priority}
        </span>
        {showAccount && (
          <span className="text-muted-foreground">{item.accountName}</span>
        )}
        <span
          className={cn(
            "ml-auto tabular-nums",
            !resolved && item.dueDate
              ? formatRelative(item.dueDate, TODAY).includes("ago")
                ? "text-rose-600"
                : "text-muted-foreground"
              : "text-muted-foreground",
          )}
        >
          {resolved ? `Resolved` : `Due ${formatRelative(item.dueDate, TODAY)}`}
        </span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ActionsPage() {
  const [items, setItems] = useState<ActionItem[]>(() => actionItems.map((a) => ({ ...a })));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const newInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingNew) newInputRef.current?.focus();
  }, [addingNew]);

  const filtered = selectedId
    ? items.filter((a) => normalizeId(a.accountId) === selectedId)
    : items;

  const openItems = filtered.filter((a) => a.status !== "done");
  const resolvedItems = filtered.filter((a) => a.status === "done");

  function resolve(id: string) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: "done" as const } : a)));
  }
  function reopen(id: string) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: "open" as const } : a)));
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }
  function startEdit(item: ActionItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
  }
  function saveEdit(id: string) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, title: editTitle } : a)));
    setEditingId(null);
  }
  function addItem() {
    const title = newTitle.trim();
    if (!title) { setAddingNew(false); return; }
    const accountId = selectedId ?? "puma";
    const account = displayAccounts.find((a) => a.id === accountId);
    setItems((prev) => [
      {
        id: `task-custom-${Date.now()}`,
        accountId,
        accountName: account?.name ?? accountId,
        title,
        description: "",
        priority: "medium" as const,
        status: "open" as const,
        dueDate: TODAY.toISOString().split("T")[0],
        owner: "Daniel Schechter",
      },
      ...prev,
    ]);
    setNewTitle("");
    setAddingNew(false);
  }

  const selectedName = selectedId ? displayAccounts.find((a) => a.id === selectedId)?.name : null;

  return (
    // Break out of the layout's max-w / padding to fill the viewport
    <div className="-mx-6 -my-8 flex h-[calc(100vh-3.5rem)] flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b bg-background px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Action tracker</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {openItems.length} open · {resolvedItems.length} resolved
            {selectedName && (
              <> · <span className="font-medium text-foreground">{selectedName}</span></>
            )}
          </p>
        </div>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Dashboard
        </Link>
      </div>

      {/* board */}
      <div className="grid flex-1 grid-cols-[280px_1fr_1fr] divide-x overflow-hidden">

        {/* ── col 1: accounts ── */}
        <div className="flex flex-col overflow-hidden bg-slate-50/60">
          <div className="border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Accounts · {displayAccounts.length}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <button
              onClick={() => setSelectedId(null)}
              className={cn(
                "w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100",
                !selectedId && "bg-slate-200 font-medium",
              )}
            >
              All accounts
            </button>
            {displayAccounts.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id === selectedId ? null : a.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left transition-colors hover:bg-slate-100",
                  selectedId === a.id && "bg-slate-200",
                )}
              >
                <AccountAvatar initials={a.initials} color={a.logoColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{a.industry}</div>
                </div>
                <HealthPill status={a.health} />
              </button>
            ))}
          </div>
        </div>

        {/* ── col 2: open ── */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Open · {openItems.length}
            </span>
            <button
              onClick={() => setAddingNew(true)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-slate-50 hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {addingNew && (
              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <input
                  ref={newInputRef}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem();
                    if (e.key === "Escape") { setAddingNew(false); setNewTitle(""); }
                  }}
                  placeholder="Action title…"
                  className="w-full bg-transparent text-sm outline-none"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={addItem}
                    className="rounded px-2 py-1 text-xs font-medium bg-slate-900 text-white hover:bg-slate-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setAddingNew(false); setNewTitle(""); }}
                    className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {openItems.length === 0 && !addingNew && (
              <p className="py-12 text-center text-sm text-muted-foreground">No open actions.</p>
            )}
            {(() => {
              const appItems = openItems.filter((a) => !a.url);
              const importedItems = openItems.filter((a) => !!a.url);
              const renderCard = (a: ActionItem) => (
                <ActionCard
                  key={a.id}
                  item={a}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onStartEdit={() => startEdit(a)}
                  onSaveEdit={() => saveEdit(a.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onResolve={() => resolve(a.id)}
                  onDelete={() => remove(a.id)}
                  showAccount={!selectedId}
                />
              );
              return (
                <>
                  {appItems.map(renderCard)}
                  {appItems.length > 0 && importedItems.length > 0 && (
                    <div className="flex items-center gap-2 py-1">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                        Imported
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  {importedItems.map(renderCard)}
                </>
              );
            })()}
          </div>
        </div>

        {/* ── col 3: resolved ── */}
        <div className="flex flex-col overflow-hidden bg-slate-50/40">
          <div className="border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Resolved · {resolvedItems.length}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {resolvedItems.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">Nothing resolved yet.</p>
            )}
            {resolvedItems.map((a) => (
              <ActionCard
                key={a.id}
                item={a}
                editingId={editingId}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                onStartEdit={() => startEdit(a)}
                onSaveEdit={() => saveEdit(a.id)}
                onCancelEdit={() => setEditingId(null)}
                onReopen={() => reopen(a.id)}
                onDelete={() => remove(a.id)}
                showAccount={!selectedId}

                resolved
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
