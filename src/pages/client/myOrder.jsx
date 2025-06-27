import { useEffect, useState } from "react";
import { UseCurrentApp } from "../../components/context/app.context";
import { getOrderAPI } from "../../services/api.order";
const MyOrderPage = () => {
    const { user } = UseCurrentApp();
    const [listOrder, setListOrder] = useState([]);
    useEffect(() => {
        const fetchOrder = async () => {
            if (user._id) {
                const res = await getOrderAPI(user._id);
                if (res && res.EC === 0) {
                    setListOrder(res?.data);
                }
            }
        }
        fetchOrder();
    }, [user]);
    return (
        <div className="flex justify-center min-h-screen">
            <div className="w-[80%] flex flex-col gap-4">
                <h1 className="text-center font-bold text-2xl p-4">ORDER HISTORY</h1>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>OrderID</th>
                                <th>List Product</th>
                                <th>Order Date</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listOrder?.filter(item => item.status !== 'none')?.map((item, index) => {
                                return (
                                    <tr key={item._id}>
                                        <th>{index + 1}</th>
                                        <td>{item._id}</td>
                                        <td>
                                            <div>
                                                {item?.items.map((it, idx) => (
                                                    <div className="grid grid-cols-2 items-center gap-5 p-1">
                                                        <span key={idx}>{it.productInfo.name} x {it.quantity}</span>
                                                        <div style={{
                                                            backgroundColor: it.color,
                                                        }} className="w-4 h-4 border-2"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                                        <td>{item.total_amount.toLocaleString()} VNĐ</td>
                                        <td>{item.status}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}
export default MyOrderPage;