'use client';
import axios from 'axios';
import React, { useState } from 'react';

const Task2 = () => {
    const [file, setFile] = useState();
    const [parsedJSON, setParsedJSON] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const sendFile = () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }
        if (file.type !== 'application/json') {
            alert('Please upload a valid JSON file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const base64Data = reader.result.replace(/^data:application\/json;base64,/, '');
            console.log('data:', base64Data);
            try {
                const response = await axios.post('https://task-2-beryl-eight.vercel.app/api/upload', {
                    base64: base64Data
                }, {
                    headers: {
                        auth: process.env.NEXT_PUBLIC_AUTH,
                    }
                });

                if (response.status === 200) {
                    console.log(response.data.data);
                    const decoded = Buffer.from(response.data.data, 'base64').toString('utf8');
                    const parsed = JSON.parse(decoded);
                    console.log(parsed);
                    setParsedJSON(parsed);
                }
            } catch (error) {
                console.error(error);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(parsedJSON, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'output.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
            <div className="max-w-xl w-full bg-white shadow-md rounded-2xl p-6 space-y-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-800">📂 Upload Sales Data File</h2>

                <div className="text-sm bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md text-gray-700">
                    <p className="font-semibold">Important:</p>
                    <ul className="list-disc ml-6 mt-1 space-y-1">
                        <li>Only <strong>.json</strong> files are accepted.</li>
                        <li>Ensure file follows sales data structure.</li>
                        <li>Each object should contain <code>category</code> and <code>quantity_sold</code> fields.</li>
                    </ul>
                </div>

                <input
                    type="file"
                    accept=".json,application/json"
                    className="file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
                    onChange={handleFileChange}
                />

                <button
                    onClick={sendFile}
                    className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    📤 Upload File
                </button>

                {parsedJSON && (
                    <button
                        onClick={handleDownload}
                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        📥 Download Parsed JSON
                    </button>
                )}
            </div>
        </main>
    );
};

export default Task2;
