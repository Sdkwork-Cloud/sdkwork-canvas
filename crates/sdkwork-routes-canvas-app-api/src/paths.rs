pub const CANVAS_PREFIX: &str = "/app/v3/api/canvas";

pub const WORKSPACES: &str = "/app/v3/api/canvas/workspaces";
pub const WORKSPACE_BOOTSTRAP: &str = "/app/v3/api/canvas/workspaces/{workspace_id}/bootstrap";
pub const WORKSPACE_PAGES: &str = "/app/v3/api/canvas/workspaces/{workspace_id}/boards";
pub const PAGE: &str = "/app/v3/api/canvas/boards/{board_id}";
pub const PAGE_REMOTE_APPLY: &str = "/app/v3/api/canvas/boards/{board_id}/remote_apply";
pub const PAGE_CONTENT: &str = "/app/v3/api/canvas/boards/{board_id}/content";
pub const PAGE_VERSIONS: &str = "/app/v3/api/canvas/boards/{board_id}/versions";
pub const PAGE_VERSION_RESTORE: &str =
    "/app/v3/api/canvas/boards/{board_id}/versions/{drive_version_id}/restore";
pub const PAGE_AI_SUGGESTIONS: &str = "/app/v3/api/canvas/boards/{board_id}/ai_suggestions";
pub const AI_SUGGESTION_ACCEPT: &str = "/app/v3/api/canvas/ai_suggestions/{ai_suggestion_id}/accept";
pub const AI_SUGGESTION_REJECT: &str = "/app/v3/api/canvas/ai_suggestions/{ai_suggestion_id}/reject";
pub const AI_SUGGESTION_APPLY: &str = "/app/v3/api/canvas/ai_suggestions/{ai_suggestion_id}/apply";
pub const AI_SUGGESTION_FEEDBACK: &str =
    "/app/v3/api/canvas/ai_suggestions/{ai_suggestion_id}/feedback";
pub const SEARCH: &str = "/app/v3/api/canvas/search";
pub const AI_JOBS: &str = "/app/v3/api/canvas/ai_jobs";
