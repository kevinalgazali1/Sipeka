"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Check } from "lucide-react";

type Option = {
  id: number;
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selected: number[];
  onChange: (values: number[]) => void;
};

export default function MultiSelectMetode({
  options,
  selected,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close ketika klik luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeItem = (id: number) => {
    onChange(selected.filter((item) => item !== id));
  };

  return (
    <div className="relative space-y-3" ref={ref}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 rounded-lg bg-gray-200 cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-red-500"
      >
        <span className="text-gray-700">
          {selected.length > 0
            ? `${selected.length} metode dipilih`
            : "Pilih Metode"}
        </span>
        <ChevronDown size={18} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full mb-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {options.map((item) => {
            const isSelected = selected.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className="px-4 py-2 hover:bg-red-50 cursor-pointer flex justify-between items-center"
              >
                <span>{item.label}</span>
                {isSelected && <Check size={16} className="text-red-600" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Chips */}
      <div className="flex flex-wrap gap-2">
        {selected.map((id) => {
          const item = options.find((opt) => opt.id === id);

          return (
            <div
              key={id}
              className="flex items-center gap-2 bg-red-100 text-[#CB0E0E] px-3 py-1 rounded-full text-sm"
            >
              {item?.label}
              <button onClick={() => removeItem(id)}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
