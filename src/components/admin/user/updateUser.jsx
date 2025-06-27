import { Form, Input, Modal, message, Select, Button } from "antd";
import { useEffect, useState } from "react";
import { getAUserAPI, updateUserAPI } from "../../../services/api.user";
const UpdateUser = ({ openUpdate, setOpenUpdate, id }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [dataUser, setDataUser] = useState(null);
    useEffect(() => {
        const blurTarget = document.getElementById('main-blur-area');
        if (openUpdate) {
            blurTarget?.classList.add('app-blurred');
        } else {
            blurTarget?.classList.remove('app-blurred');
        }
        const fetchUser = async () => {
            if (id) {
                const res = await getAUserAPI(id);
                if (res && res.EC === 0) {
                    setDataUser(res?.data);
                }
            }
        }
        fetchUser();
    }, [openUpdate, id]);
    useEffect(() => {
        form.setFieldsValue({
            name: dataUser?.name,
            email: dataUser?.email,
            address: dataUser?.address,
            role: dataUser?.role,
            phone: dataUser?.phone
        });
    }, [form, dataUser])
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
    const onFinish = async (values) => {
        const payload = {
            id: id,
            ...values
        }
        const res = await updateUserAPI(payload);
        if (res && res.data) {
            message.success("Update user successfully!");
            handleCancel();
            return;
        }
        message.error("Update user failed!");
        handleCancel();
    }
    return (
        <div>
            <Modal
                getContainer={() => document.body}
                open={openUpdate}
                title="Update User"
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
                    >
                        <Input placeholder="Name"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email">
                        <Input disabled placeholder="Email"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                    >
                        <Input placeholder='Address'></Input>
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                    >
                        <Input placeholder="Phone"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role">
                        <Select
                            disabled
                        >
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
export default UpdateUser;