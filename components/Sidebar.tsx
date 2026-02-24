"use client";

import { LayoutDashboard, FileText, BookOpen, Building2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Tahapan {
  idTahapan: number;
  noUrut: number;
  namaTahapan: string;
  bobot: number;
  progres: {
    status: string;
  };
}

interface Pengadaan {
  id: number;
  namaTransaksi: string;
  jenisPengadaan: string;
  tahapanList: Tahapan[];
}

interface SidebarProps {
  pengadaanList?: Pengadaan[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ pengadaanList = [], activeTab, onTabChange }: SidebarProps) {
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});

  const toggleDropdown = (id: number) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col justify-between min-h-screen sticky top-0">
      {/* Logo */}
      <div>
        <div className="p-6 pb-4">
          <div className="relative bg-[#CB0E0E] w-14 h-14 mx-auto rounded-xl rotate-6 flex items-center justify-center mb-4">
            <BookOpen size={28} className="text-white -rotate-6" />
          </div>
          <h2 className="font-bold text-lg text-center">SULSEL PROV</h2>
          <p className="text-xs text-gray-500 text-center">E-MONITORING</p>
        </div>

        <nav className="px-4 space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          {/* Pengadaan Dropdowns */}
          {pengadaanList.map((pengadaan) => (
            <div key={pengadaan.id}>
              <button
                onClick={() => toggleDropdown(pengadaan.id)}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === String(pengadaan.id)
                    ? "bg-[#CB0E0E] text-white"
                    : "bg-[#CB0E0E]/10 text-[#CB0E0E] hover:bg-[#CB0E0E]/20"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText size={15} className="shrink-0" />
                  <span className="truncate">{pengadaan.jenisPengadaan}</span>
                </div>
                {openDropdowns[pengadaan.id] ? (
                  <ChevronDown size={14} className="shrink-0" />
                ) : (
                  <ChevronRight size={14} className="shrink-0" />
                )}
              </button>

              {/* Tahapan List Dropdown */}
              {openDropdowns[pengadaan.id] && (
                <div className="ml-4 mt-1 border-l-2 border-red-200 pl-3 space-y-0.5">
                  {pengadaan.tahapanList.map((tahapan) => (
                    <button
                      key={tahapan.idTahapan}
                      onClick={() => onTabChange?.(`${pengadaan.id}-${tahapan.idTahapan}`)}
                      className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                        activeTab === `${pengadaan.id}-${tahapan.idTahapan}`
                          ? "bg-red-50 text-[#CB0E0E] font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[9px] font-bold shrink-0">
                        {tahapan.noUrut}
                      </span>
                      <span className="truncate">{tahapan.namaTahapan}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4">
        <div className="flex flex-row items-center gap-2 bg-gray-100 p-3 rounded-lg text-sm">
          <Building2 color="#CB0E0E" size={20} />
          <div>
            <p className="text-[#CB0E0E] font-semibold text-xs">Instansi</p>
            <p className="text-gray-700 text-xs">DINAS BMBK</p>
          </div>
        </div>
      </div>
    </aside>
  );
}