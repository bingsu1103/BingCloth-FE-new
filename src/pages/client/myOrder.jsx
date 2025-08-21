import { useEffect, useState } from "react";
import { useCurrentApp } from "../../components/context/app.context";
import { getOrderAPI, updateOrderAPI } from "../../services/api.order";
import { createPaymentAPI } from "../../services/api.payment";
import { createPaymentOnline } from "../../services/momo.service";

const MyOrderPage = () => {
  const { user } = useCurrentApp();
  const [listOrder, setListOrder] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (user._id) {
        const res = await getOrderAPI(user._id);
        if (res && res.EC === 0) {
          setListOrder(res?.data);
        }
      }
    };
    fetchOrder();
  }, [user]);

  const handlePayment = async (order) => {
    try {
      // 1. Lấy method từ payment cũ
      const method = order.payment?.method || "momo";

      // 2. Tạo payment mới (chỉ cần method)
      const newPaymentRes = await createPaymentAPI({ method });
      if (!newPaymentRes || newPaymentRes.EC !== 0) {
        throw new Error("Không tạo được payment mới");
      }
      const newPayment = newPaymentRes.data;

      // 3. Update order với payment mới
      const updateRes = await updateOrderAPI({
        id: order._id,
        payment: {
          _id: newPayment._id,
        },
      });
      if (!updateRes || updateRes.EC !== 0) {
        throw new Error("Không cập nhật được order với payment mới");
      }

      // 4. Gọi thanh toán online
      const data = {
        amount: order.total_amount,
        orderInfo: newPayment._id, // dùng paymentId mới
      };
      const paySession = await createPaymentOnline(data);

      if (paySession?.status === true && paySession?.payUrl) {
        window.location.href = paySession.payUrl;
      } else {
        throw new Error("Tạo phiên thanh toán thất bại");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Có lỗi khi xử lý thanh toán lại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-center font-bold text-3xl text-gray-800 mb-8">
          🛒 Order History
        </h1>

        {/* Table wrapper */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {listOrder
                  ?.filter((item) => item.status !== "none")
                  ?.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-gray-600">
                        {index + 1}
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3">
                        <span
                          className="font-mono text-blue-600 cursor-pointer"
                          title={item._id}
                        >
                          #{item._id.slice(0, 6)}...
                        </span>
                      </td>

                      {/* Products */}
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {item?.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-gray-700"
                            >
                              <span>
                                {it.productInfo.name} x {it.quantity}
                              </span>
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: it.color }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {item.total_amount.toLocaleString()} ₫
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.payment.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.payment.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        {item.payment.status === "paid" ? (
                          <button
                            disabled
                            className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-500 cursor-not-allowed"
                          >
                            SUCCESS
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePayment(item)}
                            className="cursor-pointer px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                          >
                            PAY NOW
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
