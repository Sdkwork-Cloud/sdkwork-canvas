//! Gateway bootstrap for sdkwork-canvas.

use axum::Router;
use sdkwork_canvas_pages_service::service::NotesService;

pub struct ApplicationAssembly {
    pub router: Router,
}

pub fn assemble_application_business_router<R, D>(service: NotesService<R, D>) -> ApplicationAssembly
where
    R: sdkwork_canvas_pages_service::ports::NotesRepository,
    D: sdkwork_canvas_pages_service::ports::DrivePageContentPort,
{
    let app_router = sdkwork_routes_canvas_app_api::gateway_mount(service.clone());
    let backend_router = sdkwork_routes_canvas_backend_api::gateway_mount(service);
    let auth_router = sdkwork_routes_canvas_http_auth::gateway_mount();
    ApplicationAssembly {
        router: Router::new()
            .merge(app_router)
            .merge(backend_router)
            .merge(auth_router),
    }
}
