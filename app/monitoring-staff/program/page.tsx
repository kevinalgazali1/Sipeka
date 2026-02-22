"use client";

import { useState } from "react";
import { METODE_PENGADAAN } from "@/constants/metodePengadaan";
import MultiSelectMetode from "@/components/MultiSelectMetode";
import {
  Search,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  X,
} from "lucide-react";

export default function ProgramPage() {
  const [open, setOpen] = useState(false);
  const [metode, setMetode] = useState<string[]>([]);

  return (
    <section className="min-h-screen">
      <div className="bg-[#ececec] min-h-screen py-10 px-32 text-black">
        {/* ================= TOP RIGHT SEARCH ================= */}
        <div className="flex justify-end gap-4 mb-8">
          <div className="relative w-64">
            <Search
              size={16}
              color="grey"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="cari program"
              className="w-full pl-9 pr-4 py-2 rounded-lg border placeholder:text-gray-600 border-gray-300 bg-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#CB0E0E] hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>

        {/* ================= HEADER ================= */}
        <div className="flex items-start gap-6 mb-6">
          <div className="bg-[#CB0E0E] w-20 h-20 rounded-2xl rotate-6 flex items-center justify-center text-white text-3xl shadow-lg">
            <BookOpen />
          </div>

          <div>
            <p className="text-xs text-[#CB0E0E] uppercase tracking-widest">
              Dinas BMBK
            </p>
            <h1 className="text-4xl font-extrabold italic tracking-wide">
              DASHBOARD
            </h1>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* ================= BACK BUTTON ================= */}
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition mb-10">
          <ArrowLeft size={16} />
          Kembali
        </button>

        {/* ================= PROGRAM CARD ================= */}
        <div className="w-50">
          <div className="relative bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition border-t-16 border-[#CB0E0E]">
            {/* Icon + Status */}
            <div className="relative flex justify-between items-center mt-10 mb-6">
              <div className="bg-[#CB0E0E] w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow">
                <BookOpen />
              </div>

              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs shadow-md shadow-black/20">
                <Check size={14} />
                Selesai
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold leading-snug mb-2">
              Jalan Layang
            </h2>

            <p className="text-xs text-gray-500 mb-4">METODE : E-Katalog</p>

            <div className="flex justify-between items-center">
              <p className="text-[#CB0E0E] text-xl font-bold">8 M</p>

              <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#f2f2f2] rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200 text-black border-t-16 border-[#CB0E0E]">
            {/* Header */}
            <div className="relative mt-8 flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold italic">REGISTRASI BARU</p>
                <p className="text-xs text-gray-600">Dinas BMBK</p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <hr className="my-6 border-gray-300" />

            {/* Form */}
            <form className="space-y-5">
              <div>
                <label className="text-sm text-gray-600">Nama Program</label>
                <input
                  type="text"
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-200 outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Anggaran</label>
                <input
                  type="text"
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-200 outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Metode Pengadaan
                </label>
                <MultiSelectMetode
                  options={METODE_PENGADAAN}
                  selected={metode}
                  onChange={setMetode}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-gray-300 text-gray-600 hover:bg-gray-400 px-8 py-2 rounded-lg"
                >
                  Batalkan
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#CB0E0E] hover:bg-red-700 text-white px-18 py-2 rounded-lg shadow"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
