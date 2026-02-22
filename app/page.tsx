"use client";

import Image from "next/image";

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-[#3a0000]">
      <div className="relative min-h-screen overflow-hidden">
        
        {/* Background */}
        <Image
          src="/background.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex min-h-screen flex-col md:flex-row">
          
          {/* ================= LEFT ================= */}
          <div className="flex-1 flex flex-col justify-center px-12 pt-4 md:px-20 text-white">
            
            <h1 className="text-5xl font-extrabold tracking-wide mb-6">
              PEMPROV SULSEL
            </h1>

            <p className="max-w-xl text-lg text-gray-200 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam.
            </p>

            {/* Pejabat */}
            <div className="relative mt-10 flex items-end">
              <Image
                src="/gubernur.png"
                alt="Gubernur"
                width={420}
                height={550}
                className="object-contain z-10"
              />
              <Image
                src="/wakil.png"
                alt="Wakil"
                width={380}
                height={520}
                className="object-contain -ml-16"
              />
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex-1 flex items-center justify-center px-10 md:px-20">
            
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border-t-16 border-[#CB0E0E]">

              {/* Logo floating */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#CB0E0E] w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">
                  <Image
                  className="rotate-0"
                    src="/logo.png" alt="Logo" width={50} height={50} />
                </div>
              </div>

              <h2 className="text-center text-2xl font-bold text-gray-800">
                E-MONITOR
              </h2>
              <p className="text-center text-gray-500 text-sm mb-8">
                SULAWESI SELATAN
              </p>

              <form className="space-y-5">
                <div>
                  <label className="text-sm text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#CB0E0E] hover:bg-red-700 transition text-white py-2 rounded-lg font-semibold shadow-md"
                >
                  Sign In
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}