
use anyhow::Result;
use hyper::{body::HttpBody, client::conn::SendRequest, Body, Request};
use tokio::net::TcpStream;
use std::{
    fs,
    sync::{atomic::AtomicUsize, Arc},
};

use clap::Parser;
use reqwest::Url;

#[derive(Debug, Parser)]
struct Config {
    #[clap(short, long, default_value_t = false)]
    pub collect: bool,

    #[clap(short, long, default_value = "198.58.97.4")]
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

struct HyperClient {
    sender: SendRequest<hyper::Body>,
    url: &'static str,
}

async fn create_client(url: &'static str) -> Result<HyperClient> {
    println!("connecting to {}", url);
    let stream = TcpStream::connect(&url).await?;

    let (sender, conn) = hyper::client::conn::handshake(stream).await?;
    let res = conn.await;
    if let Err(err) = res {
        unreachable!("connection error: {}", err);
    }

    return Ok(HyperClient {
        sender,
        url
    });
}

async fn make_request(client: &mut HyperClient) -> Result<()> {
    let req = Request::builder()
        .uri(client.url)
        .header("Accept-Encoding", "gzip")
        .body(Body::empty())?;

    let mut res = client.sender.send_request(req).await?;

    // Stream the body, writing each chunk to stdout as we get it
    // (instead of buffering and printing at the end).
    let body = res.body_mut();
    body.data().await;

    Ok(())
}

#[tokio::main]
async fn main() {
    let config = Config::parse();

    let semaphore = Arc::new(tokio::sync::Semaphore::new(config.parallel));
    let client = reqwest::Client::new();
    let Config {
        name,
        collect,
        len,
        str,
        host,
        port,
        count,
        file,
        parallel,
    } = config;

    let count = Arc::new(AtomicUsize::new(count));
    let success = Arc::new(AtomicUsize::new(0));
    let fails = Arc::new(AtomicUsize::new(0));
    let url: &'static String = Box::leak(Box::new(
        format!(
            "http://{}:{}",
            host, port,
        )
        .parse()
        .unwrap(),
    ));

    let mut client = create_client(url).await.unwrap();
    for _ in 0..10 {
        match make_request(&mut client).await {
            Ok(_) => success.fetch_add(1, std::sync::atomic::Ordering::Relaxed),
            Err(_) => fails.fetch_add(1, std::sync::atomic::Ordering::Relaxed),
        };
    }

    println!(
        "success: {}, fails: {}",
        success.load(std::sync::atomic::Ordering::Relaxed),
        fails.load(std::sync::atomic::Ordering::Relaxed)
    );
/*

    let capacity = if collect { count } else { 1 };
    let mut handles = Vec::with_capacity(capacity);
    for i in 0..count {
        let semaphore = semaphore.clone();
        let client = client.clone();
        let success = success.clone();
        let fails = fails.clone();

        let permit = semaphore.acquire_owned().await;

        let handle = tokio::spawn(async move {
            let start = std::time::Instant::now();

            // absolute timestamp in milliseconds

            let now = std::time::UNIX_EPOCH.elapsed().unwrap();

            let request = client
                .get(url.clone())
                .header("Accept-Encoding", "gzip")
                .send();

            _ = match request.await {
                Ok(_) => success.fetch_add(1, std::sync::atomic::Ordering::Relaxed),
                Err(_) => fails.fetch_add(1, std::sync::atomic::Ordering::Relaxed),
            };

            if i % 5000 == 0 {
                println!(
                    "{}: {}/{}",
                    i,
                    success.load(std::sync::atomic::Ordering::Relaxed),
                    fails.load(std::sync::atomic::Ordering::Relaxed)
                );
            }

            drop(permit);
            return (now.as_millis(), start.elapsed().as_micros() as usize);
        });

        if collect {
            handles.push(handle);
        }
    }

    if collect {
        let timings = futures::future::join_all(handles)
            .await
            .into_iter()
            .filter_map(|x| x.ok())
            .collect::<Vec<(u128, usize)>>();

        let timings = timings
            .iter()
            .map(|(x, y)| format!("{},{}", x, y))
            .collect::<Vec<String>>()
            .join("\n");

        _ = fs::write(&format!("{}.timings.csv", file), timings);

        let success: usize = success.load(std::sync::atomic::Ordering::Relaxed);

        _ = fs::write(&format!("{}.success.csv", file), success.to_string());

        let fails: usize = fails.load(std::sync::atomic::Ordering::Relaxed);

        _ = fs::write(&format!("{}.fails.csv", file), fails.to_string());
    } else {
        for _ in 0..parallel {
            let semaphore = semaphore.clone();
            _ = semaphore.acquire_owned().await;
        }
    }
*/
}
