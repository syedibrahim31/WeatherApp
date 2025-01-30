import '../css/card.css';
import sunset from '../assets/sunset.gif';
import sunrise from '../assets/sunrise.gif';
import hot from '../assets/hot.gif';
import cold from '../assets/cold.gif';
import cloudy from '../assets/cloudy.gif';
import humidity from '../assets/humidity.png';
import pressure from '../assets/pressure.png';
import wind from '../assets/wind.gif';
import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect } from 'react';

const apiKey = 'd8596b1261b43be39522177d29112a96';

function Card() {
  const [city, setCity] = useState('');
  const [data, setData] = useState({
    city: "",
    temp: 0,
    temp_max: 0,
    temp_min: 0,
    humidity: 0,
    sunrise: 0,
    sunset: 0,
    country: "",
    windSpeed: 0,
    desc: "",
    icon: ""
  });
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (city) {
      fetchData(city);
    } else {
      getCurrentLocation();
    }
  }, [city]);

  const fetchData = async (city) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      const { data } = response;
      setData({
        desc: data.weather[0].main,
        icon: data.weather[0].icon,
        city: data.name,
        temp: data.main.temp,
        temp_max: data.main.temp_max,
        temp_min: data.main.temp_min,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        country: data.sys.country,
        windSpeed: data.wind.speed
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback: default city
          fetchData('Pune');
        }
      );
    } else {
      // Geolocation is not supported, fallback to default city
      fetchData('Pune');
    }
  };

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
      const { data } = response;
      setData({
        desc: data.weather[0].main,
        icon: data.weather[0].icon,
        city: data.name,
        temp: data.main.temp,
        temp_max: data.main.temp_max,
        temp_min: data.main.temp_min,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        country: data.sys.country,
        windSpeed: data.wind.speed
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleOnChange = (e) => {
    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      setCity(e.target.value);
    }, 500);
    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="weather-card">
      <div className="background-area">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i}></li>)}
        </ul>
      </div>
      <div className='container'>
        <div className="card">
          <div className="inputData">
            <input
              type="text"
              className='inputField'
              placeholder='Enter City Name'
              onChange={handleOnChange}
            />
          </div>
          <div className="city">
            <h3><i className="fa-solid fa-location-dot"></i> {data.city} {data.country}</h3>
          </div>
          <div className="info">
            <h2>{data.temp} °C</h2>
          </div>
          <div className="boxes">
            {[
              { title: 'Max Temp', img: hot, value: `${data.temp_max} °C` },
              { title: 'Min Temp', img: cold, value: `${data.temp_min} °C` },
              { title: 'Wind Speed', img: wind, value: data.windSpeed },
              { title: 'Feels Like', img: `https://openweathermap.org/img/wn/${data.icon}@2x.png`, value: data.desc },
              { title: 'Sunrise', img: sunrise, value: moment(data.sunrise * 1000).format("hh:mm a") },
              { title: 'Sunset', img: sunset, value: moment(data.sunset * 1000).format("hh:mm a") },
              { title: 'Pressure', img: pressure, value: data.pressure },
              { title: 'Humidity', img: humidity, value: data.humidity }
            ].map((item, index) => (
              <div className="box" key={index}>
                <h4>{item.title}</h4>
                <div className="border">
                  <img src={item.img} className="img" alt={item.title} />
                </div>
                <h3>{item.value}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
