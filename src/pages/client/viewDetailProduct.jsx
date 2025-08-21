import {
  Form,
  InputNumber,
  Select,
  Button,
  Spin,
  message,
  Divider,
  Tag,
  Rate,
} from "antd";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { getAProductAPI } from "../../services/api.product";
import { createOrderAPI, getCurrentOrderAPI } from "../../services/api.order";
import { useCurrentApp } from "../../components/context/app.context";
import { createItemAPI, updateItemAPI } from "../../services/api.item";
import { AiFillHeart } from "react-icons/ai";
import { Carousel } from "antd";
import SlickButtonFix from "../../components/client/slickButtonFix";

const colorOption = ["#0000FF", "#808080", "#000", "#FFF"];

const ViewDetailProductPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refetchCart } = useCurrentApp();

  const [product, setProduct] = useState(null);
  const [liked, setLiked] = useState(false);

  const [item, setItem] = useState({
    productInfo: id,
    quantity: 1,
    price: 0,
    size: "S",
    color: "#FFF",
  });

  // ---- Format tiền VND
  const fmtVND = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    []
  );

  // ---- Helpers cập nhật form/state
  const handleChange = (field) => (value) => {
    setItem((prev) => ({ ...prev, [field]: value }));
    form.setFieldValue(field, value);
  };

  const handleColorClick = (color) => {
    setItem((prev) => ({ ...prev, color }));
    form.setFieldValue("color", color);
  };

  // ---- Lấy product detail
  useEffect(() => {
    (async () => {
      try {
        const res = await getAProductAPI(id);
        if (res?.EC === 0) {
          const prod = res.data;
          setProduct(prod);
          setItem((prev) => ({ ...prev, price: Number(prod.price) || 0 }));
        } else {
          message.error("Không tải được thông tin sản phẩm");
        }
      } catch (e) {
        console.error(e);
        message.error("Lỗi tải sản phẩm");
      }
    })();
  }, [id]);

  // Sync form khi item đổi
  useEffect(() => {
    form.setFieldsValue({
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    });
  }, [item, form]);

  // ---------- CORE: đồng bộ item hiện tại vào Order & update total ----------
  const upsertItemIntoOrder = async () => {
    if (!isAuthenticated) {
      message.error("You need to login first");
      return null;
    }
    if (!product?._id) {
      message.error("Product is not ready");
      return null;
    }

    const qty = Number(item.quantity) || 0;
    const stock = Number(product.stock_quantity) || 0;
    const unitPrice = Number(product.price) || 0;

    if (qty < 1) {
      message.error("Quantity must be at least 1");
      return null;
    }
    if (qty > stock) {
      message.error("Not enough stock");
      return null;
    }

    // 1) Lấy/khởi tạo order hiện tại
    const res = await getCurrentOrderAPI(user._id);
    let cart = res?.data;
    if (!cart?._id) {
      await createOrderAPI("EMPTY-ORDER", {
        userInfo: user._id,
        total_amount: 0,
      });
      const again = await getCurrentOrderAPI(user._id);
      cart = again?.data;
    }
    const orderID = cart?._id;
    if (!orderID) {
      message.error("Cannot create/load current order");
      return null;
    }

    // 2) Tìm item trùng (cùng product + size + color)
    const existing = cart?.items?.find(
      (i) =>
        (i.productInfo?._id || i.productInfo) === product._id &&
        i.size === item.size &&
        (i.color || "").toLowerCase() === (item.color || "").toLowerCase()
    );

    if (existing) {
      const newQty = Number(existing.quantity || 0) + qty;
      if (newQty > stock) {
        message.error("Not enough stock");
        return null;
      }
      // luôn ghi lại price hiện tại để tính total đúng
      await updateItemAPI({
        id: existing._id,
        quantity: newQty,
        price: unitPrice,
      });
    } else {
      const created = await createItemAPI({
        productInfo: product._id,
        quantity: qty,
        price: unitPrice,
        size: item.size,
        color: item.color,
      });
      const itemID = created?.data?._id;
      if (itemID) {
        await createOrderAPI("ADD-ITEM", {
          OrderID: orderID,
          arrItem: [itemID],
        });
      } else {
        message.error("Create item failed");
        return null;
      }
    }

    // 3) Cập nhật tổng tiền theo giá hiện tại
    await createOrderAPI("UPDATE-TOTAL", { OrderID: orderID });

    return orderID;
  };

  // ---- Add to cart (submit form)
  const handleAddToCart = async () => {
    const hide = message.loading("Adding to cart...");
    try {
      const orderID = await upsertItemIntoOrder();
      if (!orderID) return;
      await refetchCart?.();
      message.success("Added to cart!");
    } catch (e) {
      console.error(e);
      message.error("Add to cart failed");
    } finally {
      hide();
    }
  };

  // ---- Buy now
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      message.error("You need to login first");
      return;
    }
    const hide = message.loading("Preparing checkout...");
    try {
      const orderID = await upsertItemIntoOrder();
      if (!orderID) return;
      await refetchCart?.();
      navigate("/checkout");
    } catch (e) {
      console.error(e);
      message.error("Cannot proceed to checkout");
    } finally {
      hide();
    }
  };

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

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs md:text-sm">
              <div className="rounded-lg bg-gray-50 py-2 border border-gray-100 text-black font-bold">
                Free ship order 500k
              </div>
              <div className="rounded-lg bg-gray-50 py-2 border border-gray-100 text-black font-bold">
                7-day return
              </div>
              <div className="rounded-lg bg-gray-50 py-2 border border-gray-100 text-black font-bold">
                Security payment
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

              <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-4 py-3">
                <div className="text-gray-500 text-sm">Price</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {fmtVND.format(Number(product.price) || 0)}
                </div>
              </div>

              <Divider className="my-6" />

              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={handleAddToCart}
              >
                {/* Color */}
                <Form.Item
                  label={
                    <span className="font-semibold text-sm text-gray-800">
                      Color
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
                        (item.color || "").toLowerCase() ===
                        color.toLowerCase();
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
                      Size
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
                      Quantity
                    </span>
                  }
                  name="quantity"
                  rules={[
                    { required: true, message: "Please input quantity!" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={Number(product.stock_quantity) || 1}
                    value={item.quantity}
                    onChange={handleChange("quantity")}
                    className="w-40"
                    size="large"
                  />
                </Form.Item>

                {/* Total (client-side) */}
                <div className="mt-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex items-center justify-between">
                  <span className="text-base md:text-lg font-semibold text-gray-800">
                    Total
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-gray-900">
                    {fmtVND.format(
                      (Number(item.price) || 0) * (Number(item.quantity) || 0)
                    )}
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
                    Add to cart
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    size="large"
                    type="primary"
                    className="!h-12 !rounded-full !font-semibold"
                  >
                    Buy now
                  </Button>
                </div>
              </Form>
            </div>

            {/* Mô tả/Chính sách */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Product description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "Sản phẩm chất lượng cao, thiết kế hiện đại và bền bỉ. Phù hợp nhiều phong cách và mục đích sử dụng."}
              </p>
              <Divider className="my-6" />
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Policy
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Free shipping on orders over 500,000₫</li>
                <li>7-day return policy for manufacturer defects</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailProductPage;
