const URL_BASE = "https://localhost:44344";
async function requisicao() {
    const req = await fetch(URL_BASE + '/WeatherForecast');
    const resp = await req.json();
    console.log(resp);
}

requisicao()