"use client";

import { Search, LogOut, ArrowRight, BookOpen, UserCircle2 } from "lucide-react";

const instansiList = [
  {
    nama: "Dinas BMBK",
    deskripsi: "Bina Marga & Bina Konstruksi",
    prioritas: "1 / 5",
    warning: true,
  },
  {
    nama: "DISDIK",
    deskripsi: "Dinas Pendidikan",
    prioritas: "1 / 5",
    warning: false,
  },
  {
    nama: "Dinas Kesehatan",
    deskripsi: "",
    prioritas: "1 / 5",
    warning: true,
  },
  {
    nama: "Dinas Pertanian",
    deskripsi: "",
    prioritas: "1 / 5",
    warning: false,
  },
];

export default function InstansiPage() {
  return (
    <section className="min-h-screen bg-[#2d0000]">
      <div className="bg-[#ececec] min-h-screen py-10 px-32">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start mb-8">
          
          {/* Left */}
          <div className="flex items-start gap-6">
            <div className="bg-[#CB0E0E] w-16 h-16 rounded-2xl rotate-6 flex items-center justify-center text-white text-3xl shadow-lg">
              <BookOpen />
            </div>

            <div>
              <p className="text-xs text-[#CB0E0E] tracking-widest uppercase">
                Sulawesi Selatan
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold italic tracking-wide text-black">
                PILIH INSTANSI
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow flex items-center gap-3">
              < UserCircle2 size={24} color="green" />
              <div>
                <p className="text-sm font-semibold text-black">DR. AHMAD TRIA</p>
                <p className="text-xs text-black">Staff</p>
              </div>
            </div>

            <button className="flex items-center gap-2 text-sm bg-[#CB0E0E] text-white px-4 py-2 rounded-lg shadow hover:bg-red-800 transition">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="mb-8 border-gray-300" />

        {/* ================= SEARCH ================= */}
        <div className="flex justify-end mb-10">
          <div className="relative w-64">
            <Search
              size={16} color="grey"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="cari dinas"
              className="w-full pl-9 pr-4 py-2 rounded-lg border placeholder:text-gray-400 border-gray-300 bg-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* ================= CARD GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 text-black">
          {instansiList.map((item, i) => (
            <div
              key={i}
              className="relative w-50 bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition border-t-16 border-[#CB0E0E]"
            >

              {/* Icon + Warning */}
              <div className="flex justify-between items-center mt-6 mb-6">
                <div className="bg-[#CB0E0E] w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow">
                  <BookOpen />
                </div>

                {item.warning && (
                  <div className="bg-red-100 text-[#CB0E0E] px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow">
                    ⚠
                  </div>
                )}
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold mb-1">
                {item.nama}
              </h2>

              {item.deskripsi && (
                <p className="text-xs text-gray-500 mb-4">
                  {item.deskripsi}
                </p>
              )}

              <p className="text-xs text-gray-500">
                Program Prioritas
              </p>
              <p className="text-sm text-[#CB0E0E] font-semibold mb-8">
                {item.prioritas}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <button className="text-xs text-[#CB0E0E] tracking-widest uppercase">
                  Masuk Instansi
                </button>

                <div className="w-7 h-7 rounded-full border border-gray-400 flex items-center justify-center">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}