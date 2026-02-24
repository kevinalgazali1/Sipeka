"use client";

import { useState, useRef } from "react";
import { X, Save, Upload } from "lucide-react";

interface Progres {
  idProgres: number;
  status: string;
  planningTanggalMulai: string | null;
  planningTanggalSelesai: string | null;
  aktualTanggalMulai: string | null;
  aktualTanggalSelesai: string | null;
  keterangan: string | null;
  dokumenBukti: string[];
}

interface Tahapan {
  idTahapan: number;
  noUrut: number;
  namaTahapan: string;
  standarWaktuHari: number | null;
  isWaktuEditable: boolean;
  bobot: number;
  progres: Progres;
}

interface Pengadaan {
  id: number;
  namaTransaksi: string;
  jenisPengadaan: string;
  tahapanList: Tahapan[];
}

interface TimelineTableProps {
  namaProgram?: string;
  pengadaanList?: Pengadaan[];
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

// Build all week-column headers dynamically spanning from earliest to latest date
function buildTimelineColumns(pengadaanList: Pengadaan[]) {
  const allDates: Date[] = [];

  pengadaanList.forEach((p) =>
    p.tahapanList.forEach((t) => {
      if (t.progres.planningTanggalMulai) allDates.push(new Date(t.progres.planningTanggalMulai));
      if (t.progres.planningTanggalSelesai) allDates.push(new Date(t.progres.planningTanggalSelesai));
      if (t.progres.aktualTanggalMulai) allDates.push(new Date(t.progres.aktualTanggalMulai));
      if (t.progres.aktualTanggalSelesai) allDates.push(new Date(t.progres.aktualTanggalSelesai));
    })
  );

  if (allDates.length === 0) {
    // default 4 months
    const now = new Date();
    allDates.push(now);
    allDates.push(new Date(now.getFullYear(), now.getMonth() + 3, 28));
  }

  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  // Start from beginning of the month of minDate
  const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  // End at the last month of maxDate
  const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);

  // Build weeks list
  const columns: { label: string; month: string; year: number; monthIndex: number; week: number; startDay: Date }[] = [];

  const cursor = new Date(start);
  while (cursor <= end) {
    const year = cursor.getFullYear();
    const monthIndex = cursor.getMonth();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const monthName = monthNames[monthIndex];
    const dayOfMonth = cursor.getDate();
    let weekNum: number;
    if (dayOfMonth <= 7) weekNum = 1;
    else if (dayOfMonth <= 14) weekNum = 2;
    else if (dayOfMonth <= 21) weekNum = 3;
    else weekNum = 4;

    columns.push({
      label: `M${weekNum}`,
      month: monthName,
      year,
      monthIndex,
      week: weekNum,
      startDay: new Date(cursor),
    });

    // Advance to next week
    cursor.setDate(cursor.getDate() + 7);
  }

  return columns;
}

function getColIndex(
  columns: ReturnType<typeof buildTimelineColumns>,
  dateStr: string | null
): number {
  if (!dateStr) return -1;
  const date = new Date(dateStr);
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const nextCol = columns[i + 1];
    if (!nextCol || date < nextCol.startDay) return i;
  }
  return columns.length - 1;
}

// Group columns by month for header
function groupByMonth(columns: ReturnType<typeof buildTimelineColumns>) {
  const groups: { key: string; label: string; count: number }[] = [];
  columns.forEach((col) => {
    const key = `${col.month}-${col.year}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.count++;
    } else {
      groups.push({ key, label: col.month, count: 1 });
    }
  });
  return groups;
}

// ─── Modal Components ───────────────────────────────────────────────────────────

const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatDateForInput(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-[440px] overflow-hidden"
        style={{ borderTop: "6px solid #22c55e", animation: "modalIn 0.2s ease" }}
        onClick={(e) => e.stopPropagation()}
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

function ModalHeader({ subtitle: title, onClose }: { subtitle: string; onClose: () => void }) {
  return (
    <>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h2 className="font-bold text-gray-900 text-base tracking-wide">KONFIGURASI TAHAPAN</h2>
          <p className="text-sm text-gray-500 mt-0.5 italic">{title}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
      </div>
      <hr className="my-4 border-gray-200" />
    </>
  );
}

function DateSelectors({
  mulai, selesai, onMulai, onSelesai,
}: { mulai: string; selesai: string; onMulai: (v: string) => void; onSelesai: (v: string) => void }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4">
      {[
        { label: "MULAI", value: mulai, onChange: onMulai },
        { label: "SELESAI", value: selesai, onChange: onSelesai },
      ].map(({ label, value, onChange }) => (
        <div key={label} className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wider">{label}</label>
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      ))}
    </div>
  );
}

function ModalFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex gap-3 mt-6">
      <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors tracking-wider">
        BATALKAN
      </button>
      <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-200">
        <Save size={15} />
        SIMPAN DATA
      </button>
    </div>
  );
}

function PlanModal({ tahapan, onClose }: { tahapan: Tahapan; onClose: () => void }) {
  const [mulai, setMulai] = useState(formatDateForInput(tahapan.progres.planningTanggalMulai));
  const [selesai, setSelesai] = useState(formatDateForInput(tahapan.progres.planningTanggalSelesai));

  return (
    <ModalShell onClose={onClose}>
      <div className="px-7 pt-6 pb-7">
        <ModalHeader subtitle={tahapan.namaTahapan} onClose={onClose} />
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Target Waktu <span className="italic font-normal">(planning)</span>
        </p>
        <DateSelectors mulai={mulai} selesai={selesai} onMulai={setMulai} onSelesai={setSelesai} />
        <ModalFooter onClose={onClose} />
      </div>
    </ModalShell>
  );
}

function UpdateModal({ tahapan, onClose }: { tahapan: Tahapan; onClose: () => void }) {
  const [mulai, setMulai] = useState(formatDateForInput(tahapan.progres.aktualTanggalMulai));
  const [selesai, setSelesai] = useState(formatDateForInput(tahapan.progres.aktualTanggalSelesai));
  const [fileName, setFileName] = useState<string | null>(null);
  const [keterangan, setKeterangan] = useState(tahapan.progres.keterangan ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <ModalShell onClose={onClose}>
      <div className="px-7 pt-6 pb-7">
        <ModalHeader subtitle={tahapan.namaTahapan} onClose={onClose} />
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Realisasi Lapangan <span className="italic font-normal">(actual)</span>
        </p>
        <DateSelectors mulai={mulai} selesai={selesai} onMulai={setMulai} onSelesai={setSelesai} />

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
            <span className="text-sm text-gray-500 truncate">{fileName ?? "Belum ada file dipilih"}</span>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFileName(e.target.files[0].name); }} />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Keterangan :</label>
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

// ─── Main Component ─────────────────────────────────────────────────────────────
type ModalType = "plan" | "update";

export default function TimelineTable({ namaProgram = "Program", pengadaanList = [] }: TimelineTableProps) {
  const [modal, setModal] = useState<{ type: ModalType; tahapan: Tahapan } | null>(null);

  const columns = buildTimelineColumns(pengadaanList);
  const monthGroups = groupByMonth(columns);

  return (
    <>
      <div className="font-sans p-2 bg-white">
        {pengadaanList.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Belum ada data pengadaan</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th rowSpan={2} className="border border-gray-200 px-4 py-3 bg-gray-100 text-center font-semibold text-gray-700 w-52 min-w-[200px]">
                    Tahapan Proses
                  </th>
                  {monthGroups.map((g) => (
                    <th key={g.key} colSpan={g.count} className="border border-gray-200 py-2 bg-gray-100 text-center font-semibold text-gray-700 text-xs">
                      {g.label}
                    </th>
                  ))}
                </tr>
                <tr>
                  {columns.map((col, i) => (
                    <th key={i} className="border border-gray-200 py-1 px-1 text-xs font-medium text-gray-500 bg-gray-50 text-center w-10 min-w-[36px]">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pengadaanList.map((pengadaan) => (
                  <>
                    {/* Pengadaan Group Header */}
                    <tr key={`header-${pengadaan.id}`}>
                      <td
                        colSpan={columns.length + 1}
                        className="border border-gray-200 px-4 py-2 bg-red-50 text-xs font-bold text-[#CB0E0E] uppercase tracking-wide"
                      >
                        {pengadaan.namaTransaksi}
                      </td>
                    </tr>

                    {/* Tahapan Rows */}
                    {pengadaan.tahapanList.map((tahapan) => {
                      const planStart = getColIndex(columns, tahapan.progres.planningTanggalMulai);
                      const planEnd = getColIndex(columns, tahapan.progres.planningTanggalSelesai);
                      const actualStart = getColIndex(columns, tahapan.progres.aktualTanggalMulai);
                      const actualEnd = getColIndex(columns, tahapan.progres.aktualTanggalSelesai);

                      const planSpan = planStart >= 0 && planEnd >= planStart ? planEnd - planStart + 1 : 0;
                      const actualSpan = actualStart >= 0 && actualEnd >= actualStart ? actualEnd - actualStart + 1 : 0;

                      // Build per-column render info
                      const cells: ("plan-start" | "plan-fill" | "actual-start" | "actual-fill" | "empty" | null)[] = Array(columns.length).fill("empty");

                      if (planSpan > 0) {
                        for (let i = planStart; i <= planEnd && i < columns.length; i++) {
                          cells[i] = i === planStart ? "plan-start" : "plan-fill";
                        }
                      }
                      if (actualSpan > 0) {
                        for (let i = actualStart; i <= actualEnd && i < columns.length; i++) {
                          cells[i] = i === actualStart ? "actual-start" : "actual-fill";
                        }
                      }

                      return (
                        <tr key={tahapan.idTahapan} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          {/* Label Cell */}
                          <td className="border border-gray-200 px-3 py-3 bg-white align-top">
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                {tahapan.noUrut}
                              </span>
                              <div>
                                <div className="font-bold text-gray-800 text-xs leading-tight">{namaProgram}</div>
                                <div className="text-xs font-medium text-[#CB0E0E] mt-0.5">{tahapan.namaTahapan}</div>
                                <div className="flex gap-1 mt-2">
                                  <button className="px-2 py-0.5 text-[10px] border border-gray-300 rounded-full text-black hover:bg-gray-50 shadow-sm">
                                    PDF
                                  </button>
                                  <button
                                    onClick={() => setModal({ type: "plan", tahapan })}
                                    className="px-2 py-0.5 text-[10px] border bg-gray-300 border-gray-300 rounded-full text-black hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
                                  >
                                    PLAN
                                  </button>
                                  <button
                                    onClick={() => setModal({ type: "update", tahapan })}
                                    className="px-2 py-0.5 text-[10px] bg-red-600 text-white rounded-full hover:bg-red-700 active:scale-95 transition-all shadow-sm"
                                  >
                                    ACTUAL
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Timeline Cells */}
                          {(() => {
                            const renderedCells: React.ReactNode[] = [];
                            let i = 0;
                            while (i < columns.length) {
                              const cell = cells[i];

                              if (cell === "plan-start") {
                                // Find span
                                let span = 1;
                                while (i + span < columns.length && cells[i + span] === "plan-fill") span++;
                                renderedCells.push(
                                  <td key={i} colSpan={span} className="border border-gray-200 px-1 py-3 align-middle">
                                    <div className="h-4 rounded-full bg-gray-300 w-full shadow-inner" title={`Planning: ${tahapan.progres.planningTanggalMulai?.split("T")[0]} - ${tahapan.progres.planningTanggalSelesai?.split("T")[0]}`} />
                                  </td>
                                );
                                i += span;
                              } else if (cell === "actual-start") {
                                let span = 1;
                                while (i + span < columns.length && cells[i + span] === "actual-fill") span++;
                                renderedCells.push(
                                  <td key={i} colSpan={span} className="border border-gray-200 px-1 py-3 align-middle">
                                    <div className="h-4 rounded-full bg-[#CB0E0E] w-full shadow-sm" title={`Aktual: ${tahapan.progres.aktualTanggalMulai?.split("T")[0]} - ${tahapan.progres.aktualTanggalSelesai?.split("T")[0]}`} />
                                  </td>
                                );
                                i += span;
                              } else {
                                renderedCells.push(
                                  <td key={i} className="border border-gray-200 py-3" />
                                );
                                i++;
                              }
                            }
                            return renderedCells;
                          })()}
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal?.type === "plan" && (
        <PlanModal tahapan={modal.tahapan} onClose={() => setModal(null)} />
      )}
      {modal?.type === "update" && (
        <UpdateModal tahapan={modal.tahapan} onClose={() => setModal(null)} />
      )}
    </>
  );
}