import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router';
import HomePage from './pages/client/home.jsx';
import Login from './pages/client/auth/login.jsx';
import { AppContextProvider } from './components/context/app.context.jsx';
import Register from './pages/client/auth/register.jsx';
import '@ant-design/v5-patch-for-react-19';
import CheckOutPage from './pages/client/checkout.jsx';
import StorePage from './pages/client/store.jsx';
import ProductManagePage from './pages/admin/productManage.jsx';
import UserManagePage from './pages/admin/userManage.jsx';
import ViewDetailProductPage from './pages/client/viewDetailProduct.jsx';
import OrderManagePage from './pages/admin/orderManage.jsx';
import CustomerServicePage from './pages/client/customerService.jsx';
import AboutPage from './pages/client/about.jsx';
import OrderSuccess from './pages/client/orderSuccess.jsx';
import MyOrderPage from './pages/client/myOrder.jsx';
import ProtectedRoute from './components/auth/auth.jsx';
import ForgotPasswordPage from './pages/client/forgotPassword.jsx';
import ResetPasswordPage from './pages/client/resetPassword.jsx';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        },
        {
          path: '/checkout',
          element: <CheckOutPage />
        },
        {
          path: '/store',
          element: <StorePage />
        },
        {
          path: '/view-detail-product/:id',
          element: <ViewDetailProductPage />
        },
        {
          path: '/service',
          element: <CustomerServicePage />
        },
        {
          path: '/about',
          element: <AboutPage />
        },
        {
          path: '/order-success',
          element: <OrderSuccess />
        },
        {
          path: '/my-order',
          element: <MyOrderPage />
        },
        {
          path: '/forgotPassword',
          element: <ForgotPasswordPage />
        },
        {
          path: '/reset-password',
          element: <ResetPasswordPage />
        },
        {
          path: '/admin/manage-product',
          element: (
            <ProtectedRoute>
              < ProductManagePage />
            </ProtectedRoute>
          )
        },
        {
          path: '/admin/manage-user',
          element: (
            <ProtectedRoute>
              <UserManagePage />
            </ProtectedRoute>
          )
        },
        {
          path: '/admin/manage-order',
          element: (
            <ProtectedRoute>
              <OrderManagePage />
            </ProtectedRoute>
          )
        },

      ]
    }
  ]
);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </StrictMode>,
)
