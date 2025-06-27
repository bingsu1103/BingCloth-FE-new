import { Form, Input, Modal, message, Select, Button } from "antd";
import { useEffect, useState } from "react";
import { createUserAPI } from "../../../services/api.user";
const AddUser = ({ open, setOpen }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const blurTarget = document.getElementById('main-blur-area');
        if (open) {
            blurTarget?.classList.add('app-blurred');
        } else {
            blurTarget?.classList.remove('app-blurred');
        }
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
    const onFinish = async (values) => {
        const res = await createUserAPI(values);
        if (res && res.data) {
            message.success("Add user successfully!");
            handleCancel();
            return;
        }
        message.error("Add user failed!");
        handleCancel();
    }
    return (
        <div>
            <Modal
                getContainer={() => document.body}
                open={open}
                title="Add User"
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
                        rules={[{ required: true, message: 'Please input name!' }]}>
                        <Input placeholder="Name"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input email!' }]}>
                        <Input placeholder="Email"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input password!' }]}>
                        <Input.Password placeholder="Password"></Input.Password>
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input address!' }]}>
                        <Input placeholder='Address'></Input>
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input phone!' }]}>
                        <Input placeholder="Phone"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please input role!' }]}>
                        <Select
                            placeholder='Role'
                            options={
                                [
                                    {
                                        label: "ADMIN",
                                        value: "admin"
                                    },
                                    {
                                        label: "USER",
                                        value: "user",
                                    },
                                ]
                            }>
                        </Select>
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
export default AddUser;