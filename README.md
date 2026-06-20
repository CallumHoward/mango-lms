# mango-lms

A TanStack Start (React + TypeScript) application, scaffolded from the
[`tanstack-react-ts-starter`](https://github.com/CallumHoward/tanstack-react-ts-starter)
template.

## Development

```bash
pnpm install      # install dependencies
pnpm dev          # start the dev server on http://localhost:3000
pnpm build        # production build
pnpm test         # run unit tests (Vitest)
pnpm test:e2e     # run end-to-end tests (Playwright)
pnpm lint         # lint with oxlint
pnpm check        # type-check
pnpm format       # format with oxfmt
```

## Updating from the template

This repo was created from the
[`tanstack-react-ts-starter`](https://github.com/CallumHoward/tanstack-react-ts-starter)
template. The two histories are unrelated (the project was scaffolded with a
fresh `git init` rather than forked), so the first merge had to be linked
explicitly. That link now exists, so future updates are a normal merge.

### One-time setup

Add the template as a remote named `template` (already done in this repo, but
needed on a fresh clone):

```bash
git remote add template https://github.com/CallumHoward/tanstack-react-ts-starter.git
```

### Pulling in upstream changes

```bash
git fetch template
git merge template/main
```

Resolve any conflicts (typically `package.json`, `oxlint.config.ts`, and
`pnpm-lock.yaml`), keeping project-specific values such as the `name` field in
`package.json`. After resolving, regenerate/validate the lockfile and commit:

```bash
pnpm install --lockfile-only
git commit
```

> **Note:** The very first sync used
> `git merge template/main --allow-unrelated-histories` to stitch the two
> histories together. That flag is only needed once and should not be used for
> subsequent merges.
