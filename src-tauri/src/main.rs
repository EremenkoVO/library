// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_file(file_path: String) {
    if cfg!(target_os = "windows") {
        Command::new("cmd")
                .arg("/C")
                .arg("start")
                .arg("")
                .arg(&file_path)
                .output()
                .expect("failed to execute process");
    } else if cfg!(target_os = "macos") {
        Command::new("open")
                .arg(&file_path)
                .output()
                .expect("failed to execute process");
    } else if cfg!(target_os = "linux") {
        Command::new("xdg-open")
                .arg(&file_path)
                .output()
                .expect("failed to execute process");
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, open_file])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}