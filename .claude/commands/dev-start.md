---
description: "Start development on next V1.0 story following systematic workflow"
allowed-tools: ["Task", "Read", "Edit", "MultiEdit", "TodoWrite", "TodoRead", "Bash", "Glob", "Grep"]
---

# Gourmoire Development Workflow

Execute systematic story-by-story development following the documented approach. Use context7 mcp to ensure accuracy and quality

## Story-by-Story Development Approach
Complete one full user story at a time following ROADMAP.md V1.0 priority order. Each story represents a complete user-facing feature with clear acceptance criteria.

## Multi-Agent Task Execution
- Use subagents for any steps that can be parallelized
- For each subagent deployed, create a dedicated supervisor subagent to validate their work
- Ensure all subagent outputs are integrated and tested

## Progress Tracking Requirements
Update all project files as work progresses:
- **TASKS.md**: Mark individual tasks as in_progress → completed
- **STORIES.md**: Update story status and progress counters
- **EPICS.md**: Update epic completion percentages
- **ROADMAP.md**: Update release progress and completion status

## Execution Steps
1. **Story Selection**: Read ROADMAP.md to identify next V1.0 priority story
2. **Task Review**: Review technical tasks in TASKS.md for the selected story
3. **Understand Context**: Review STORIES.md and EPICS.md to have a better understanding of the tasks
4. **Parallel Execution**: Launch multiple agents for concurrent work on story tasks
5. **Progress Updates**: Continuously update task/story status in project files
6. **Story Completion**: Verify all acceptance criteria met before moving to next story

## Quality Gates
- Run `npm run lint` and `npm run type-check` after each story completion
- Verify all acceptance criteria in STORIES.md before marking story complete
- Maintain working application state throughout development
- Test core user flows end-to-end before story sign-off

## Story Completion Summary
After validating story completion, provide a comprehensive summary including:
- **Story Completed**: Which user story was finished with ID and title
- **Tasks Accomplished**: List of technical tasks completed with categories [API], [DB], [UI], [TEST]
- **Files Created/Modified**: Summary of new files and major changes made
- **Epic Progress**: Updated epic completion percentage
- **Next Story**: Identification of the next priority story to work on
- **Release Progress**: Overall V1.0 progress update
- **Quality Verification**: Confirmation that lint, type-check, and acceptance criteria passed

## Starting Priority
Begin with foundational stories that other work depends on:
- Authentication stories (AU-01, AU-02) for security foundation
- Testing Infrastructure (PF-01)
- Core Recipe Management (RM-01, RM-04) for basic CRUD operations
- Follow dependency chains outlined in TASKS.md

---

**BEGIN WORKFLOW EXECUTION NOW**