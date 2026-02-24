"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  getMetodePengadaan,
  MetodePengadaanOption,
} from "@/services/metodePengadaan";
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

interface ProgramItem {
  id: number;
  namaProgram: string;
  slug: string;
  anggaran: string;
  createdAt: string;
  pengadaanList: string[];
}

interface CreateProgramPayload {
  namaProgram: string;
  anggaran: number;
  pengadaanIds: number[];
}

interface CreateProgramResponse {
  msg: string;
  data: {
    id: number;
    namaProgram: string;
    slug: string;
  };
}

export default function ProgramPage() {
  const [open, setOpen] = useState(false);
  const [metodeOptions, setMetodeOptions] = useState<MetodePengadaanOption[]>(
    [],
  );
  const [programList, setProgramList] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [namaProgram, setNamaProgram] = useState("");
  const [anggaran, setAnggaran] = useState("");
  const [metode, setMetode] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const params = useParams();
  const router = useRouter();

  const slug = params?.slug as string;

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  // Format slug jadi Nama Dinas
  const formatNamaDinas = (slug: string) => {
    return slug
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const fetchProgram = async () => {
    try {
      const token = getCookie("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/staff/${slug}/program`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = await res.json();

      if (json?.data) {
        setProgramList(json.data);
      }
    } catch (err) {
      console.error("Error fetch program:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchProgram();
  }, [slug]);

  useEffect(() => {
    const fetchMetode = async () => {
      const data = await getMetodePengadaan();
      setMetodeOptions(data);
    };

    fetchMetode();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!namaProgram.trim()) {
      toast.error("Nama program wajib diisi");
      return;
    }

    if (!anggaran || Number(anggaran.replace(/\./g, "")) <= 0) {
      toast.error("Anggaran tidak valid");
      return;
    }

    if (metode.length === 0) {
      toast.error("Pilih minimal satu metode pengadaan");
      return;
    }

    try {
      setSubmitting(true);

      const token = getCookie("accessToken");

      const payload: CreateProgramPayload = {
        namaProgram,
        anggaran: Number(anggaran.replace(/\./g, "")),
        pengadaanIds: metode,
      };

      const res = await fetch("https://sulsel.cloud/api/staff/program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error();
      }

      const json: CreateProgramResponse = await res.json();

      toast.success(json.msg);

      setNamaProgram("");
      setAnggaran("");
      setMetode([]);
      setOpen(false);

      fetchProgram();
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan program");
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAnggaranChange = (value: string) => {
    const formatted = formatRupiah(value);
    setAnggaran(formatted);
  };

  const formatRupiahCompact = (value: number) => {
    if (value >= 1_000_000_000_000) {
      return `Rp ${(value / 1_000_000_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} Triliun`;
    }

    if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} Miliar`;
    }

    if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} Juta`;
    }

    if (value >= 1_000) {
      return `Rp ${(value / 1_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} Ribu`;
    }

    return `Rp ${value.toLocaleString("id-ID")}`;
  };

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
              {formatNamaDinas(slug)}
            </p>
            <h1 className="text-4xl font-extrabold italic tracking-wide">
              DASHBOARD
            </h1>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* ================= BACK BUTTON ================= */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition mb-10"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        {/* ================= PROGRAM CARD ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 text-black">
          {loading && <p>Loading...</p>}

          {!loading &&
            programList.map((item) => {
              const subSlug = slugify(item.namaProgram);

              return (
                <Link
                  key={item.id}
                  href={`/monitoring-staff/${slug}/${subSlug}`}
                  className="block"
                >
                  <div className="relative bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition border-t-16 border-[#CB0E0E] flex flex-col justify-between min-h-80 cursor-pointer hover:scale-[1.02] duration-200">
                    <div>
                      <div className="relative flex justify-between items-center mt-10 mb-6">
                        <div className="bg-[#CB0E0E] w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow">
                          <BookOpen />
                        </div>

                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs shadow-md shadow-black/20">
                          <Check size={14} />
                          Aktif
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold leading-snug mb-2 wrap-break-word">
                        {item.namaProgram}
                      </h2>

                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        METODE : {item.pengadaanList.join(", ")}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-[#CB0E0E] text-xl font-bold">
                        {formatRupiahCompact(Number(item.anggaran))}
                      </p>

                      <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#f2f2f2] rounded-3xl shadow-2xl p-8 text-black border-t-16 border-[#CB0E0E]"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "modalIn 0.2s ease" }}
          >
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
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-gray-600">Nama Program</label>
                <input
                  type="text"
                  value={namaProgram}
                  onChange={(e) => setNamaProgram(e.target.value)}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-200 outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Anggaran</label>
                <input
                  type="text"
                  value={anggaran}
                  onChange={(e) => handleAnggaranChange(e.target.value)}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-200 outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Metode Pengadaan
                </label>
                <MultiSelectMetode
                  options={metodeOptions}
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
                  disabled={submitting}
                  className={`flex items-center gap-2 px-18 py-2 rounded-lg shadow text-white
                  ${
                    submitting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-[#CB0E0E] hover:bg-red-700"
                  }`}
                >
                  {submitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>

          {/* Animasi dari kode pertama */}
          <style>{`
      @keyframes modalIn {
        from { 
          opacity: 0; 
          transform: scale(0.95) translateY(8px); 
        }
        to { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
      }
    `}</style>
        </div>
      )}
    </section>
  );
}
