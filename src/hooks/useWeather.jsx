import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	clear,
	clouds,
	drizzle,
	mist,
	rain,
	snow,
	thunderstorm,
	clearI,
	cloudsI,
	drizzleI,
	mistI,
	rainI,
	snowI,
	thunderstormI,
} from '../assets';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const codes = {
	thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
	drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
	rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
	snow: [600, 601, 602, 611, 612, 615, 616, 620, 621, 622],
	atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
	clear: [800],
	clouds: [801, 802, 803, 804],
};

const weatherBackgrounds = {
	clear: clear,
	clouds: clouds,
	drizzle: drizzle,
	atmosphere: mist,
	rain: rain,
	snow: snow,
	thunderstorm: thunderstorm,
};

const weatherImages = {
	clear: clearI,
	clouds: cloudsI,
	drizzle: drizzleI,
	atmosphere: mistI,
	rain: rainI,
	snow: snowI,
	thunderstorm: thunderstormI,
};

export function useWeather() {
	const [weather, setWeather] = useState(null);
	const [message, setMessage] = useState('');
	const [loader, setLoader] = useState(false);
	const [background, setBackground] = useState(null);
	const [image, setImage] = useState(null);
	const [showSearch, setShowSearch] = useState(false);
	// const [coords, setCoords] = useState({ latitude: null, longitude: null });

	const fetchWeather = (latitude, longitude) => {
		setLoader(true);
		axios
			.get(
				`${BASE_URL}lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
			)
			.then((res) => {
				const iconCodeId = res.data.weather[0].id;
				const keys = Object.keys(codes);
				const weatherType = keys.find((type) =>
					codes[type].includes(iconCodeId),
				);

				setWeather({
					city: res.data.name,
					country: res.data.sys.country,
					temp: res.data.main.temp,
					description: res.data.weather[0].description,
					id: res.data.weather[0].id,
					speed: res.data.wind.speed,
					clouds: res.data.clouds.all,
					pressure: res.data.main.pressure,
				});

				if (weatherType) {
					setBackground(weatherBackgrounds[weatherType]);
					setImage(weatherImages[weatherType]);
				}

				setLoader(false);
			})
			.catch(() => {
				setMessage('Error al conseguir la información del clima');
				setLoader(false);
			});
	};

	useEffect(() => {
		if ('geolocation' in navigator) {
			setLoader(true);

			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const { latitude, longitude } = pos.coords;
					// setCoords({ latitude, longitude });
					fetchWeather(latitude, longitude);
				},
				() => {
					setMessage('Permiso denegado o ubicación no disponible.');
					setLoader(false);
				},
			);
		}
	}, []);

	const searchWeatherByCity = (city) => {
		setLoader(true);
		const url = `${BASE_URL}q=${city}&units=metric&appid=${API_KEY}`;

		console.log('Prueba de la URL generada:', url);

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
				}
				return res.json();
			})
			.then((data) => {
				console.log('Respuesta de la API:', data);

				const iconCodeId = data.weather[0].id;
				const keys = Object.keys(codes);
				const weatherType = keys.find((type) =>
					codes[type].includes(iconCodeId),
				);

				setWeather({
					city: data.name,
					country: data.sys.country,
					temp: data.main.temp,
					description: data.weather[0].description,
					id: data.weather[0].id,
					speed: data.wind.speed,
					clouds: data.clouds.all,
					pressure: data.main.pressure,
				});

				if (weatherType) {
					setBackground(weatherBackgrounds[weatherType]);
					setImage(weatherImages[weatherType]);
				}

				setLoader(false);
			})
			.catch((error) => {
				console.error('Error en la solicitud:', error);
				setMessage('Error al obtener la información del clima.');
				setLoader(false);
			});
		// setCoords({ latitude: data[0].lat, longitude: data[0].lon });
	};

	return {
		weather,
		loader,
		message,
		background,
		image,
		showSearch,
		setShowSearch,
		searchWeatherByCity,
	};
}
