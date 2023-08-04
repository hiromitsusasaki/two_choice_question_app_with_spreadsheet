'use client';
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import 'tailwindcss/tailwind.css'

export default function Home() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('...Loading' as string);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_GAS_API_URL}action=getSheetNames`,
      )
      setData(result.data.sheets);
      setName(result.data.name);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-5 sm:px-20 text-center">
        <h1 className="text-2xl sm:text-6xl font-bold">{name}</h1>
        <div className="flex flex-wrap justify-center">
          {data.map((item, index) => (
            <div key={index} className="m-4 p-6 text-lg border border-gray-300 rounded-lg">
              <Link href={`/${encodeURIComponent(item)}`}>
                {item}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
