import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordAPI } from "../../services/api.user";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const { email } = location.state || {};
    const [form] = Form.useForm();
    useEffect(() => {
        if (!email) {
            navigate("/forgotPassword", { replace: true });
        }
    }, [email, navigate]);
    const onFinish = async (values) => {
        setLoading(true);
        const { newPassword, email } = values;
        const password = newPassword;
        const res = await resetPasswordAPI(email, password);
        if (res) {
            if (res.status === true) {
                message.success("Change password successfully!");
                navigate("/login");
            }
            else {
                message.error(res.message);
            }
        }
        setLoading(false);
    }

    if (!email) return null;

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-3 max-sm:grid-cols-1 max-xl:block max-xl:w-[60%] max-xl:m-auto max-sm:w-full p-8">
                <div className="max-lg:hidden"></div>
                <div className="flex flex-col items-center border-2 rounded p-4 bg-[#fff]">
                    <label className="font-bold text-2xl pt-8 text-[#000]">Reset Password</label>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600, width: "100%", paddingTop: "50px" }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off">

                        <Form.Item
                            label={<span className="font-bold">Email</span>}
                            name="email"
                            initialValue={email}
                        >
                            <Input style={{ backgroundColor: '#ccc' }} disabled></Input>
                        </Form.Item>
                        <Form.Item
                            name='newPassword'
                            label={<span className="font-bold">New password</span>}
                            required={true}
                        >
                            <Input.Password placeholder="Password"></Input.Password>
                        </Form.Item>
                        <Form.Item
                            name="confirmPass"
                            label={<span className="font-bold">Confirm</span>}
                            dependencies={['newPassword']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm" />
                        </Form.Item>
                        <div className="flex justify-center">
                            <Button htmlType="submit" loading={loading} type='primary'>Send</Button>
                        </div>
                    </Form>
                </div>
                <div className="max-lg:hidden"></div>
            </div>
        </div >
    );
};

export default ResetPasswordPage;
