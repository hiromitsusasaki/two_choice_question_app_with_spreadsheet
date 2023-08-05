'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import 'tailwindcss/tailwind.css'
import Link from 'next/link'

export default function SheetPage({ params }: { params: { sheet_name: string } }) {
  const sheetName = decodeURIComponent(params.sheet_name);
  const [data, setData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState([] as any[]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_GAS_API_URL}action=getSheetData&sheetName=${sheetName}`,
      )
      setData(result.data);
    }
    fetchData();
  }, []);

  const handleStart = () => {
    setIsStarted(true);
  }

  const handleAnswer = (answer: number) => {
    const correct = (data[currentQuestionIndex] as any).answer === answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    setAnswers([...answers, { num: (data[currentQuestionIndex] as any).num, correct }]);
    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
    }
  }

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setIsAnswered(false);
  }

  const renderStart = () => (
    <button onClick={handleStart} disabled={data.length === 0} className="mt-5 py-2 px-12 border border-transparent shadow-2xl text-2xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      Start
    </button>
  );

  const renderQuestion = () => (
    <div>
      <p className="text-xl sm:text-3xl mb-4 mt-10">{currentQuestionIndex+1}問目（全{data.length}問）</p>
      <p className="text-xl sm:text-3xl mb-4 mt-5">{(data[currentQuestionIndex] as any).question}</p>
      <div className="flex space-x-4 justify-center">
        <button onClick={() => handleAnswer(1)} className="py-2 px-12 border border-transparent shadow-2xl text-2xl font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">◯</button>
        <button onClick={() => handleAnswer(0)} className="py-2 px-12 border border-transparent shadow-2xl text-2xl font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">✕</button>
      </div>
    </div>
  );

  const renderAnswer = () => (
    <div>
      <p className={`text-6xl sm:text-6xl mb-4 mt-10 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>{isCorrect ? '正解!' : '不正解'}</p>
      <p className="text-lg sm:text-2xl mt-5">正答: {(data[currentQuestionIndex] as any).answer === 1 ? '◯' : '✕'}</p>
      <p className="text-lg sm:text-2xl mt-5 mb-4">説明:<br/> {(data[currentQuestionIndex] as any).explanation}</p>
      <button onClick={handleNext} className="py-2 px-12 mt-4 border border-transparent shadow-2xl text-2xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">次の問題</button>
    </div>
  );

  const renderResults = () => (
    <div>
      <p className="text-2xl sm:text-4xl mb-4">{data.length} 問中 {correctAnswers} 問正解でした<br /> (正答率{Math.floor((correctAnswers / data.length) * 100)}%)</p>
      <div className="flex space-x-4 justify-center">
        <table className="table-auto mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2">問題</th>
              <th className="px-4 py-2">結果</th>
            </tr>
          </thead>
          <tbody>
            {answers.map(answer => (
              <tr key={answer.num}>
                <td className="border px-4 py-2">{answer.num}</td>
                <td className="border px-4 py-2">{answer.correct ? '正解' : '不正解'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link className="mt-5" href="/">ホームに戻る</Link>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-5 sm:px-20 text-center">
        <h1 className="text-2xl sm:text-6xl font-bold mb-5">{sheetName ? sheetName : 'Loading...'}</h1>
        {isStarted ? (
          isAnswered ? (
            currentQuestionIndex < data.length - 1 ? renderAnswer() : renderResults()
          ) : (
            renderQuestion()
          )
        ) : (
          renderStart()
        )}
      </main>
    </div>
  )
}
