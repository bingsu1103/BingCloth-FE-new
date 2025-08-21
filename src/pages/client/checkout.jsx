import { Form, Input, Select, Radio, message } from "antd";
import { useNavigate } from "react-router";
import { useCurrentApp } from "../../components/context/app.context";
import { useState } from "react";
import { createShippingAPI } from "../../services/api.shipping";
import { createPaymentAPI, updatePaymentAPI } from "../../services/api.payment";
import { createOrderAPI, updateOrderAPI } from "../../services/api.order";
import { updateProductAPI } from "../../services/api.product";
import { createPaymentOnline } from "../../services/momo.service";

const CheckOutPage = () => {
  const { isAuthenticated, cartItems, orderId, refetchCart } = useCurrentApp();
  const [selectedShipping, setSelectedShipping] = useState();
  const [selectedPayment, setSelectedPayment] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async () => {
    const values = await form.validateFields();
    if (!isAuthenticated) {
      message.error("Bạn cần đăng nhập để đặt hàng");
      return navigate("/login");
    }
    if (!orderId || cartItems.length === 0) {
      return message.error("Giỏ hàng trống hoặc không hợp lệ");
    }

    const hide = message.loading("Đang xử lý đơn hàng...");
    try {
      // 1) Tạo shipping + payment
      const [shipRes, payRes] = await Promise.all([
        createShippingAPI({
          contact: values.contact,
          country: values.country,
          first_name: values.first_name,
          last_name: values.last_name,
          address: values.address,
          phone: values.phone,
          unit: values.unit,
        }),
        createPaymentAPI({
          method: values.method,
        }),
      ]);

      if (!shipRes?.data?._id || !payRes?.data?._id) {
        throw new Error("Tạo vận chuyển/thanh toán không thành công");
      }

      // 2) Gắn vào order
      await Promise.all([
        createOrderAPI("ADD-SHIPPING", {
          OrderID: orderId,
          shippingID: shipRes.data._id,
        }),
        createOrderAPI("ADD-PAYMENT", {
          OrderID: orderId,
          paymentID: payRes.data._id,
        }),
      ]);

      // 3) Cập nhật tồn kho
      await Promise.all(
        cartItems.map((item) => {
          const current = item.productInfo.stock_quantity ?? 0;
          const newQty = Math.max(0, current - item.quantity);
          return updateProductAPI({
            id: item.productInfo._id,
            stock_quantity: newQty,
          });
        })
      );

      // 4) Cập nhật trạng thái đơn
      const isOnline = values.method === "momo" || values.method === "vnpay";
      await updateOrderAPI({
        id: orderId,
        status: "processing",
      });

      // 5) Thanh toán online
      if (isOnline) {
        const data = {
          amount: cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          orderInfo: payRes.data._id,
        };
        const paySession = await createPaymentOnline(data);
        if (paySession?.status === true && paySession?.payUrl) {
          await updatePaymentAPI(payRes.data._id);
          await refetchCart();
          window.location.href = paySession.payUrl;
          return;
        } else {
          throw new Error("Tạo phiên thanh toán thất bại");
        }
      }

      // 6) COD
      await refetchCart();
      message.success("Đặt hàng thành công!");
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      message.error(err?.message || "Có lỗi khi xử lý đơn hàng");
    } finally {
      hide();
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="grid grid-cols-2 max-md:grid-cols-1">
      {/* LEFT */}
      <div className="bg-[#fff] min-h-screen grid grid-cols-3 p-5 max-sm:pl-5 max-xl:pl-10 max-md:order-2">
        <div className="col-span-1 max-xl:hidden"></div>
        <div className="col-span-2 max-xl:col-span-3">
          <Form form={form} onFinish={onFinish} className="flex flex-col gap-4">
            {/* Contact */}
            <div className="flex flex-col gap-4">
              <label className="font-bold text-xl">Contact</label>
              <Form.Item
                name="contact"
                rules={[{ required: true, message: " " }]}
              >
                <Input placeholder="Email" size="large" />
              </Form.Item>
            </div>

            {/* Delivery */}
            <div className="flex flex-col gap-4">
              <label className="font-bold text-xl">Delivery</label>
              <div>
                <Form.Item
                  name="country"
                  rules={[{ required: true, message: " " }]}
                >
                  <Select
                    options={[
                      { value: "Vietnam", label: "Vietnam" },
                      { value: "China", label: "China" },
                      { value: "Singapore", label: "Singapore" },
                      { value: "Korea", label: "Korea" },
                      { value: "America", label: "America" },
                      { value: "Japan", label: "Japan" },
                      { value: "Canada", label: "Canada" },
                    ]}
                    size="large"
                    placeholder="Country/Region"
                  />
                </Form.Item>
                <div className="flex gap-4 w-full">
                  <Form.Item
                    className="flex-1"
                    name="first_name"
                    rules={[{ required: true, message: " " }]}
                  >
                    <Input size="large" placeholder="First name" />
                  </Form.Item>
                  <Form.Item
                    className="flex-1"
                    name="last_name"
                    rules={[{ required: true, message: " " }]}
                  >
                    <Input size="large" placeholder="Last name" />
                  </Form.Item>
                </div>
                <Form.Item
                  name="address"
                  rules={[{ required: true, message: " " }]}
                >
                  <Input size="large" placeholder="Address" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: " " }]}
                >
                  <Input size="large" placeholder="Phone" />
                </Form.Item>
              </div>
            </div>

            {/* Shipping */}
            <div className="flex flex-col gap-4">
              <label className="font-bold">Shipping method</label>
              <Form.Item
                name="unit"
                className="w-full"
                rules={[{ required: true, message: "Require" }]}
              >
                <Radio.Group
                  onChange={(e) => setSelectedShipping(e.target.value)}
                  value={selectedShipping}
                  className="w-full"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Radio value="j&t" className="w-full rounded-2xl p-4">
                    J&T Express
                  </Radio>
                  <Radio value="GHN" className="w-full rounded-2xl p-4">
                    GHN
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            {/* Payment */}
            <div className="flex flex-col gap-4">
              <label className="text-xl font-bold">Payment</label>
              <Form.Item
                name="method"
                rules={[{ required: true, message: "Require" }]}
              >
                <Radio.Group
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  value={selectedPayment}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                  }}
                >
                  <Radio value="momo" className="rounded p-2">
                    <span className="font-bold">Momo</span>
                  </Radio>
                  <Radio value="vnpay" className="rounded p-2">
                    <span className="font-bold">VNPay</span>
                  </Radio>
                  <Radio value="cash" className="rounded p-2">
                    <span className="font-bold">Cash</span>
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <button
                  type="submit"
                  className="bg-[#000] w-full text-center text-white p-4 font-bold rounded cursor-pointer"
                >
                  Pay now
                </button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-[#EFEFEF] md:min-h-screen grid grid-cols-4 text-[#000]">
        <div className="p-10 flex flex-col gap-5 col-span-3 max-xl:col-span-4">
          {cartItems?.map((item, index) => (
            <div
              key={item._id || index}
              className="flex justify-between text-sm"
            >
              <div className="relative">
                <img
                  className="rounded border-1"
                  width={90}
                  src={item.productInfo.images[0]}
                  alt=""
                />
                <span className="text-center absolute top-[-5px] right-[-5px] w-5 h-5 rounded-full bg-[#707070] text-white">
                  {item.quantity}
                </span>
              </div>
              <div className="flex flex-col gap-2 w-full ml-12">
                <span>{item.productInfo?.name}</span>
                <span>{item.size}</span>
              </div>
              <span>{(item.price * item.quantity).toLocaleString()}đ</span>
            </div>
          ))}

          <div className="flex gap-4">
            <Input size="large" placeholder="Discount code" />
            <button className="cursor-pointer p-4 bg-[#EAEAEA] border-1 border-[#DFDFDF] rounded-xl text-[#777777]">
              Apply
            </button>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-xl font-bold">
                {subtotal.toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold">100.000đ</span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">
              {(subtotal + 100000).toLocaleString()}đ
            </span>
          </div>
        </div>
        <div className="col-span-1 max-xl:hidden"></div>
      </div>
    </div>
  );
};

export default CheckOutPage;
