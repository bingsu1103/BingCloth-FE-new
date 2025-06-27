import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Modal, InputNumber, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getCategoryAPI } from "../../../services/api.category";
import { createProductAPI, uploadProductImageAPI } from "../../../services/api.product";
const { TextArea } = Input;

const AddProduct = ({ open, setOpen }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [dataCategory, setDataCategory] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };


    const fetchCategoryAPI = async () => {
        const res = await getCategoryAPI();
        if (res && res.EC === 0) {
            const listCategory = res.data;
            setDataCategory(listCategory);
        }
    }
    const handleCustomRequest = async ({ file, onSuccess, onError }) => {
        try {
            const res = await uploadProductImageAPI(file);
            console.log("Upload response:", res);
            const newFile = {
                uid: `${Date.now()}-${file.name}`,
                name: file.name,
                status: "done",
                url: res.data.url,
            };
            console.log("newFile", newFile);
            setFileList((prev) => [...prev, newFile]);
            onSuccess("ok");
            message.success("Upload image successfully!");
        } catch (error) {
            onError(error);
            message.error("Upload image failed!");
        }
    }
    useEffect(() => {
        const blurTarget = document.getElementById('main-blur-area');
        if (open) {
            blurTarget?.classList.add('app-blurred');
        } else {
            blurTarget?.classList.remove('app-blurred');
        }
        fetchCategoryAPI();
    }, [open]);

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const onFinish = async (values) => {
        const imgUrls = fileList.map((file) => file.url);
        const payload = {
            ...values,
            images: imgUrls,
            price: Number(values.price),
        };
        const res = await createProductAPI(payload);
        if (res && res.data) {
            message.success("Add product successfully!");
            handleCancel();
            return;
        }
        message.error("Add product failed!");
        handleCancel();
    }
    return (
        <div>
            <Modal
                getContainer={() => document.body}
                open={open}
                title="Add Product"
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
                        <Input placeholder="Name"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input product price!' }]}>
                        <Input placeholder="Price"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Quantity"
                        name="stock_quantity"
                        rules={[{ required: true, message: 'Please input product price!' }]}>
                        <InputNumber min={1} placeholder="Quantity"></InputNumber>
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="categoryInfo"
                        rules={[{ required: true, message: 'Please input product price!' }]}>
                        <Select
                            placeholder='Category'
                            options={
                                dataCategory.map(item => ({
                                    label: item.name,
                                    value: item._id
                                }))
                            }>
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
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            customRequest={handleCustomRequest}
                            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                        >
                            {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                        <Modal
                            open={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={() => setPreviewVisible(false)}
                        >
                            <img alt="preview" style={{ width: "100%" }} src={previewImage} />
                        </Modal>
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
export default AddProduct