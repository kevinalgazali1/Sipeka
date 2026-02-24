import { getCookie } from "cookies-next";

export interface MetodePengadaanOption {
  id: number;
  label: string;
  value: string;
}

interface PengadaanItem {
  id: number;
  namaPengadaan: string;
}

interface PengadaanResponse {
  msg: string;
  data: PengadaanItem[];
}

export const getMetodePengadaan = async (): Promise<
  MetodePengadaanOption[]
> => {
  try {
    const token = getCookie("accessToken");

    const res = await fetch(
      "https://sulsel.cloud/api/staff/pengadaan",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil data pengadaan");
    }

    const json: PengadaanResponse = await res.json();

    return json.data.map((item) => ({
      id: item.id,
      label: item.namaPengadaan,
      value: item.namaPengadaan
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "_")
        .replace(/_+/g, "_"),
    }));
  } catch (error) {
    console.error("Error fetch metode pengadaan:", error);
    return [];
  }
};