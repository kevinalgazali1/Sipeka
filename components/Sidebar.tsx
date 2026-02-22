"use client";

import { LayoutDashboard, FileText, BookOpen, Building2 } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white p-6 shadow-lg flex flex-col justify-between">
      <div>
        <div className="mb-8">
          <div className="bg-[#CB0E0E] w-14 h-14 mx-auto rounded-xl rotate-6">
            <BookOpen
              size={32}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
            />
          </div>
          <h2 className="font-bold mt-4 text-lg">SULSEL PROV</h2>
          <p className="text-xs text-gray-500">E-MONITORING</p>
        </div>

        <nav className="space-y-3">
          <button className="flex items-center gap-2 w-full px-4 py-2 bg-gray-100 rounded-lg">
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          <button className="flex items-center gap-0.5 w-full px-4 py-2 bg-[#CB0E0E] text-white rounded-lg">
            <FileText size={16} />
            Pengadaan Langsung
          </button>

          <button className="flex items-center gap-0.5 w-full px-4 py-2 bg-[#CB0E0E] text-white rounded-lg">
            <FileText size={16} />
            Tender
          </button>
        </nav>
      </div>

      <div className="flex flex-row items-center gap-2 bg-gray-100 p-3 rounded-lg text-sm">
        <div>
          <Building2 color="red" />
        </div>
        <div>
          <p className="text-[#CB0E0E] font-semibold">Instansi</p>
          DINAS BMBK
        </div>
      </div>
    </aside>
  );
}
