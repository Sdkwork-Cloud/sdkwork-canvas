use sdkwork_canvas_pages_service::domain::CanvasActorContext;
use sdkwork_web_core::WebRequestContext;

use crate::actor_context::actor_context_from_web_request;
use crate::permissions::require_permission;
use crate::response::{ApiProblem, ApiResult};

pub fn authenticated_actor(
    app_ctx: &WebRequestContext,
    permission: &str,
) -> ApiResult<CanvasActorContext> {
    require_permission(app_ctx, permission).map_err(ApiProblem::from_auth)?;
    actor_context_from_web_request(app_ctx).map_err(ApiProblem::from_auth)
}
