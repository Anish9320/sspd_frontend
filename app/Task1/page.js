'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [inserted, setInserted] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchWeather = async () => {
    const res = await axios.post('https://task-1-sandy-delta.vercel.app/api/weather', { city },{
        headers:{
            auth: process.env.NEXT_PUBLIC_AUTH
        }
    });
    setWeather(res.data.result);
  };

  const calculate = async () => {
    const res = await axios.post(`https://task-1-sandy-delta.vercel.app/api/math/${operation}`, {
      a: Number(a),
      b: Number(b),
    },{
        headers:{
            auth: process.env.NEXT_PUBLIC_AUTH
        }
    });
    setResult(res.data.result);
  };

  const insertMessage = async () => {
    const res = await axios.post('https://task-1-sandy-delta.vercel.app/api/insert', { message },{
        headers:{
            auth: process.env.NEXT_PUBLIC_AUTH
        }
    });
    setInserted(res.data.message);
    setMessage('');
    fetchItems();
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('https://task-1-sandy-delta.vercel.app/api/',{
        headers:{
            auth: process.env.NEXT_PUBLIC_AUTH
        }
      });
      setItems(res.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center">SSPD Backend Tasks UI</h1>

      {/* Weather Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Check Weather</h2>
        <input
          type="text"
          placeholder="Enter city"
          className="border p-2 w-full rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Get Weather
        </button>
        {weather && (
          <div className="mt-4">
            <p><strong>City:</strong> {weather.city}</p>
            <p><strong>Temperature:</strong> {weather.temperature}</p>
            <p><strong>Humidity:</strong> {weather.humidity}</p>
            <p><strong>Feels Like:</strong> {weather.weather}</p>
          </div>
        )}
      </section>

      {/* Math Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Math Calculator</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Enter A"
            className="border p-2 rounded"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter B"
            className="border p-2 rounded"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </div>
        <select
          className="border p-2 rounded w-full"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
          <option value="divide">Divide</option>
        </select>
        <button onClick={calculate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Calculate
        </button>
        {result !== null && <p className="mt-4 font-medium">Result: {result}</p>}
      </section>

      {/* Message Insertion Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Insert Message</h2>
        <input
          type="text"
          placeholder="Type your message"
          className="border p-2 w-full rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={insertMessage} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Insert
        </button>
        {inserted && <p className="mt-4 font-medium">{inserted}</p>}
      </section>

      {/* List Messages Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">List of Messages</h2>
        {items.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {items.map((item, index) => (
              <li key={index}>{item.message}</li>
            ))}
          </ul>
        ) : (
          <p>No messages found.</p>
        )}
      </section>
    </main>
  );
}
