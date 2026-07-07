use sdkwork_canvas_pages_service::ports::{DrivePageContentPort, CanvasRepository};
use sdkwork_canvas_pages_service::service::CanvasPagesService;

#[derive(Clone)]
pub struct CanvasAppState<R, D>
where
    R: CanvasRepository,
    D: DrivePageContentPort,
{
    pub service: CanvasPagesService<R, D>,
}

impl<R, D> CanvasAppState<R, D>
where
    R: CanvasRepository,
    D: DrivePageContentPort,
{
    pub fn new(service: CanvasPagesService<R, D>) -> Self {
        Self { service }
    }
}
