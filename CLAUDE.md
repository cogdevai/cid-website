# CID Website

## Project Overview
Website for Cognitive Intelligence Development (CID).

## Git Workflow (Multi-Machine Sync)

**IMPORTANT: This project is worked on from multiple computers. Always follow this workflow:**

### Starting a session (ALWAYS do this first)
```bash
git pull
```
Run `git pull` before making ANY changes. This ensures you have the latest code from the other machine.

### Ending a session (ALWAYS do this last)
```bash
git add -A && git commit -m "Description" && git push
```
Always commit and push before closing the laptop or ending work. Never leave unpushed changes.

### Reminders
- **GitHub Org**: `cogdevai` | **Repo**: `cid-website`
- **Git email**: `benan@cogdev.ai` | **Git name**: `BDA`
- If you get a merge conflict, it means changes were made on both machines — resolve carefully, don't discard either side
