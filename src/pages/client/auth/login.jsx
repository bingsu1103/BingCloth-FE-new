import { Link, useNavigate } from 'react-router';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { fetchAccountAPI, loginAPI } from '../../../services/api.user';
import { UseCurrentApp } from '../../../components/context/app.context';
const Login = () => {
    const navigate = useNavigate();
    const form = Form.useForm()[0];
    const { setIsAuthenticated, setUser } = UseCurrentApp();
    const onFinish = async (values) => {
        const { email, password } = values;
        const res = await loginAPI(email, password);
        if (res?.data) {
            setIsAuthenticated(true);
            setUser(res.data);
            localStorage.setItem('accessToken', res.accessToken);
            navigate("/");
            await fetchAccountAPI();
            message.success("Login successfully!");
        }
        else {
            message.error("Invalid email or wrong password");
            form.resetFields()
        }
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
        form.resetFields();
    };
    return (
        <div className='min-h-screen bg-[#1D232A]'>
            <div className='grid grid-cols-3 max-sm:grid-cols-1 max-xl:block max-xl:w-[60%] max-xl:m-auto max-sm:w-full p-8'>
                <div className='max-lg:hidden'></div>
                <div className='flex flex-col items-center border-2 rounded p-4 bg-[#fff]'>
                    <label className='font-bold text-2xl pt-8 text-[#000]'>Login</label>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600, width: '100%', paddingTop: '50px' }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={<span className='font-bold'>Email</span>}
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={<span className='font-bold'>Password</span>}
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <div className='flex justify-center'>
                            <Button className='' type="primary" htmlType="submit">
                                <span>Submit</span>
                            </Button>
                        </div>

                        <div className='flex justify-center gap-2 p-4'>
                            <span>Don't have an account?</span>
                            <Link className="underline cursor-pointer" to='/register'>Sign up here</Link>
                        </div>
                    </Form>
                </div>
                <div className='max-lg:hidden'></div>
            </div>
        </div>
    )
}
export default Login;