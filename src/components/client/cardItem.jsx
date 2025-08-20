import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Modal, Spin } from "antd";
import { FaArrowDownLong } from "react-icons/fa6";
import { getProductAPI } from "../../services/api.product";

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
  const handleCancel = () => setIsModalOpen(false);
  const handleLoadMore = () => setVisibleItems((prev) => prev + 8);

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

  const filteredProducts =
    type && type !== "ALL"
      ? listProducts.filter(
          (item) =>
            item.categoryInfo?.name?.toLowerCase() === type.toLowerCase()
        )
      : listProducts;

  return (
    <div className="flex flex-col items-center w-full md:p-20 max-md:p-12">
      {/* Grid responsive, khoảng cách đều */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 cursor-pointer gap-6 md:gap-8 w-full">
        {filteredProducts.slice(0, visibleItems).map((item) => (
          <article
            onClick={() => navigate(`/view-detail-product/${item._id}`)}
            key={item._id}
            className="w-full h-full bg-[#252525] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            {/* Khung ảnh cố định tỉ lệ (vuông) */}
            <div className="relative w-full aspect-square bg-white">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

            {/* Nội dung */}
            <div className="p-4 w-full flex-1 flex flex-col">
              <h2
                className="font-bold text-base md:text-lg text-white leading-snug"
                title={item.name}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  // chiều cao tối thiểu tương ứng 2 dòng để các card bằng nhau
                  minHeight: "2.8rem",
                }}
              >
                {item.name}
              </h2>

              {/* Footer luôn bám đáy để thẳng hàng */}
              <div className="mt-auto pt-3">
                <span className="text-white md:text-base text-sm font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </span>
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
          </article>
        ))}
      </div>

      {visibleItems < filteredProducts.length && (
        <div>
          <button
            onClick={handleLoadMore}
            className="hover:bg-[#1778ffca] flex items-center gap-2 mt-5 bg-[#000] text-white border border-[#fff] font-bold cursor-pointer px-4 py-2 rounded"
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
