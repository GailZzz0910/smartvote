import React, { useEffect } from "react";
import Sidebar from "./components/sidebar";
import dayjs from "dayjs";

import "./globals.css";

function Home({ isLoggedIn, setIsLoggedIn }) {
  
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
        <div className="flex flex-col w-full bg-[#EFF6FF] border border-[#2563EB] basis-[12%] rounded-3xl p-[20px] justify-center gap-2">
          <p className="text-[#786F6F] font-bold">
            {dayjs(new Date()).format("dddd | MMMM DD, YYYY").toString()}
          </p>
          <h1 className="text-4xl font-bold">{greeting}, Admin!</h1>
        </div>
        <h1 className="font-bold text-2xl text-blue-600">Voters' Overview</h1>
        <div className="flex flex-row basis-[80%] gap-4">
          <div className="flex flex-1 bg-white rounded-3xl"></div>
          <div className="grid grid-rows-[1fr_1fr] gap-4">
            <div className="flex shrink bg-white rounded-3xl">
            </div>
            <div className="flex grow bg-white rounded-3xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
