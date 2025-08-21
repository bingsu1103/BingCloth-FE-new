import { FcOk } from "react-icons/fc";
import binglogo from "../../assets/img/png/binglogo.jpg";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <FcOk className="text-6xl" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Order Placed Successfully 🎉
        </h1>

        {/* Subtitle */}
        <div className="text-center space-y-1">
          <p className="text-gray-600">We’ve sent you a confirmation email.</p>
          <p className="text-gray-600">Thank you for shopping with us!</p>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-black text-white py-3 rounded-full font-semibold text-lg hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>

        {/* Logo */}
        <div className="pt-4 opacity-60">
          <img width={45} src={binglogo} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
