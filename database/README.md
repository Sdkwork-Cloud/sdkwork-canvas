# Canvas Database

Database module `canvas` (`database/database.manifest.json`).

## Layout

- `contract/schema.yaml` — portable schema (`canvas_*` tables)
- `ddl/baseline/{engine}/0001_canvas_baseline.sql` — initialization DDL
- `migrations/{engine}/` — post-GA forward migrations
- `seeds/` — locale-aware seeds

Lifecycle: `pnpm db:plan`, `db:init`, `db:migrate`, `db:bootstrap`, `db:drift:check`.

Authority: `../../sdkwork-specs/DATABASE_FRAMEWORK_SPEC.md`
