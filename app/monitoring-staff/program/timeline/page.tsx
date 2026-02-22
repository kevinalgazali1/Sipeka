"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TimelineTable from "@/components/TimelineTable";
import {
  Search,
  Upload,
  CheckCircle,
  AlertTriangle,
  Download,
  Building2,
} from "lucide-react";

export default function MonitoringPage() {
  const [active, setActive] = useState("semua");

  const tabs = [
    { id: "semua", label: "Semua" },
    { id: "aman", label: "Aman" },
    { id: "terlambat", label: "Terlambat" },
  ];

  return (
    <div className="flex min-h-screen bg-[#ECECEC] text-black">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* ================= TOPBAR ================= */}
        <div className="flex justify-end items-center gap-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="cari item"
              className="pl-9 pr-4 py-2 rounded-lg border-2 border-gray-300 bg-white outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button className="flex items-center gap-2 bg-[#CB0E0E] text-white hover:bg-red-900 px-4 py-2 rounded-lg transition-all">
            <Upload size={16} />
            Arsip Digital Program
          </button>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="bg-white p-4 rounded-xl shadow flex gap-6 items-center">
            <Building2 />
            <div>
              <p className="text-xs text-gray-500">TOTAL PROYEK</p>
              <p className="text-lg font-bold">1</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex gap-6 items-center">
            <CheckCircle className="text-green-500" />
            <div>
              <p className="text-xs text-gray-500">STATUS AMAN</p>
              <p className="text-lg font-bold">0</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex gap-6 items-center">
            <AlertTriangle className="text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Kendala</p>
              <p className="text-lg font-bold">0</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex gap-6 items-center">
            <Download />
            <p className="text-sm font-semibold">DOWNLOAD</p>
          </div>
        </div>

        {/* ================= HEADER PROGRAM ================= */}
        <div className="flex justify-between items-center mt-10">
          <div className="flex flex-row gap-6">
            <div>
              <h1 className="text-3xl font-bold">Bedah Rumah</h1>
              <p className="text-gray-500 text-sm">
                Dinas BMBK - Pengadaan Langsung & Tender
              </p>
            </div>
            <div className="bg-white text-[#CB0E0E] font-bold rounded-xl px-4 py-2 border-2 border-red-100 flex items-center justify-center">
              <h1 className="text-2xl">12 M</h1>
            </div>
          </div>
          {/* ================= FILTER ================= */}
          <div className="flex bg-gray-300 rounded-md px-4 py-2 gap-2 mt-4 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-4 py-1 rounded-md text-sm transition-all duration-200
            ${
              active === tab.id
                ? "bg-white text-[#CB0E0E] border border-red-100"
                : "bg-gray-300 hover:bg-gray-200"
            }
          `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="mt-6 bg-white rounded-xl shadow p-4 overflow-auto">
          <TimelineTable />
        </div>
      </div>
    </div>
  );
}
