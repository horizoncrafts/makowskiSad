---
name: repota-integrity
description: Verify, report and optionally fix consistency issues in the `.repota/` folder.
paths:
  - ".repota/**/*.md"
disable-model-invocation: false
icon: shield
color: blue
---

# Integrity

## Uniqueness

Run: on every additon or rename of a .md file

- a file (a task) must have unique name across all folders in `.repota/`

## Convention

Run: on every addition or edit of a .md file

- When referring to other tasks within a task body, use only the task's filename (e.g., `add-dark-mode.md`), not a file path or link.
- Any file paths mentioned in the task body must point outside the `.repota/` folder.
- Exceptions:
    - `.repota/_additional-info`