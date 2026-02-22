"use client";

import { useState, useRef } from "react";
import { X, Save, Upload } from "lucide-react";

interface TimelineRow {
  title: string;
  subtitle: string;
  subtitleColor: string;
  barStart: number;
  barSpan: number;
}

const rows: TimelineRow[] = [
  {
    title: "BEDAH RUMAH",
    subtitle: "Reviu BAPPEDA",
    subtitleColor: "text-red-600",
    barStart: 1,
    barSpan: 2,
  },
  {
    title: "BEDAH RUMAH",
    subtitle: "Penerbitan SPD",
    subtitleColor: "text-red-600",
    barStart: 2,
    barSpan: 2,
  },
  {
    title: "BEDAH RUMAH",
    subtitle: "Penyusunan Dokumen Pengadaan",
    subtitleColor: "text-red-600",
    barStart: 3,
    barSpan: 3,
  },
];

const months = ["Januari", "Februari", "Maret", "April"];
const weeks = ["M1", "M2", "M3", "M4"];

const periodOptions = months.flatMap((month) =>
  weeks.map((week) => `${month}-${week}`)
);

// ─── Shared Modal Shell ────────────────────────────────────────────────────────
function ModalShell({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-[420px] overflow-hidden border-t-16 border-green-500"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.2s ease" }}
      >
        {children}
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Modal Header ──────────────────────────────────────────────────────────────
function ModalHeader({ subtitle, onClose }: { subtitle: string; onClose: () => void }) {
  return (
    <>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h2 className="font-bold text-gray-900 text-base tracking-wide">
            KONFIGURASI TAHAPAN
          </h2>
          <p className="text-sm text-gray-500 mt-0.5 italic">{subtitle}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
          <X size={18} />
        </button>
      </div>
      <hr className="my-4 border-gray-200" />
    </>
  );
}

// ─── Period Selectors ──────────────────────────────────────────────────────────
function PeriodSelectors({
  mulai,
  selesai,
  onMulai,
  onSelesai,
}: {
  mulai: string;
  selesai: string;
  onMulai: (v: string) => void;
  onSelesai: (v: string) => void;
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4">
      {[
        { label: "MULAI", value: mulai, onChange: onMulai },
        { label: "SELESAI", value: selesai, onChange: onSelesai },
      ].map(({ label, value, onChange }) => (
        <div key={label} className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wider">
            {label}
          </label>
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {periodOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Modal Footer Buttons ──────────────────────────────────────────────────────
function ModalFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={onClose}
        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors tracking-wider"
      >
        BATALKAN
      </button>
      <button
        onClick={onClose}
        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-200"
      >
        <Save size={15} />
        SIMPAN DATA
      </button>
    </div>
  );
}

// ─── PLAN Modal ────────────────────────────────────────────────────────────────
function PlanModal({ row, onClose }: { row: TimelineRow; onClose: () => void }) {
  const [mulai, setMulai] = useState(periodOptions[0]);
  const [selesai, setSelesai] = useState(periodOptions[0]);

  return (
    <ModalShell onClose={onClose}>
      <div className="px-7 pt-6 pb-7">
        <ModalHeader subtitle={row.subtitle} onClose={onClose} />
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Target Waktu <span className="italic font-normal">(planning)</span>
        </p>
        <PeriodSelectors
          mulai={mulai}
          selesai={selesai}
          onMulai={setMulai}
          onSelesai={setSelesai}
        />
        <ModalFooter onClose={onClose} />
      </div>
    </ModalShell>
  );
}

// ─── UPDATE Modal ──────────────────────────────────────────────────────────────
function UpdateModal({ row, onClose }: { row: TimelineRow; onClose: () => void }) {
  const [mulai, setMulai] = useState(periodOptions[0]);
  const [selesai, setSelesai] = useState(periodOptions[0]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [keterangan, setKeterangan] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFileName(e.target.files[0].name);
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="px-7 pt-6 pb-7">
        <ModalHeader subtitle={row.subtitle} onClose={onClose} />

        {/* Realisasi Lapangan */}
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Realisasi Lapangan <span className="italic font-normal">(actual)</span>
        </p>
        <PeriodSelectors
          mulai={mulai}
          selesai={selesai}
          onMulai={setMulai}
          onSelesai={setSelesai}
        />

        {/* Upload Dokumen */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Upload size={15} className="text-gray-500" />
            Unggah Dokumen Pendukung (PDF)
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold border-2 border-red-400 text-red-500 rounded-full hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              Choose File
            </button>
            <span className="text-sm text-gray-500 truncate">
              {fileName ?? "Belum ada file dipilih"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>

        {/* Keterangan */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Keterangan :
          </label>
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Tuliskan keterangan di sini..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400"
          />
        </div>

        <ModalFooter onClose={onClose} />
      </div>
    </ModalShell>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
type ModalType = "plan" | "update";

export default function TimelineTable() {
  const totalCols = 16;
  const [modal, setModal] = useState<{ type: ModalType; row: TimelineRow } | null>(null);

  return (
    <>
      <div className="font-sans p-4 bg-white">
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-4 py-3 bg-gray-100 text-left font-semibold text-gray-700 w-48 text-center"
                >
                  Tahapan Proses
                </th>
                {months.map((month) => (
                  <th
                    key={month}
                    colSpan={4}
                    className="border border-gray-200 py-2 bg-gray-100 text-center font-semibold text-gray-700"
                  >
                    {month}
                  </th>
                ))}
              </tr>
              <tr>
                {months.map((month) =>
                  weeks.map((week) => (
                    <th
                      key={`${month}-${week}`}
                      className="border border-gray-200 py-1 px-2 text-xs font-medium text-gray-500 bg-gray-50 text-center w-12"
                    >
                      {week}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100">
                  <td className="border border-gray-200 px-4 py-4 bg-white align-top">
                    <div className="font-bold text-gray-800 text-xs">{row.title}</div>
                    <div className={`text-xs font-medium mt-0.5 ${row.subtitleColor}`}>
                      {row.subtitle}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <button className="px-2 py-0.5 text-xs border border-gray-300 rounded-full text-black hover:bg-gray-50 shadow-md">
                        PDF
                      </button>
                      <button
                        onClick={() => setModal({ type: "plan", row })}
                        className="px-2 py-0.5 text-xs border bg-gray-300 border-gray-300 rounded-full text-black hover:bg-gray-100 active:scale-95 transition-all shadow-md"
                      >
                        PLAN
                      </button>
                      <button
                        onClick={() => setModal({ type: "update", row })}
                        className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full hover:bg-red-700 active:scale-95 transition-all shadow-md"
                      >
                        ACTUAL
                      </button>
                    </div>
                  </td>

                  {Array.from({ length: totalCols }).map((_, colIndex) => {
                    const isBarStart = colIndex === row.barStart;
                    const isInBar =
                      colIndex >= row.barStart &&
                      colIndex < row.barStart + row.barSpan;

                    if (isBarStart) {
                      return (
                        <td
                          key={colIndex}
                          colSpan={row.barSpan}
                          className="border border-gray-200 px-1 py-4 align-middle"
                        >
                          <div className="h-5 rounded-full bg-gray-300 w-full" />
                        </td>
                      );
                    } else if (isInBar) {
                      return null;
                    } else {
                      return (
                        <td key={colIndex} className="border border-gray-200 py-4" />
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal?.type === "plan" && (
        <PlanModal row={modal.row} onClose={() => setModal(null)} />
      )}
      {modal?.type === "update" && (
        <UpdateModal row={modal.row} onClose={() => setModal(null)} />
      )}
    </>
  );
}