import { Form, Input, Modal, InputNumber, Select, Button, message } from "antd"
import { useEffect, useState } from "react";
import { getOrderAPI, updateOrderAPI } from "../../../services/api.order";
const UpdateOrder = ({ openUpdate, setOpenUpdate, id }) => {
    const [form] = Form.useForm();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const blurTarget = document.getElementById('main-blur-area');
        if (openUpdate) {
            blurTarget?.classList.add('app-blurred');
        } else {
            blurTarget?.classList.remove('app-blurred');
        }
        const handleGetOrder = async () => {
            const res = await getOrderAPI(id);
            console.log(res.data);
            if (res && res.EC === 0) {
                const orderData = res.data[0];
                setOrder(orderData);
                form.setFieldsValue({
                    status: orderData.status,
                    address: orderData.shipping?.address,
                    description: orderData.description,
                });
            }
        }
        handleGetOrder();
        return () => {
            blurTarget?.classList.remove('app-blurred');
        };
    }, [openUpdate, id, form]);
    const handleCancel = () => {
        setOpenUpdate(false);
    }
    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpenUpdate(false);
        }, 3000);
    };
    const onFinish = async (values) => {
        try {
            console.log("Form values:", values);
            const payload = {
                id: order._id,
                shipping: {
                    address: values.address,
                    phone: values.phone,
                },
                status: values.status
            }
            const res = await updateOrderAPI(payload);
            if (res && res.EC === 0) {
                message.success("Update order successfully!");
            }
        } catch (error) {
            console.log(error);
            message.error("Update order failed");
        }
        handleCancel()
    }
    return (
        <div>
            <Modal
                getContainer={() => document.body}
                open={openUpdate}
                title="Update Order"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label={<span className="font-bold">UserID</span>}
                    >
                        <Input disabled placeholder={id}></Input>
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-bold">OrderID</span>}
                    >
                        <Input disabled placeholder={order?._id} ></Input>
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                    >
                        <Select
                            placeholder='Status'
                            options={
                                [
                                    {
                                        label: "None",
                                        value: "none"
                                    },
                                    {
                                        label: "Processing",
                                        value: "processing"
                                    },
                                    {
                                        label: "Delivering",
                                        value: 'delivering',
                                    },
                                    {
                                        label: "Delivered",
                                        value: 'delivered'
                                    },
                                    {
                                        label: "Canceled",
                                        value: 'canceled'
                                    }
                                ]
                            }
                        >
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                    >
                        <Input placeholder="Address"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                    >
                        <Input placeholder="Phone"></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default UpdateOrder;