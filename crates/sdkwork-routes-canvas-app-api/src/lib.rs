pub mod context;
pub mod dto;
pub mod envelope;
pub mod error;
pub mod handlers;
pub mod http_route_manifest;
pub mod manifest;
pub mod paths;
pub mod routes;
pub mod state;
pub mod web_bootstrap;

pub use http_route_manifest::app_route_manifest;
pub use manifest::route_manifest_json;
pub use web_bootstrap::{
    canvas_app_public_path_prefixes, wrap_router_with_dev_web_framework,
    wrap_router_with_web_framework, wrap_router_with_web_framework_from_env,
};

pub fn gateway_route_manifest() -> &'static str {
    route_manifest_json()
}

pub fn gateway_mount<R, D>(service: sdkwork_canvas_pages_service::service::CanvasPagesService<R, D>) -> axum::Router
where
    R: sdkwork_canvas_pages_service::ports::CanvasRepository,
    D: sdkwork_canvas_pages_service::ports::DrivePageContentPort,
{
    routes::build_router(service)
}
