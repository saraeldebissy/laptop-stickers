# 🎨 Git Advisor — A Claude Skill for Designers

A Git co-pilot built specifically for designers. No jargon. No lectures. Just the right advice at the right moment — before anything runs.

---

## The Problem

Designers working in code have a different relationship with Git than developers. Not because they don't care, but because the mental model doesn't map to how they think about work.

- You think in **explorations**, not features
- You call it "saving" not "committing"
- You want to "try something" not "create a branch"
- When things break, you want **out** — not a man page

This skill bridges that gap.

---

## How It Works

The skill intercepts your natural language and translates it into the right Git action — **before** doing anything.

```
You:    "I want to try a dark mode version"

Skill:  📍 Situation: You have uncommitted changes on main
        💡 What I'd do: Save where you are, then open a fresh branch
           for the experiment so you can throw it away cleanly if needed.
        🔧 Commands I'll run:
           git add -A
           git commit -m "snapshot: working state before dark mode experiment"
           git checkout -b experiment/dark-mode
        → Want me to go ahead?
```

You confirm. It runs. If something goes wrong, it tells you how to undo it in plain English.

---

## The 5 Moments It Handles

| Moment | You say | Skill does |
|---|---|---|
| **Before experimenting** | "I want to try…" | Snapshots your work → opens experiment branch |
| **Switching context** | "Let me work on X now" | Commits or stashes first → switches safely |
| **Sharing with the team** | "Can you review this" | Commits → pushes → explains the difference |
| **When things break** | "Everything is broken" | Triages how far back → recovers cleanly |
| **End of session** | "I'm done for today" | Commits → pushes → tells you what's waiting |

---

## Commit Message System

The skill always suggests a commit message using a simple prefix system designed for design workflows:

| Prefix | When |
|---|---|
| `feat:` | Finished something real |
| `fix:` | Fixed a visual mistake or bug |
| `experiment:` | Trying something, not sure if it stays |
| `snapshot:` | Saving state before a risky change |
| `wip:` | Mid-way through something |

---

## Key Concepts — In Designer Language

The skill explains Git terms the way a designer thinks:

- **Commit** = Saving to your local machine. Like Save in Figma. Only you can see it.
- **Push** = Sending it to GitHub. Now the team can see it.
- **Branch** = A parallel version of your work. Like a duplicate Figma page, but for code.
- **Stash** = A temporary pocket. Not a real save.
- **Merge** = Bringing your experiment back into the main version.
- **Worktree** = Two branches open at the same time, like two Figma files side by side.

It explains each concept **once**, when relevant. It never lectures twice.

---

## Branch Naming

The skill always suggests clean, readable branch names:

✅ `experiment/dark-mode`
✅ `feat/nav-redesign`
✅ `fix/mobile-padding`

❌ `final`
❌ `new-new-FINAL`
❌ `test123`

---

## Installation

1. Download `git-advisor.skill`
2. Go to [claude.ai](https://claude.ai) → Settings → Skills
3. Drag the `.skill` file in

That's it.

---

## Invocation

Two ways to use it:

**Natural language** — just talk about what you want to do. The skill recognizes intent automatically:
> "I want to try a different layout for the hero section"
> "I'm done for today"
> "Everything looks broken"

**Explicit** — call it directly:
> `hey git` or `@git`

---

## What It Won't Do

To keep things safe and simple, this skill intentionally avoids:

- **Rebase** — too risky for non-developers, causes more harm than good
- **Merge conflicts** — needs a visual tool, not a chat interface
- **GitHub PRs** — out of scope for v1
- **CI/CD / Actions** — not a designer concern

---

## Philosophy

> A senior dev friend who's worked with designers before and doesn't make you feel dumb.

- Always advises before acting
- Always confirms before running commands
- Always offers an undo path after every action
- Never assumes you know what `HEAD` means

---

## Built with

- [Claude Skills](https://claude.ai) — the skill format that powers this
- Designed through a collaborative scoping session between a designer and Claude

---

## Contributing

Found a scenario it doesn't handle? Open an issue with:
- What you said
- What you expected
- What happened instead

PRs welcome.
