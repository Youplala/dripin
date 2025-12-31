# CLAUDE.md - AI Assistant Guide for dripin

> This file serves as a comprehensive guide for AI assistants (like Claude) working on the dripin codebase. It documents the project structure, development workflows, coding conventions, and best practices.

**Last Updated:** 2025-12-31
**Repository:** Youplala/dripin
**Status:** Early Development

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflow](#development-workflow)
4. [Git Conventions](#git-conventions)
5. [Code Conventions](#code-conventions)
6. [Testing Strategy](#testing-strategy)
7. [AI Assistant Guidelines](#ai-assistant-guidelines)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## Project Overview

### About dripin

**Current Status:** New repository in initial setup phase

The dripin project is currently in its early stages. As the codebase develops, this section will be updated with:
- Project purpose and goals
- Target users/audience
- Key features and functionality
- Technology stack and dependencies

### Key Technologies

*To be determined as the project develops*

Potential stack elements to document:
- Programming language(s)
- Framework(s)
- Database(s)
- Build tools
- Package manager

---

## Codebase Structure

### Current Structure

```
dripin/
├── .git/                 # Git repository metadata
├── README.md            # Project documentation
└── CLAUDE.md           # This file - AI assistant guide
```

### Planned Structure

As the project grows, document the directory structure here:

```
dripin/
├── src/                 # Source code
│   ├── components/      # Reusable components
│   ├── utils/          # Utility functions
│   ├── services/       # Business logic/API services
│   └── ...
├── tests/              # Test files
├── docs/               # Documentation
├── config/             # Configuration files
└── ...
```

### Key Directories

*To be populated as directories are created*

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| TBD | TBD | TBD |

---

## Development Workflow

### Branch Strategy

**Active Development Branch:** `claude/claude-md-mjtzcxup59lev3vr-1Fyju`

#### Branch Naming Convention

- `main` or `master` - Production-ready code
- `claude/*` - AI assistant development branches
- Feature branches should follow: `feature/description`
- Bug fixes: `fix/description`
- Hotfixes: `hotfix/description`

#### Working with Branches

```bash
# Create new feature branch
git checkout -b feature/your-feature-name

# For Claude-specific branches
git checkout -b claude/claude-description-sessionid

# Push with upstream tracking
git push -u origin branch-name
```

### Development Cycle

1. **Plan** - Understand requirements and plan implementation
2. **Implement** - Write code following project conventions
3. **Test** - Ensure all tests pass
4. **Review** - Self-review changes for quality
5. **Commit** - Create clear, descriptive commits
6. **Push** - Push to the designated branch

---

## Git Conventions

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat(auth): add user authentication flow

Implements JWT-based authentication with refresh tokens.
Includes login, logout, and session management.

Closes #123
```

```
fix(api): resolve timeout issue in data fetching

Increased timeout threshold and added retry logic
for improved reliability.
```

### Git Operations Best Practices

#### Pushing Changes

```bash
# Always use -u flag for first push
git push -u origin <branch-name>

# Verify branch name starts with 'claude/' and includes session ID
# Otherwise push will fail with 403 error
```

#### Retry Logic for Network Issues

- Retry up to 4 times with exponential backoff: 2s, 4s, 8s, 16s
- Applies to: `git push`, `git fetch`, `git pull`

#### Fetching Updates

```bash
# Prefer specific branch fetching
git fetch origin <branch-name>

# Pull specific branch
git pull origin <branch-name>
```

---

## Code Conventions

### General Principles

1. **Clarity over cleverness** - Write code that's easy to understand
2. **Consistency** - Follow existing patterns in the codebase
3. **Simplicity** - Avoid over-engineering solutions
4. **Documentation** - Comment complex logic, not obvious code

### Style Guidelines

*To be defined based on chosen language/framework*

Common elements to document:
- Indentation (spaces vs tabs, size)
- Naming conventions (camelCase, snake_case, PascalCase)
- File naming conventions
- Import/require ordering
- Line length limits
- Comment style

### Code Organization

1. **One responsibility per file/function**
2. **Logical grouping** - Related functionality together
3. **Minimal dependencies** - Reduce coupling
4. **Clear interfaces** - Well-defined inputs/outputs

### Error Handling

*To be defined based on language*

Best practices:
- Always handle potential errors
- Provide meaningful error messages
- Log errors appropriately
- Fail gracefully

### Security Considerations

1. **Input validation** - Validate all external inputs
2. **Avoid common vulnerabilities:**
   - SQL injection
   - XSS (Cross-Site Scripting)
   - Command injection
   - CSRF (Cross-Site Request Forgery)
3. **Sensitive data** - Never commit secrets, API keys, passwords
4. **Dependencies** - Keep dependencies updated, audit regularly

---

## Testing Strategy

### Test Structure

*To be defined as testing framework is chosen*

```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test data and fixtures
```

### Testing Guidelines

1. **Write tests for:**
   - New features
   - Bug fixes
   - Critical business logic
   - Edge cases

2. **Test naming:**
   - Descriptive names that explain what's being tested
   - Follow pattern: `test_<function>_<scenario>_<expected_result>`

3. **Test coverage:**
   - Aim for high coverage on critical paths
   - Don't test framework code
   - Focus on business logic

### Running Tests

```bash
# To be updated with actual test commands
# Examples:
# npm test
# pytest
# cargo test
```

---

## AI Assistant Guidelines

### Before Making Changes

1. **Read existing code** - Never modify files you haven't read
2. **Understand context** - Review related files and dependencies
3. **Check conventions** - Follow existing patterns in the codebase
4. **Plan complex changes** - Use TodoWrite tool for multi-step tasks

### Making Changes

1. **Minimal changes** - Only change what's necessary
2. **Avoid over-engineering:**
   - Don't add unnecessary features
   - Don't refactor unrelated code
   - Don't add comments to unchanged code
   - Don't create abstractions for single use cases

3. **Security first:**
   - Review code for vulnerabilities
   - Validate inputs at boundaries
   - Handle errors properly

4. **Backwards compatibility:**
   - Don't break existing interfaces without reason
   - Delete unused code completely (no commented-out code)
   - No backwards-compatibility hacks unless required

### Communication

1. **Be concise** - Users see CLI output
2. **No emojis** - Unless explicitly requested
3. **Use markdown** - For formatting in responses
4. **Reference code** - Use `file_path:line_number` format

### Tool Usage

1. **Prefer specialized tools:**
   - Use `Read` instead of `cat`
   - Use `Edit` instead of `sed/awk`
   - Use `Write` instead of `echo >` or heredocs
   - Use `Grep` instead of `grep` command

2. **Parallel execution:**
   - Make independent tool calls in parallel
   - Sequential only when dependencies exist

3. **Use TodoWrite:**
   - Track multi-step tasks
   - Update status as you progress
   - Mark completed immediately after finishing

---

## Common Tasks

### Starting a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/feature-name

# 2. Plan the feature (use TodoWrite for complex features)

# 3. Implement the feature

# 4. Test thoroughly

# 5. Commit with descriptive message
git add .
git commit -m "feat(scope): description"

# 6. Push to remote
git push -u origin feature/feature-name
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/bug-description

# 2. Reproduce the bug

# 3. Write a test that fails (if applicable)

# 4. Fix the bug

# 5. Verify the test passes

# 6. Commit and push
git commit -m "fix(scope): description"
git push -u origin fix/bug-description
```

### Adding Documentation

1. Update relevant README files
2. Add inline comments for complex logic
3. Update this CLAUDE.md if workflows change
4. Document API changes
5. Update architecture diagrams if needed

### Refactoring Code

1. Ensure tests exist and pass
2. Make incremental changes
3. Run tests after each change
4. Commit frequently with clear messages
5. Don't change behavior, only structure

---

## Troubleshooting

### Common Issues

#### Git Push Fails with 403

**Problem:** Push rejected with HTTP 403 error

**Solution:**
- Verify branch name starts with `claude/`
- Verify branch name ends with matching session ID
- Check you're pushing to the correct remote

#### Network Timeouts

**Problem:** Git operations timeout

**Solution:**
- Retry with exponential backoff (2s, 4s, 8s, 16s)
- Check network connectivity
- Try fetching specific branches instead of all

#### Merge Conflicts

**Problem:** Conflicts when pulling/merging

**Solution:**
1. Fetch latest changes: `git fetch origin`
2. Review conflicting files
3. Resolve conflicts manually
4. Test after resolution
5. Commit resolution

### Getting Help

1. Review this CLAUDE.md file
2. Check project README.md
3. Review existing code for patterns
4. Check git history for context: `git log --oneline`

---

## Project Evolution

### When to Update This File

Update CLAUDE.md when:
- Major architectural changes occur
- New conventions are established
- Tech stack changes
- Development workflow changes
- Common issues are discovered
- New patterns emerge

### Maintenance

- Review quarterly for accuracy
- Remove outdated information
- Add new sections as needed
- Keep examples current

---

## Notes for Future Development

As the project grows, consider adding:

1. **Architecture diagrams** - Visual representation of system design
2. **API documentation** - Endpoint descriptions and examples
3. **Database schema** - Entity relationships and migrations
4. **Deployment guide** - How to deploy to various environments
5. **Performance benchmarks** - Expected performance metrics
6. **Contribution guidelines** - For team members/contributors
7. **Code review checklist** - What to look for in reviews
8. **Release process** - Versioning and release steps

---

*This document is a living guide. Keep it updated as the project evolves.*
