var currentWeather: any;
fetch('https://redfieldweatherlink.azurewebsites.net/api/GetCurrentWeather').then((response) => response.json()).catch((err) => console.error(err)).then((data) => currentWeather = data);

export { currentWeather };