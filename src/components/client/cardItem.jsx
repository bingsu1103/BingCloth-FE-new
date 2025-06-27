import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { Modal, Spin } from 'antd';
import { FaArrowDownLong } from "react-icons/fa6";
import { getProductAPI } from '../../services/api.product';

const CardItem = ({ type }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleItems, setVisibleItems] = useState(8);
    const [loading, setLoading] = useState(true);
    const [listProducts, setListProducts] = useState([]);
    const navigate = useNavigate();
    const handleOk = () => {
        setIsModalOpen(false);
        navigate("/login");
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleLoadMore = () => {
        setVisibleItems((prev) => prev + 8);
    };
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await getProductAPI();
                if (res && res.EC === 0) {
                    setListProducts(res.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }

    if (!listProducts.length) {
        return <p className="text-center">No products found.</p>;
    }
    const filteredProducts = type && type !== "ALL"
        ? listProducts.filter(item => item.categoryInfo?.name?.toLowerCase() === type.toLowerCase())
        : listProducts;
    return (
        <div className="flex flex-col items-center w-full md:p-20 max-md:p-12">
            <div className="grid grid-cols-4 max-sm:grid-cols-1 cursor-pointer gap-10">
                {filteredProducts.slice(0, visibleItems).map((item) => (
                    <div
                        onClick={() => navigate(`/view-detail-product/${item._id}`)}
                        key={item._id}
                        className="w-full flex flex-col items-center bg-[#252525]"
                    >
                        <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover bg-[#fff]"
                        />
                        <div className="p-4 w-full">
                            <div className="mt-2">
                                <h2 className="font-bold text-lg text-[#fff] max-lg:text-sm">{item.name}</h2>
                                <span className="text-[#fff] max-lg:text-sm">{item.price}</span>
                            </div>
                        </div>
                        <Modal
                            getContainer={false}
                            title="Authentication required"
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <p>You need to login first to use get item to cart</p>
                        </Modal>
                    </div>
                ))}
            </div>
            {visibleItems < filteredProducts.length && (
                <div>
                    <button
                        onClick={handleLoadMore}
                        className="hover:bg-[#1778ffca] flex items-center gap-2 mt-5 bg-[#000] text-white border-1 border-[#fff] font-bold cursor-pointer px-4 py-2 rounded"
                    >
                        <span>More</span>
                        <FaArrowDownLong width={100} />
                    </button>

                </div>
            )}
        </div>
    );
};

export default CardItem;