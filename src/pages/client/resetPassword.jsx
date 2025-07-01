import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    useEffect(() => {
        if (!email) {
            navigate("/forgotPassword", { replace: true });
        }
    }, [email, navigate]);

    if (!email) return null;

    return <div>OK, reset password cho: {email}</div>;
};

export default ResetPasswordPage;
