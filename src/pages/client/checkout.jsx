import { Form, Input, Select, Radio, message } from "antd";
import { useNavigate } from "react-router";
import { UseCurrentApp } from "../../components/context/app.context";
import { useState, useEffect } from "react";
import { createShippingAPI } from "../../services/api.shipping";
import { createPaymentAPI } from "../../services/api.payment";
import { createOrderAPI, getOrderAPI, updateOrderAPI } from "../../services/api.order";
import { updateProductAPI } from "../../services/api.product";
import { createPaymentOnline } from "../../services/momo.service";

const CheckOutPage = () => {
    const { isAuthenticated, user, cartUpdated } = UseCurrentApp();
    const [selectedShipping, setSelectedShipping] = useState();
    const [selectedPayment, setSelectedPayment] = useState();
    const [form] = Form.useForm();
    const { refetchCart } = UseCurrentApp();
    const [orderCart, setOrderCart] = useState(null);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        if (isAuthenticated) {
            const order = await getOrderAPI(user._id);
            const shipRes = await createShippingAPI(values);
            const payRes = await createPaymentAPI(values);
            if (shipRes && payRes) {
                await createOrderAPI("ADD-SHIPPING", { OrderID: order.data.find(order => order.status === 'none')._id, shippingID: shipRes.data._id })
                await createOrderAPI("ADD-PAYMENT", { OrderID: order.data.find(order => order.status === 'none')._id, paymentID: payRes.data._id });
                const completeOrder = await getOrderAPI(user._id);
                if (completeOrder && completeOrder.data) {
                    message.success("Ordered successfully!");
                    const targetOrder = completeOrder.data.find(order => order.status === 'none');
                    if (targetOrder) {
                        await updateOrderAPI({ id: targetOrder._id, status: "processing" });
                        for (const item of targetOrder.items) {
                            const currentQuantity = item.productInfo.stock_quantity;
                            const newQuantity = currentQuantity - item.quantity;
                            await updateProductAPI({
                                id: item.productInfo._id,
                                stock_quantity: newQuantity < 0 ? 0 : newQuantity
                            });
                        }
                    }

                    if (targetOrder?.payment?.method === "momo" || targetOrder?.payment?.method === 'vnpay') {
                        const data = { amount: targetOrder.total_amount, orderInfo: targetOrder.payment._id }
                        const res = await createPaymentOnline(data);
                        console.log(res);

                        if (res.status === true) {
                            window.location.href = `${res.payUrl}`;
                        }
                    }
                    else {
                        navigate('/order-success');
                    }
                    await refetchCart();
                }
            }
            else{
                message.error("You need to fill all the field");
            }
        }
        else {
            message.error("You need to login to order")
        }
    }
    useEffect(() => {
        if (user && user._id) {
            const fetchOrder = async () => {
                try {
                    const res = await getOrderAPI(user._id);
                    if (res && res.EC === 0) {
                        setOrderCart(res.data.find(order => order.status === 'none'));
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            fetchOrder();
        }
    }, [user, cartUpdated]);
    return (
        <div className="grid grid-cols-2 max-md:grid-cols-1">
            <div className="bg-[#fff] min-h-screen grid grid-cols-3 p-5 max-sm:pl-5 max-xl:pl-10 max-md:order-2">
                <div className="col-span-1 max-xl:hidden"></div>
                <div className="col-span-2 max-xl:col-span-3">
                    <Form
                        form={form}
                        onFinish={onFinish}
                        className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <label className="font-bold text-xl">Contact</label>
                            <Form.Item name="contact" rules={[{ required: true, message: " " }]}>
                                <Input placeholder="Email" size="large" ></Input>
                            </Form.Item>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="font-bold text-xl">Delivery</label>
                            <div>
                                <Form.Item name="country" rules={[{ required: true, message: " " }]}>
                                    <Select
                                        options={[
                                            {
                                                value: 'Vietnam',
                                                label: 'Vietnam',
                                            },
                                            {
                                                value: 'China',
                                                label: 'China',
                                            },
                                            {
                                                value: 'Singapore',
                                                label: 'Singapore',
                                            },
                                            {
                                                value: 'Korea',
                                                label: 'Korea'
                                            },
                                            {
                                                value: 'America',
                                                label: 'America'
                                            },
                                            {
                                                value: 'Japan',
                                                label: 'Japan'
                                            },
                                            {
                                                value: 'Canada',
                                                label: 'Canada'
                                            }
                                        ]}
                                        size="large" placeholder='Country/Region' ></Select>
                                </Form.Item>
                                <div className="flex gap-4 w-full">
                                    <Form.Item className="flex-1" name="first_name" rules={[{ required: true, message: " " }]}>
                                        <Input className="font-bold" size="large" placeholder="First name" ></Input>
                                    </Form.Item>
                                    <Form.Item className="flex-1" name="last_name" rules={[{ required: true, message: " " }]}>
                                        <Input className="font-bold" size="large" placeholder="Last name" ></Input>
                                    </Form.Item>
                                </div>
                                <Form.Item name="address" rules={[{ required: true, message: " " }]}>
                                    <Input size="large" placeholder="Address" ></Input>
                                </Form.Item>
                                <Form.Item name="phone" rules={[{ required: true, message: " " }]}>
                                    <Input size="large" placeholder="Phone" ></Input>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="font-bold">Shipping method</label>
                            <Form.Item name="unit" className="w-full" rules={[{ required: true, message: "Require" }]}>
                                <Radio.Group
                                    onChange={(e) => setSelectedShipping(e.target.value)}
                                    value={selectedShipping}
                                    className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Radio value="j&t" className={`w-full rounded-2xl ${selectedShipping === "j&t"
                                        ? "bg-[#F6F6F6] border-1"
                                        : "bg-[#fff] border-1"
                                        }`} style={{ padding: '15px' }}>
                                        <div className="w-full flex justify-between items-center p-2">
                                            <span>J&T Express</span>
                                        </div>
                                    </Radio>
                                    <Radio value="GHN" className={`w-full rounded-2xl ${selectedShipping === "GHN"
                                        ? "bg-[#F6F6F6] border-1"
                                        : "bg-[#fff] border-1"
                                        }`} style={{ padding: '15px' }}>
                                        <div className="w-full flex justify-between items-center p-2">
                                            <span>GHN</span>
                                        </div>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="" className="text-xl font-bold">Payment</label>
                            <Form.Item name='method' rules={[{ required: true, message: "Require" }]}>
                                <Radio.Group
                                    onChange={(e) => setSelectedPayment(e.target.value)}
                                    value={selectedPayment}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                    }}
                                >
                                    <Radio value='momo' className={`rounded ${selectedPayment == 'momo' ? "bg-[#F6F6F6] border-1"
                                        : "bg-[#fff] border-1"}`} style={{ padding: '10px' }}>
                                        <span className="font-bold">Momo</span>
                                    </Radio>
                                    <Radio value='vnpay' className={`rounded ${selectedPayment == 'vnpay' ? "bg-[#F6F6F6] border-1"
                                        : "bg-[#fff] border-1"}`} style={{ padding: '10px' }}>
                                        <span className="font-bold">VNPay</span>
                                    </Radio>
                                    <Radio value='cash' className={`rounded ${selectedPayment == 'cash' ? "bg-[#F6F6F6] border-1"
                                        : "bg-[#fff] border-1"}`} style={{ padding: '10px' }}>
                                        <span className="font-bold">Cash</span>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                <button type='submit' className="bg-[#000] w-full text-center text-white p-4 font-bold rounded cursor-pointer">Pay now</button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
            <div className="bg-[#EFEFEF] md:min-h-screen grid grid-cols-4 text-[#000]">
                <div className="p-10 flex flex-col gap-5 col-span-3 max-xl:col-span-4">
                    {orderCart?.items?.map((item, index) => (
                        <div key={item._id || index} className="flex justify-between text-sm">
                            <div className="relative">
                                <img className="rounded border-1" width={90} src={item.productInfo.images[0]} alt="" />
                                <span className="text-center absolute top-[-5px] right-[-5px] w-5 h-5 rounded-full bg-[#707070] text-white">{item.quantity}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="float-start">{item.productInfo?.name}</span>
                                <span>{item.size}</span>
                            </div>
                            <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                    ))}
                    <div className="flex gap-4">
                        <Input size="large" placeholder="Discount code"></Input>
                        <button className="cursor-pointer p-4 bg-[#EAEAEA] border-1 border-[#DFDFDF] rounded-xl text-[#777777]" >Apply</button>
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-xl font-bold">
                                {(orderCart?.total_amount ? orderCart.total_amount : 0).toLocaleString()}đ
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-bold">100.000đ</span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xl font-bold">Total</span>
                        <span className="text-xl font-bold">{(orderCart?.total_amount ? orderCart.total_amount + 100000 : 0).toLocaleString()}đ</span>
                    </div>
                </div>
                <div className="col-span-1 max-xl:hidden"></div>
            </div>
        </div >
    )
}
export default CheckOutPage;