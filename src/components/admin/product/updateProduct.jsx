import { Form, Input, Modal, InputNumber, Select, Button, message } from "antd"
import { useEffect, useState } from "react";
import { getCategoryAPI } from "../../../services/api.category";
import { getAProductAPI, updateProductAPI } from "../../../services/api.product";
const { TextArea } = Input;

const UpdateProduct = ({ openUpdate, setOpenUpdate, id }) => {
    const [form] = Form.useForm();
    const [dataCategory, setDataCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null)
    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpenUpdate(false);
        }, 3000);
    };
    const handleCancel = () => {
        setOpenUpdate(false);
    };
    const fetchCategoryAPI = async () => {
        const res = await getCategoryAPI();
        if (res && res.EC === 0) {
            const listCategory = res.data;
            setDataCategory(listCategory);
        }
    }
    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                price: Number(values.price),
                id: id,
            };
            const res = await updateProductAPI(payload);

            if (res && res.EC === 0) {
                message.success("Update product successfully!");
            }
        } catch (error) {
            console.log(error);
            message.error("Update product failed");
        }
        finally {
            handleCancel();
        }
    }

    useEffect(() => {
        const blurTarget = document.getElementById('main-blur-area');
        if (openUpdate) {
            blurTarget?.classList.add('app-blurred');
        } else {
            blurTarget?.classList.remove('app-blurred');
        }
        fetchCategoryAPI();
        const handleGetProduct = async () => {
            if (id) {
                const res = await getAProductAPI(id);
                if (res && res.EC === 0) {
                    setProduct(res?.data);
                }
            }
        }
        handleGetProduct();
    }, [openUpdate, id]);
    useEffect(() => {
        if (product && openUpdate) {
            form.setFieldsValue({
                name: product.name,
                price: product.price,
                stock_quantity: product.stock_quantity,
                categoryInfo: product.categoryInfo?._id,
                status: product.status,
                description: product.description,
            });
        }
    }, [product, openUpdate, form]);
    return (
        <div>
            <Modal
                getContainer={() => document.body}
                open={openUpdate}
                title="Update Product"
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
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input product name!' }]}>
                        <Input placeholder="Name" ></Input>
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input product price!' }]}>
                        <Input placeholder="Price" ></Input>
                    </Form.Item>
                    <Form.Item
                        label="Quantity"
                        name="stock_quantity"
                        rules={[{ required: true, message: 'Please input product stock quantity!' }]}>
                        <InputNumber min={1} placeholder="Quantity" ></InputNumber>
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="categoryInfo"
                        rules={[{ required: true, message: 'Please input product category!' }]}>
                        <Select
                            placeholder='Category'
                            options={
                                dataCategory.map(item => ({
                                    label: item.name,
                                    value: item._id
                                }))
                            }
                        >
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please input product status!' }]}>
                        <Select
                            placeholder='Status'
                            options={
                                [
                                    {
                                        label: "SALE",
                                        value: "SALE"
                                    },
                                    {
                                        label: "NEW",
                                        value: "NEW",
                                    },
                                    {
                                        label: "DEFAULT",
                                        value: "DEFAULT"
                                    }
                                ]
                            }>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input product description!' }]}>
                        <TextArea rows={4} placeholder="Description" />
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
export default UpdateProduct;