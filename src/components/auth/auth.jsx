import { Link, useLocation } from "react-router-dom";
import { UseCurrentApp } from "../context/app.context"
import { Button, Result } from "antd";
const ProtectedRoute = (props) => {
    const { isAuthenticated, user } = UseCurrentApp();
    const location = useLocation();

    if (isAuthenticated === false) {
        return (
            <Result
                status={404}
                title="Not login"
                subTitle="Please login to use this service"
                extra={<Button type="primary"><Link to='/login'>Login</Link></Button>}
            >
            </Result>
        )
    }
    const isAdmin = location.pathname.includes("admin");
    if (isAuthenticated && isAdmin) {
        const role = user?.role;
        if (role === 'user') {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary"><Link to='/login'>Back home</Link></Button>}
                >
                </Result>
            )
        }
    }
    return (
        <>{props.children}</>
    )
}
export default ProtectedRoute;