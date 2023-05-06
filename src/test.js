async function run() {
    const result = await fetch("http://0.0.0.0:42068?name=buffer&str=foo&len=5");
    console.log(result);
    console.log(await result.text());
}

run();



