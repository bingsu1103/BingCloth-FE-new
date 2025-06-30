import { useState } from "react";
import CardItem from "../../components/client/cardItem";
import { Dropdown, Button } from "antd";
import { IoIosArrowDown } from "react-icons/io";

const StorePage = () => {
    const [type, setType] = useState("ALL");

    const items = [
        {
            key: '1',
            label: (
                <button onClick={() => setType("ALL")} className="bg-black text-white border border-white p-2 w-full">ALL</button>
            ),
        },
        {
            key: '2',
            label: (
                <button onClick={() => setType("ACCESSORIES")} className="bg-black text-white border border-white p-2 w-full">ACCESSORIES</button>
            ),
        },
        {
            key: '3',
            label: (
                <button onClick={() => setType("TROUSER")} className="bg-black text-white border border-white p-2 w-full">TROUSERS</button>
            ),
        },
        {
            key: '4',
            label: (
                <button onClick={() => setType("T-SHIRT")} className="bg-black text-white border border-white p-2 w-full">T-SHIRT</button>
            )
        },
        {
            key: '5',
            label: (
                <button onClick={() => setType("SHIRT")} className="bg-black text-white border border-white p-2 w-full">SHIRT</button>
            )
        }
    ];
    return (
        <div className="bg-black min-h-screen">
            <div className="pt-10">
                <div className="block md:hidden w-[70%] mx-auto mb-4">
                    <Dropdown className="w-full rounded-none" menu={{ items }} placement="bottom">
                        <Button className="flex justify-between items-center">
                            <span className="font-bold">{type}</span>
                            <IoIosArrowDown className="text-2xl" />
                        </Button>
                    </Dropdown>
                </div>
                <div className="max-md:hidden md:grid md:grid-cols-5 gap-4 md:w-[90%] mx-auto">
                    <button onClick={() => setType("ALL")} className={`p-2 border w-full ${type === "ALL" ? "bg-white text-[#000]" : "bg-black text-white"
                        }`}>ALL</button>
                    <button onClick={() => setType("ACCESSORIES")} className={`p-2 border w-full ${type === "ACCESSORIES" ? "bg-white text-[#000]" : "bg-black text-white"
                        }`}>ACCESSORIES</button>
                    <button onClick={() => setType("TROUSER")} className={`p-2 border w-full ${type === "TROUSER" ? "bg-white text-[#000]" : "bg-black text-white"
                        }`}>TROUSERS</button>
                    <button onClick={() => setType("T-SHIRT")} className={`p-2 border w-full ${type === "T-SHIRT" ? "bg-white text-[#000]" : "bg-black text-white"
                        }`}>T-SHIRT</button>
                    <button onClick={() => setType("SHIRT")} className={`p-2 border w-full ${type === "SHIRT" ? "bg-white text-[#000]" : "bg-black text-white"
                        }`}>SHIRT</button>
                </div>
                <div className="">
                    <CardItem type={type} />
                </div>
            </div>
        </div>
    )
}
export default StorePage;