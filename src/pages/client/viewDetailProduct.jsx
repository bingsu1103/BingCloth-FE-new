import {
  Form,
  InputNumber,
  Select,
  Button,
  Spin,
  message,
  Divider,
  Tag,
} from "antd";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { getAProductAPI } from "../../services/api.product";
import { createOrderAPI, getOrderAPI } from "../../services/api.order";
import { UseCurrentApp } from "../../components/context/app.context";
import { createItemAPI, updateItemAPI } from "../../services/api.item";
import { AiFillHeart } from "react-icons/ai";
import { Rate, Carousel } from "antd";
import SlickButtonFix from "../../components/client/slickButtonFix";

const colorOption = ["#0000FF", "#808080", "#000000", "#FFFFFF"];

const ViewDetailProductPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, refetchCart } = UseCurrentApp();
  const [liked, setLiked] = useState(false);

  const [item, setItem] = useState({
    productInfo: id,
    quantity: 1,
    price: 0,
    size: "S",
    color: "#FFFFFF",
  });

  // Formatter VND
  const fmtVND = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
    []
  );

  const handleChange = (field) => (value) => {
    setItem((prev) => ({
      ...prev,
      [field]: value,
    }));
    form.setFieldValue(field, value);
  };

  const handleColorClick = (color) => {
    setItem((prev) => ({
      ...prev,
      color,
    }));
    form.setFieldValue("color", color);
  };

  const handleSubmit = async () => {
    try {
      if (!isAuthenticated) {
        message.error("You need to login first");
        return;
      }
      const res = await getOrderAPI(user._id);
      const orders = res?.data || [];
      let cart = orders.find((order) => order.status === "none");

      if (!cart) {
        await createOrderAPI("EMPTY-ORDER", {
          userInfo: user._id,
          total_amount: 0,
        });
        const newRes = await getOrderAPI(user._id);
        cart = newRes?.data?.find((order) => order.status === "none");
      }

      const orderID = cart?._id;
      const existingItem = cart?.items?.find(
        (i) =>
          (i.productInfo === item.productInfo ||
            i.productInfo?._id === item.productInfo) &&
          i.size === item.size &&
          i.color === item.color
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        await updateItemAPI({ id: existingItem._id, quantity: newQuantity });
      } else {
        const itemRes = await createItemAPI(item);
        const itemID = itemRes?.data?._id;

        if (orderID && itemID) {
          await createOrderAPI("ADD-ITEM", {
            OrderID: orderID,
            arrItem: [itemID],
          });
        }
      }

      refetchCart?.();
      message.success("Add item to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Add item to cart failed!");
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await getAProductAPI(id);
        if (res && res.EC === 0) {
          const prod = res.data;
          setProduct(prod);
          setItem((prev) => ({
            ...prev,
            price: prod.price,
          }));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    form.setFieldsValue({
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    });
  }, [item, form]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb + Back (tùy chọn) */}
        <div className="mb-6 text-sm text-gray-500">
          <span
            className="hover:underline cursor-pointer"
            onClick={() => navigate(-1)}
          >
            ← Back
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Gallery */}
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
            {product.images?.length > 1 ? (
              <div className="relative">
                <Carousel
                  dots
                  arrows
                  nextArrow={<SlickButtonFix type="next" />}
                  prevArrow={<SlickButtonFix type="prev" />}
                >
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={img}
                          alt={`Product ${index}`}
                          className="absolute inset-0 w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            )}
            {/* Info strip dưới ảnh (tùy chọn) */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs md:text-sm">
              <div className="rounded-lg bg-gray-50 py-2 border border-gray-100 text-black font-bold">
                Free ship đơn 500k
              </div>
              <div className="rounded-lg bg-gray-50 py-2 border border-gray-100 text-black font-bold">
                Đổi trả 7 ngày
              </div>
              <div className="rounded-lg bg-gray-50 py-2 border border-gray-100 text-black font-bold">
                Thanh toán an toàn
              </div>
            </div>
          </div>

          {/* RIGHT: Summary / Form */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl shadow-md p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-3">
                    <Rate disabled allowHalf defaultValue={4} />
                    <span className="text-sm text-gray-500">
                      (1.2k reviews)
                    </span>
                  </div>
                  <div className="mt-3">
                    {product.stock_quantity > 0 ? (
                      <Tag color="green" className="px-2 py-1 rounded-full">
                        Available • {product.stock_quantity} in stock
                      </Tag>
                    ) : (
                      <Tag color="red" className="px-2 py-1 rounded-full">
                        Out of stock
                      </Tag>
                    )}
                  </div>
                </div>

                {/* Like */}
                <AiFillHeart
                  onClick={() => setLiked(!liked)}
                  style={{
                    fontSize: "28px",
                    color: liked ? "red" : "#999",
                    cursor: "pointer",
                    transition: "color 0.1s ease",
                  }}
                  title={liked ? "Đã thích" : "Thêm vào yêu thích"}
                />
              </div>

              {/* Price */}
              <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-4 py-3">
                <div className="text-gray-500 text-sm">Giá</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {fmtVND.format(product.price)}
                </div>
              </div>

              <Divider className="my-6" />

              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
              >
                {/* Color */}
                <Form.Item
                  label={
                    <span className="font-semibold text-sm text-gray-800">
                      Màu sắc
                    </span>
                  }
                  name="color"
                  rules={[
                    { required: true, message: "Please select a color!" },
                  ]}
                >
                  <div className="flex items-center gap-3">
                    {colorOption.map((color) => {
                      const isSelected =
                        item.color?.toLowerCase() === color.toLowerCase();
                      const isWhite =
                        color.toLowerCase() === "#ffffff" ||
                        color.toLowerCase() === "#fff";
                      return (
                        <button
                          type="button"
                          key={color}
                          onClick={() => handleColorClick(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            isSelected
                              ? "ring-2 ring-blue-500 border-blue-500 scale-105"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {/* Viền xám cho màu trắng để dễ thấy */}
                          {isWhite && !isSelected && (
                            <span className="block w-full h-full rounded-full border border-gray-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Form.Item>

                {/* Size */}
                <Form.Item
                  label={
                    <span className="font-semibold text-sm text-gray-800">
                      Kích cỡ
                    </span>
                  }
                  name="size"
                  rules={[{ required: true, message: "Please select a size!" }]}
                >
                  <Select
                    value={item.size}
                    onChange={handleChange("size")}
                    options={["S", "M", "L", "XL"].map((s) => ({
                      label: s,
                      value: s,
                    }))}
                    className="max-w-xs"
                    size="large"
                  />
                </Form.Item>

                {/* Quantity */}
                <Form.Item
                  label={
                    <span className="font-semibold text-sm text-gray-800">
                      Số lượng
                    </span>
                  }
                  name="quantity"
                  rules={[
                    { required: true, message: "Please input quantity!" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={product.stock_quantity}
                    value={item.quantity}
                    onChange={handleChange("quantity")}
                    className="w-40"
                    size="large"
                  />
                </Form.Item>

                {/* Total */}
                <div className="mt-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex items-center justify-between">
                  <span className="text-base md:text-lg font-semibold text-gray-800">
                    Tổng cộng
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-gray-900">
                    {fmtVND.format((item.price || 0) * (item.quantity || 0))}
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="!h-12 !rounded-full !font-semibold"
                    style={{ backgroundColor: "#111827" }}
                  >
                    Thêm vào giỏ
                  </Button>

                  <Button
                    onClick={() => {
                      if (!isAuthenticated) {
                        message.error("You need to login first");
                        return;
                      }
                      navigate("/checkout");
                    }}
                    size="large"
                    type="primary"
                    className="!h-12 !rounded-full !font-semibold"
                  >
                    Mua ngay
                  </Button>
                </div>
              </Form>
            </div>

            {/* Mô tả / Chính sách (tùy chọn) */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả sản phẩm
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "Sản phẩm chất lượng cao, thiết kế hiện đại và bền bỉ. Phù hợp nhiều phong cách và mục đích sử dụng."}
              </p>
              <Divider className="my-6" />
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Chính sách
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Miễn phí vận chuyển cho đơn từ 500.000đ</li>
                <li>Đổi trả trong vòng 7 ngày nếu có lỗi nhà sản xuất</li>
                <li>Hỗ trợ khách hàng 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailProductPage;
