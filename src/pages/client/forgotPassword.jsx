import { Form, Input, Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { forgotPasswordAPI, verifyOTPAPI } from "../../services/api.user";

const ForgotPasswordPage = () => {
    const [form] = Form.useForm();
    const [sending, setIsSending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [email, setEmail] = useState("");
    const inputRef = useRef();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { email } = values;
        if (!email) return;

        try {
            setCountdown(60);
            const res = await forgotPasswordAPI(email);
            if (res.status === true) {
                message.success(res.message);
                setEmail(email);
                setIsSending(true);
            } else {
                message.error(res.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error(error);
            message.error("Lỗi gửi OTP");
        }
    };

    const handleFinishOTP = async (otp) => {
        if (otp.length < 6) return;
        let otpStr = "";
        for (let i = 0; i < otp.length; i++) {
            otpStr += otp[i];
        }

        if (!otpStr || !email) {
            message.error("Missing OTP or email");
            return;
        }
        const res = await verifyOTPAPI(email, otpStr);
        if (res) {
            if (res.status === true) {
                navigate("/reset-password", { state: { email: email } })
            }
            else {
                message.error(res.message);
            }
        }
    }

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div className="min-h-screen bg-[#1D232A]">
            <div className="grid grid-cols-3 max-sm:grid-cols-1 max-xl:block max-xl:w-[60%] max-xl:m-auto max-sm:w-full p-8">
                <div className="max-lg:hidden"></div>
                <div className="flex flex-col items-center border-2 rounded p-4 bg-[#fff]">
                    <label className="font-bold text-2xl pt-8 text-[#000]">Forgot Password</label>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600, width: "100%", paddingTop: "50px" }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <div className="mb-1.5">
                            <p className="font-bold italic">
                                Please input your email to send request reset password
                            </p>
                        </div>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: "Please input your email!" }]}
                        >
                            <Input ref={inputRef} placeholder="example@gmail.com" />
                        </Form.Item>
                        <div className="pb-5 flex flex-col gap-4">
                            <Button
                                disabled={countdown > 0}
                                type="primary"
                                htmlType="submit"
                                className="w-[30%]"
                            >
                                {countdown > 0 ? `Resend in ${countdown}s` : "Send"}
                            </Button>

                            {sending && (
                                <div>
                                    <h2 className="font-bold pb-3">Verify OTP</h2>
                                    <Input.OTP length={6} onInput={handleFinishOTP} />
                                </div>
                            )}
                        </div>
                    </Form>
                </div>
                <div className="max-lg:hidden"></div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
