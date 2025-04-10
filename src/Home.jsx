import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import Sidebar from "./components/sidebar";
import dayjs from "dayjs";

import "./globals.css";

function Home({ isLoggedIn, setIsLoggedIn }) {
  const sampleDataForChart = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const currentHour = new Date().getHours();
  let greeting = "Good evening";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  }

  useEffect(() => {
    setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) {
    return (
      <div>
        <h1>You are not logged in.</h1>
      </div>
    );
  }

  return (
    <main className="flex flex-row min-h-screen bg-gray-100">
      <Sidebar page={"dashboard"} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="flex flex-col p-12 2xl:basis-[80%] basis-[70%] bg-gray-100 gap-4">
        <div className="flex flex-col w-full bg-white basis-[12%] rounded-3xl py-4 px-8 justify-center gap-2">
          <p className="text-gray-400">
            {dayjs(new Date()).format("dddd | MMMM DD, YYYY").toString()}
          </p>
          <h1 className="text-4xl font-bold">{greeting}, Admin!</h1>
        </div>
        <h1 className="font-black text-2xl text-blue-600">Overview</h1>
        <div className="flex flex-row basis-[80%] gap-4">
          <div className="flex flex-1 bg-white rounded-3xl"></div>
          <div className="grid grid-rows-[1fr_1fr] gap-4">
            <div className="flex shrink bg-white rounded-3xl">
              <Pie
                data={sampleDataForChart}
                options={{ aspectRatio: 1 / 1, responsive: true }}
              />
            </div>
            <div className="flex grow bg-white rounded-3xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
