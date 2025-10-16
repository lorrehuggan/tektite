mod commands;
mod errors;
mod models;
mod services;

use commands::files;
use services::file_service::FileService;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(FileService::new())
        .invoke_handler(tauri::generate_handler![
            files::read_note,
            files::write_note,
            files::create_note,
            files::delete_note,
            files::list_notes,
            files::file_exists,
            files::get_file_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
