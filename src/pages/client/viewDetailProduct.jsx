import { Form, InputNumber, Select, Button, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getAProductAPI } from "../../services/api.product";
import { createOrderAPI, getOrderAPI } from "../../services/api.order";
import { UseCurrentApp } from "../../components/context/app.context";
import { createItemAPI, updateItemAPI } from "../../services/api.item";
import { AiFillHeart } from 'react-icons/ai';
import { Rate, Carousel } from 'antd';
import SlickButtonFix from "../../components/client/slickButtonFix";

const colorOption = ["#0000FF", "#808080", "#000", "#FFF"];


const ViewDetailProductPage = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const { user, isAuthenticated } = UseCurrentApp();
    const { refetchCart } = UseCurrentApp();
    const [liked, setLiked] = useState(false);

    const [item, setItem] = useState({
        productInfo: id,
        quantity: 1,
        price: 0,
        size: "S",
        color: "#FFF",
    });

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
                message.error("You need to login first")
                return;
            }
            const res = await getOrderAPI(user._id);
            const orders = res?.data || [];
            let cart = orders.find(order => order.status === 'none');

            if (!cart) {
                await createOrderAPI("EMPTY-ORDER", {
                    userInfo: user._id,
                    total_amount: 0,
                });
                const newRes = await getOrderAPI(user._id);
                cart = newRes?.data?.find(order => order.status === 'none');
            }

            const orderID = cart?._id;
            const existingItem = cart?.items?.find(i =>
                (i.productInfo === item.productInfo || i.productInfo?._id === item.productInfo) &&
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

            refetchCart();
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

    return product ? (
        <div className="grid grid-cols-2 max-sm:grid-cols-1 min-h-screen">
            <div className="flex items-start bg-[#1D232A] justify-center p-12">
                {product.images.length > 1 ? (
                    <div className="relative w-full h-auto">
                        <Carousel
                            dots={false}
                            arrows
                            nextArrow={<SlickButtonFix type="next" />}
                            prevArrow={<SlickButtonFix type="prev" />}
                        >
                            {product.images.map((img, index) => (
                                <div key={index} className="flex justify-center items-center h-auto bg-white">
                                    <img
                                        src={img}
                                        alt={`Product ${index}`}
                                        className="object-contain"
                                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-auto bg-white">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="bg-white object-contain"
                            style={{ maxHeight: "100%", maxWidth: "100%" }}
                        />
                    </div>
                )}
            </div>
            <div className="pt-12 sticky top-0 bg-[#fff]">
                <div className="w-[70%] max-md:w-[80%] grid grid-cols-1 mx-auto gap-5">
                    <div className="flex items-center justify-between text-2xl">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-2xl font-bold text-[#000]">{product.name}</h1>
                            {product.stock_quantity > 0 ? (<span className="h-min text-xs text-[#fff] font-bold bg-[#38BF57] p-1 rounded max-w-fit">Available</span>)
                                : (<span className="h-min text-xs text-[#fff] font-bold bg-[#D0011C] p-1 rounded">Out of stock</span>)}
                            <Rate disabled defaultValue={4} />
                        </div>
                        <AiFillHeart className="hidden" onClick={() => setLiked(!liked)}
                            style={{

                                fontSize: '28px',
                                color: liked ? 'red' : 'black',
                                cursor: 'pointer',
                                transition: 'color 0.1s ease',
                            }} />
                    </div>
                    <span className="text-xl font-bold text-[#000]">
                        {product.price.toLocaleString()} VNĐ
                    </span>

                    <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
                        {/* Color */}
                        <Form.Item
                            label={<span className="font-bold text-sm">Color</span>}
                            name="color"
                            rules={[{ required: true, message: "Please select a color!" }]}
                        >
                            <div className="flex gap-2">
                                {colorOption.map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => handleColorClick(color)}
                                        style={{
                                            backgroundColor: color,
                                            border:
                                                item.color === color
                                                    ? "2px solid red"
                                                    : "2px solid transparent",
                                        }}
                                        className="w-6 h-6 rounded-full cursor-pointer transition duration-200"
                                    />
                                ))}
                            </div>
                        </Form.Item>

                        {/* Size */}
                        <Form.Item
                            label={<span className="font-bold text-sm">Size</span>}
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
                                style={{
                                    width: '50%'
                                }}
                            />
                        </Form.Item>

                        {/* Quantity */}
                        <Form.Item
                            label={<span className="font-bold text-sm">Quantity</span>}
                            name="quantity"
                            rules={[{ required: true, message: "Please input quantity!" }]}
                        >
                            <InputNumber
                                min={1}
                                max={product.stock_quantity}
                                value={item.quantity}
                                onChange={handleChange("quantity")}
                                className="w-[50%]"
                            />
                        </Form.Item>

                        {/* Total */}
                        <hr />
                        <div className="flex justify-between p-4">
                            <span className="text-xl font-bold">Total</span>
                            <span className="text-xl font-bold">
                                {(item.price * item.quantity || 0).toLocaleString()} VNĐ
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 max-md:pb-10">
                            <Button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                className="mt-4 flex-1"
                                style={{ backgroundColor: "#000", fontWeight: "bold" }}
                            >
                                Add to cart
                            </Button>
                            <Button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        message.error("You need to login first")
                                        return;
                                    }
                                    navigate('/checkout')
                                }
                                }
                                size="large"
                                type="primary"
                                htmlType="submit"
                                className="mt-4 flex-1"
                                style={{ backgroundColor: "#000", fontWeight: "bold" }}
                            >
                                Buy now
                            </Button>
                        </div>
                    </Form>
                </div>
            </div >
        </div >

    ) : (
        <div className="flex justify-center items-center h-screen">
            <Spin size="large" tip="Loading..." />
        </div>
    );
};

export default ViewDetailProductPage;
