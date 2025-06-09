'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  const handleNavigate = (task) => {
    if(task !== 3){
      router.push(`/Task${task}`);
    }
    else{
      router.push('https://docs.google.com/document/d/14AdEvay-253ph5SWVWWs1QF1mipE9f1F5LwwIFB6nNI/edit?usp=sharing')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center drop-shadow">
        SSPD Backend Internship Tasks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => handleNavigate(num)}
            className="bg-white text-indigo-700 font-semibold text-xl py-4 px-8 rounded-2xl shadow-md hover:bg-indigo-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Task {num}
          </button>
        ))}
      </div>
    </main>
  );
}
