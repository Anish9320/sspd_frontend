'use client'
import axios from "axios";
import React, { useState } from "react";

const Task4 = () => {
  const [images, setImages] = useState(null);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlesetFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    setLoading(true);
    setImages(null);
    const reader = new FileReader();
    
    reader.onload = async () => {
      const base64String = reader.result.replace(/^data:image\/\w+;base64,/, "");

      try {
        //  Upload image
        //please run in localhost server for output
        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          { image: base64String },
          {
            headers: {
              auth: process.env.NEXT_PUBLIC_AUTH,
            },
          }
        );

        if (uploadResponse.status === 200) {
          const url = uploadResponse.data.data;
          console.log("Image uploaded successfully:", url);
          setProcessing(true); // Show processing message

          //wait 5 seconds before fetching image versions
          setTimeout(async () => {
            try {
              const imagesResponse = await axios.post(
                "http://localhost:5000/api/images",
                { imageUrl: url },
                {
                  headers: {
                    auth: process.env.NEXT_PUBLIC_AUTH,
                  },
                }
              );

              if (imagesResponse.status === 200) {
                console.log(imagesResponse.data.images);
                setImages(imagesResponse.data.images);
              } else {
                console.error("Error fetching images:", imagesResponse.data.message);
              }
            } catch (err) {
              console.error("Error fetching images:", err);
            } finally {
              setProcessing(false);
              setLoading(false);
            }
          }, 10000);
        } else {
          console.error("Failed to upload image.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Image Uploader</h2>
        <p>Please use Localhost for testing..</p>
        <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handlesetFile}
            className="w-full sm:w-auto border p-2 rounded-lg"
          />
          <button
            onClick={handleChange}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Generate images"}
          </button>
        </div>
      </div>

      {/* Processing message */}
      {processing && (
        <div className="mt-8 text-center text-lg text-gray-600 font-medium animate-pulse">
          ⏳ Processing your image... please wait
        </div>
      )}

      {/* Display images after processing */}
      {images && !processing && (
        <div className="mt-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Original Image", src: images.imageUrl, width: 300, height: 300 },
            { label: "Thumbnail (Small)", src: images.thumbnail_1 },
            { label: "Thumbnail (Medium)", src: images.thumbnail_2 },
            { label: "Thumbnail (Large)", src: images.thumbnail_3 },
            { label: "Watermarked Image", src: images.watermark_image, width: 300, height: 300 },
          ].map((img, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl shadow p-4 flex flex-col items-center"
            >
              <p className="font-semibold mb-2">{img.label}</p>
              <img
                src={img.src}
                alt={img.label}
                width={img.width}
                height={img.height}
                className="rounded-md border object-contain max-w-full h-auto"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Task4;
