"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  BookOpen,
  X,
  FileText,
  Eye,
  Download,
  Upload
} from "lucide-react";

/* ================= TYPES ================= */

interface DocumentItem {
  id: number;
  name: string;
  subtitle: string;
}

const documents: DocumentItem[] = [
  { id: 1, name: "INVOICE", subtitle: "keuangan / invoice" },
  { id: 2, name: "INVOICE", subtitle: "keuangan / invoice" },
  { id: 3, name: "INVOICE", subtitle: "keuangan / invoice" },
];

export default function ArsipDigitalProgram() {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= HANDLERS ================= */

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <div
      className="min-h-screen bg-gray-200 flex items-center justify-center p-6"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border-t-16 border-[#CB0E0E]">
        
        {/* ================= HEADER ================= */}
        <div className="bg-white px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-10">
            <div className="bg-red-600 rounded-xl w-16 h-16 flex items-center justify-center shadow-md rotate-6">
              <BookOpen className="w-10 h-10 text-white" strokeWidth={2} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold italic tracking-wide text-black">
                Arsip Digital Program
              </h1>
              <p className="text-sm text-black font-semibold tracking-normal">
                Pembangunan Rumah Layak Huni – Kec. Sukajadi
              </p>
            </div>
          </div>

          <button className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" strokeWidth={4} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 grid grid-cols-2 gap-6 text-black">
          
          {/* ================= LEFT: DOCUMENT LIST ================= */}
          <div>
            <h2 className="text-sm font-bold mb-1">
              Daftar Dokumen
            </h2>
            <p className="text-xs mb-4">
              (Invoice/spk/lampiran)
            </p>

            <div className="flex flex-col gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all group"
                >
                  <div className="bg-red-100 rounded-lg w-9 h-9 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-red-600" strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {doc.subtitle}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="text-gray-800 hover:text-blue-500 transition-colors">
                      <Eye className="w-4 h-4" strokeWidth={2} />
                    </button>

                    <button className="text-gray-800 hover:text-green-500 transition-colors">
                      <Download className="w-4 h-4" strokeWidth={2} />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: UPLOAD AREA ================= */}
          <div className="flex flex-col items-center justify-center">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 cursor-pointer transition-all
              ${
                dragOver
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50"
              }`}
              style={{ minHeight: 160 }}
            >
              <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gray-500" strokeWidth={2} />
              </div>

              <p className="text-sm font-bold uppercase tracking-wide">
                Upload File
              </p>

              <p className="text-xs text-gray-400 text-center mt-1">
                {uploadedFile
                  ? uploadedFile.name
                  : "Pilih PDF atau foto INVOICE PROYEK"}
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              Mendukung PDF, JPG, PNG, Doc, Excel, Sheet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}