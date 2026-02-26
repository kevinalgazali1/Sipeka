"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { BookOpen, X, FileText, Eye, Download, Upload } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

interface DocumentItem {
  id: number;
  programId: number;
  namaFile: string;
  fileUrl: string;
  createdAt: string;
}

export default function ArsipDigitalProgram() {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loadingDokumen, setLoadingDokumen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const params = useParams();

  const slug = params?.slug as string;
  const subSlug = params?.subSlug as string;

  /* ================= FETCH DATA ================= */

  const fetchDokumen = async () => {
    try {
      const token = getCookie("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/gubernur/program/${subSlug}/dokumen`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil dokumen");
      }

      const json = await res.json();
      console.log(json);
      setDocuments(json.data || []);
    } catch (err) {
      console.error("Error fetch dokumen:", err);
    } finally {
      setLoadingDokumen(false);
    }
  };

  useEffect(() => {
    if (subSlug) fetchDokumen();
  }, [subSlug]);

  /* ================= HANDLERS ================= */

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    const extension = fileName
      .substring(fileName.lastIndexOf("."))
      .toLowerCase();

    if (!allowedTypes.includes(extension)) {
      toast.error("Tipe file tidak diizinkan");
      return;
    }

    try {
      const response = await fetch(`https://sulsel.cloud${fileUrl}`);
      if (!response.ok) {
        throw new Error("Gagal mengunduh file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("File berhasil didownload");
    } catch (error) {
      toast.error("Download gagal");
      console.error(error);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
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
              <p className="text-sm text-black font-semibold capitalize">
                {subSlug?.replace(/-/g, " ")}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center cursor-pointer text-black hover:bg-gray-100"
          >
            <X className="w-4 h-4" strokeWidth={4} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 flex gap-6 text-black max-h-75 h-full items-start">
          {/* ================= LEFT: DOCUMENT LIST ================= */}
          <div className="flex flex-col overflow-hidden max-h-65">
            <h2 className="text-sm font-bold mb-1">Daftar Dokumen</h2>

            {loadingDokumen ? (
              <p className="text-xs text-gray-400">Memuat data...</p>
            ) : documents.length === 0 ? (
              <p className="text-xs text-gray-400">
                Belum ada dokumen diupload
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all"
                  >
                    <div className="bg-red-100 rounded-lg w-9 h-9 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        {doc.namaFile}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`https://sulsel.cloud${doc.fileUrl}`}
                        target="_blank"
                        className="text-gray-800 hover:text-blue-500"
                      >
                        <Eye className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() =>
                          handleDownload(doc.fileUrl, doc.namaFile)
                        }
                        className="text-gray-800 hover:text-green-500"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
