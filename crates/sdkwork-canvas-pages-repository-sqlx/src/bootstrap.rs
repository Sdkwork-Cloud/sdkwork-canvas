//! SDKWork Canvas Database pool bootstrap via `sdkwork-database`.

use sdkwork_database_config::DatabaseConfig;
use sdkwork_database_sqlx::{create_pool_from_config, DatabasePool, PoolError};

pub use sdkwork_canvas_database_host::{
    bootstrap_canvas_database, bootstrap_canvas_database_from_env, CanvasDatabaseHost,
};

pub type CanvasDatabasePool = DatabasePool;

pub async fn connect_canvas_database_pool_from_env() -> Result<CanvasDatabasePool, PoolError> {
    let config = DatabaseConfig::from_env("CANVAS")?;
    create_pool_from_config(config).await
}

pub async fn connect_and_bootstrap_canvas_database_from_env() -> Result<CanvasDatabaseHost, String> {
    let pool = connect_canvas_database_pool_from_env()
        .await
        .map_err(|error| error.to_string())?;
    bootstrap_canvas_database(pool).await
}
