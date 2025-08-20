import { Drawer, InputNumber, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createOrderAPI, getOrderAPI } from "../../services/api.order";
import { useCurrentApp } from "../context/app.context";
import { deleteItemAPI, updateItemAPI } from "../../services/api.item";
import { FaTrashCan } from "react-icons/fa6";

const CartDrawer = ({ open, setOpen }) => {
  const { user, isAuthenticated, refetchCart } = useCurrentApp();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (open && isAuthenticated && user && user._id) {
          const res = await getOrderAPI(user._id);
          if (res?.EC === 0 && Array.isArray(res.data)) {
            setCartItems(
              res.data.find((order) => order.status === "none").items
            );
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchOrder();
  }, [open, isAuthenticated, user]);

  const handleQuantityChange = (value, _id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === _id ? { ...item, quantity: value } : item
      )
    );
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        await updateItemAPI({ id: item._id, quantity: item.quantity });
        const res = await getOrderAPI(user._id);
        await createOrderAPI("UPDATE-TOTAL", { OrderID: res?.data[0]._id });
        refetchCart();
      }
      message.success("Cart updated. Proceeding to checkout.");
      navigate("/checkout");
      setOpen(false);
    } catch (error) {
      console.error("Error updating cart before checkout:", error);
      message.error("Failed to update cart.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleDeleteItem = async (id) => {
    try {
      const order = await getOrderAPI(user._id);
      const currentOrder = order?.data?.[0];
      if (!currentOrder?._id) {
        return message.error("Order not found.");
      }

      const updatedOrder = await createOrderAPI("REMOVE-ITEM", {
        OrderID: currentOrder._id,
        arrItem: [id],
      });

      if (!updatedOrder || updatedOrder.EC !== 0) {
        return message.error("Failed to remove item from order.");
      }

      const res = await deleteItemAPI(id);

      if (!res || res.EC !== 0) {
        return message.warning(
          "Removed from order, but failed to delete item."
        );
      }
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      refetchCart();
      message.success("Item removed successfully!");
    } catch (error) {
      console.error("Remove item failed:", error);
      message.error("Remove item failed.");
    }
  };

  return (
    <Drawer
      size="large"
      getContainer={() => document.body}
      title="Cart"
      closable
      onClose={onClose}
      open={open}
      forceRender
    >
      <div className="flex flex-col gap-4">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            Your cart is empty.
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-4 text-sm items-center justify-center"
              >
                <div className="flex justify-center items-center gap-5">
                  <div
                    className="bin"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    <FaTrashCan className="text-2xl" />
                  </div>
                  <div className="relative">
                    <img
                      className="rounded border-1 float-end"
                      width={90}
                      src={item.productInfo?.images?.[0]}
                      alt={item.productInfo?.name}
                    />
                    <span className="text-center absolute top-[-5px] right-[-5px] w-5 h-5 rounded-full bg-[#707070] text-white text-xs flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col text-xs gap-2 max-w-[40%]">
                  <span className="w-max">{item.productInfo?.name}</span>
                  <span>Size {item.size}</span>
                  <div
                    style={{ backgroundColor: item.color }}
                    className={`w-4 h-4 rounded border-2`}
                  ></div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-md">x</span>
                  <InputNumber
                    size="small"
                    min={1}
                    max={1000}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(value, item._id)}
                  />
                </div>
                <span>{(item.price * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}

            <div className="flex gap-4 justify-end font-bold mt-4 text-base">
              <span>Total</span>
              <span>{total.toLocaleString()}đ</span>
            </div>

            <div className="mt-10">
              <button
                onClick={handleCheckout}
                className="w-[50%] font-bold cursor-pointer bg-[#000] text-[#fff] px-4 py-3 mt-2"
              >
                Check out
              </button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
