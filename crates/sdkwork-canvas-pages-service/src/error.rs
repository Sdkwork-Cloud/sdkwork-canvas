use std::fmt::{Display, Formatter};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CanvasProductError {
    Validation(String),
    Conflict(String),
    NotFound(String),
    PermissionDenied(String),
    Internal(String),
}

impl Display for CanvasProductError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Validation(message) => write!(formatter, "validation failed: {message}"),
            Self::Conflict(message) => write!(formatter, "conflict: {message}"),
            Self::NotFound(message) => write!(formatter, "not found: {message}"),
            Self::PermissionDenied(message) => write!(formatter, "permission denied: {message}"),
            Self::Internal(message) => write!(formatter, "internal error: {message}"),
        }
    }
}

impl std::error::Error for CanvasProductError {}

pub fn internal_sql_error(context: &'static str) -> impl Fn(sqlx::Error) -> CanvasProductError {
    move |error| CanvasProductError::Internal(format!("{context}: {error}"))
}
