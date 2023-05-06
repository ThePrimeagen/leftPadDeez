use std::{
    fs,
    sync::{atomic::AtomicUsize, Arc},
};

use clap::Parser;
use reqwest::Url;

#[derive(Debug, Parser)]
struct Config {
    #[clap(short, long, default_value = "0.0.0.0")]
    pub host: String,

    #[clap(short, long, default_value_t = 42068)]
    pub port: usize,

    #[clap(short, long, default_value_t = 8)]
    pub parallel: usize,

    #[clap(short, long, default_value_t = 100000)]
    pub count: usize,

    #[clap(short, long, default_value = "leftPadEmber")]
    pub name: String,

    #[clap(short, long, default_value = "foo")]
    pub str: String,

    #[clap(short, long, default_value_t = 100)]
    pub len: usize,

    #[clap(short, long, default_value = "results")]
    pub file: String,
}

#[tokio::main]
async fn main() {
    let config = Config::parse();

    let semaphore = Arc::new(tokio::sync::Semaphore::new(config.parallel));
    let client = reqwest::Client::new();
    let Config {
        name,
        len,
        str,
        host,
        port,
        count,
        file,
        ..
    } = config;

    let success = Arc::new(AtomicUsize::new(0));
    let fails = Arc::new(AtomicUsize::new(0));
    let url: &'static Url = Box::leak(Box::new(
        format!(
            "http://{}:{}?name={}&len={}&str={}",
            host, port, name, len, str
        )
        .parse()
        .unwrap(),
    ));

    let mut handles = Vec::with_capacity(count);
    for _ in 0..count {
        let semaphore = semaphore.clone();
        let client = client.clone();
        let success = success.clone();
        let fails = fails.clone();

        handles.push(tokio::spawn(async move {
            let permit = semaphore.acquire_owned().await;
            let start = std::time::Instant::now();

            _ = match client.get(url.clone()).send().await {
                Ok(_) => success.fetch_add(1, std::sync::atomic::Ordering::Relaxed),
                Err(_) => fails.fetch_add(1, std::sync::atomic::Ordering::Relaxed),
            };

            drop(permit);
            return start.elapsed().as_micros() as usize;
        }));
    }

    let timings = futures::future::join_all(handles)
        .await
        .into_iter()
        .filter_map(|x| x.ok())
        .collect::<Vec<usize>>();

    let timings = timings
        .iter()
        .map(|x| x.to_string())
        .collect::<Vec<String>>()
        .join("\n");

    _ = fs::write(&format!("{}.timings.csv", file), timings);

    let success: usize = success.load(std::sync::atomic::Ordering::Relaxed);

    _ = fs::write(&format!("{}.success.csv", file), success.to_string());

    let fails: usize = fails.load(std::sync::atomic::Ordering::Relaxed);

    _ = fs::write(&format!("{}.fails.csv", file), fails.to_string());
}
