import { FcOk } from "react-icons/fc";
import binglogo from "../../assets/img/png/binglogo.jpg"
import { useNavigate } from "react-router-dom";
const OrderSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className=" min-h-screen ">
            <div className="mt-20 w-full flex justify-center">
                <div className="bg-[#E8E4DA] w-[50%] max-sm:w-[80%] rounded-xl py-10 flex flex-col items-center gap-5">
                    <div>
                        <FcOk className="text-8xl m-auto" />
                        <h1 className="text-2xl font-bold text-[#000]">Order Successfully</h1>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-[#747474]">We'll send you a confirmation email</p>
                        <p className="text-[#747474]">Thank you for using our service</p>
                    </div>
                    <div>
                        <button onClick={() => navigate('/')} className="bg-[#000] text-[#fff] p-3 rounded cursor-pointer font-bold">Continue shopping</button>
                    </div>
                    <div>
                        <img width={50} src={binglogo} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OrderSuccess;
