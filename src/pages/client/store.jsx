import { useState } from "react";
import CardItem from "../../components/client/cardItem";
import { Dropdown, Button, Select } from "antd";
import { IoIosArrowDown } from "react-icons/io";

const CATEGORIES = ["ALL", "ACCESSORIES", "TROUSER", "T-SHIRT", "SHIRT"];

// Các khoảng giá mẫu
const PRICE_OPTIONS = [
  { key: "ALL", label: "All prices", min: undefined, max: undefined },
  { key: "P1", label: "Under 200,000 ₫", min: 0, max: 200_000 },
  { key: "P2", label: "200,000 ₫ - 500,000 ₫", min: 200_000, max: 500_000 },
  { key: "P3", label: "500,000 ₫ - 1,000,000 ₫", min: 500_000, max: 1_000_000 },
  {
    key: "P4",
    label: "1,000,000 ₫ - 3,000,000 ₫",
    min: 1_000_000,
    max: 3_000_000,
  },
  { key: "P5", label: "Above 3,000,000 ₫", min: 3_000_000, max: undefined },
];

const StorePage = () => {
  const [type, setType] = useState("ALL");
  const [priceKey, setPriceKey] = useState("ALL");

  const dropdownItems = CATEGORIES.map((c, idx) => ({
    key: String(idx + 1),
    label: (
      <button
        onClick={() => setType(c)}
        className="bg-black text-white border border-white p-2 w-full"
      >
        {c}
      </button>
    ),
  }));

  const selectedPrice =
    PRICE_OPTIONS.find((p) => p.key === priceKey) || PRICE_OPTIONS[0];

  return (
    <div className="bg-black min-h-screen">
      <div className="pt-10 max-w-6xl mx-auto px-4">
        {/* CATEGORY: Mobile dropdown */}
        <div className="block md:hidden w-[70%] mx-auto mb-4">
          <Dropdown
            className="w-full rounded-none"
            menu={{ items: dropdownItems }}
            placement="bottom"
          >
            <Button className="flex justify-between items-center w-full">
              <span className="font-bold">{type}</span>
              <IoIosArrowDown className="text-2xl" />
            </Button>
          </Dropdown>
        </div>

        {/* CATEGORY: Desktop buttons */}
        <div className="max-md:hidden grid grid-cols-5 gap-3 md:w-[90%] mx-auto mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setType(c)}
              className={`p-2 border rounded-md transition ${
                type === c
                  ? "bg-white text-[#000]"
                  : "bg-black text-white border-gray-600 hover:bg-white/10"
              }`}
            >
              {c === "TROUSER" ? "TROUSERS" : c}
            </button>
          ))}
        </div>

        {/* PRICE FILTER: Select (không dùng slider) */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-white font-semibold">Filter by Price</span>
            <Select
              value={priceKey}
              onChange={setPriceKey}
              className="min-w-[240px]"
              options={PRICE_OPTIONS.map((opt) => ({
                label: opt.label,
                value: opt.key,
              }))}
            />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <CardItem
          type={type}
          minPrice={selectedPrice.min}
          maxPrice={selectedPrice.max}
        />
      </div>
    </div>
  );
};

export default StorePage;
