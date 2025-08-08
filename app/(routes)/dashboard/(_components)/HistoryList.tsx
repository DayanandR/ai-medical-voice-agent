"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { FileText, RefreshCw } from "lucide-react";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHistoryList();
  }, []);

  const getHistoryList = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await axios.get("/api/session-chat?sessionId=all");
      console.log(result.data);
      setHistoryList(result.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setError("Failed to load consultation history");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Shimmer Skeleton Table
  const SkeletonTable = () => (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-gray-100 p-4 border-b">
        <div className="grid grid-cols-4 gap-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="p-4 border-b last:border-b-0">
          <div className="grid grid-cols-4 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-10">
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <SkeletonTable />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-col border border-red-200 bg-red-50 p-7 gap-4 rounded-lg">
          <FileText className="w-12 h-12 text-red-400" />
          <h2 className="font-bold text-xl text-red-800">
            Unable to Load History
          </h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={getHistoryList}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : historyList?.length === 0 ? (
        <div className="flex items-center justify-center flex-col border border-dashed p-7 gap-2">
          <Image
            src={"/medical-assistance.png"}
            alt="empty"
            height={150}
            width={150}
          />
          <h2 className="font-bold text-xl">No Recent Consultations</h2>
          <p>It looks like you haven't consulted with any doctor yet.</p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold">Consultation History</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {historyList.length}
              </span>
            </div>
          </div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
};

export default HistoryList;
