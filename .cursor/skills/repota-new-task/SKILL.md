---
name: repota-new-task
description: Create a new repository task as one Markdown file in the .repota inbox. Use when adding, filing, or tracking a new repota task.
---

# New repota task

Create one Markdown file directly in `.repota/`. That directory is the inbox and has no status. Do not place a new task in a status subdirectory.

## Filename

Use a descriptive `kebab-case.md` name, such as `add-dark-mode.md`.

- Unique across `.repota/` and every status subdirectory.
- Keep it for the life of the task. Do not reuse it for other work.

## Body

Plain Markdown. No frontmatter. No fields for id, status, assignee, dependencies, date, type, priority, or external reference.

Write the work, acceptance criteria, references, etc as text. Cite another task by filename only (`add-dark-mode.md`), never by a path link. Checkboxes record progress inside the file. An estimate, if any, is also a paragraph with brief cover about reasoning.

Match existing task files in this repo when any exist.

### No redundancy
Do not copy any context into a task file, always reference. If tasks repeat the same text, create a reference file (location depending on project structure, eventually propose something). 


