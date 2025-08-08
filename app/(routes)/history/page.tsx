import React from "react";
import HistoryList from "../dashboard/(_components)/HistoryList";
import { Navbar } from "@/app/page";

const History = () => {
  return (
    <div>
      <Navbar />
      <div className="mx-20">
        <HistoryList />
      </div>
    </div>
  );
};

export default History;
