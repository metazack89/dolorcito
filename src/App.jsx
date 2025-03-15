import './App.css';
import Weather from './components/Weather';
import SearchCity from './components/SearchCity';
import { useWeather } from './hooks/useWeather';

function App() {
	const {
		weather,
		loader,
		message,
		background,
		image,
		showSearch,
		setShowSearch,
		searchWeatherByCity,
	} = useWeather();

	const handleSearch = (city) => {
		console.log(city);
		searchWeatherByCity(city);
		setShowSearch(false);
	};

	return (
		<>
			{showSearch ? (
				<SearchCity setShowSearch={setShowSearch} onSearch={handleSearch} />
			) : (
				<>
					{loader && <div className="loader"></div>}
					{!loader && weather && (
						<Weather
							weather={weather}
							background={background}
							image={image}
							setShowSearch={setShowSearch}
						/>
					)}

					{!loader && message && <h1>{message}</h1>}
				</>
			)}
		</>
	);
}

export default App;
