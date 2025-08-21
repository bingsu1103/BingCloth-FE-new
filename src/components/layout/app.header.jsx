import { Link, useNavigate } from "react-router";
import {
  User,
  ShoppingCart,
  Menu as MenuIcon,
  LogOut,
  UserCog,
  Search,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import { message, Badge, Menu, Dropdown, Drawer } from "antd";
import CartDrawer from "../client/cartDrawer";
import { useCurrentApp } from "../context/app.context";
import { fetchAccountAPI, logoutAPI } from "../../services/api.user";
import { getCurrentOrderAPI } from "../../services/api.order";

const navLinks = [
  { key: "home", label: <Link to="/">Home</Link> },
  { key: "store", label: <Link to="/store">Store</Link> },
  { key: "about", label: <Link to="/about">About</Link> },
  { key: "service", label: <Link to="/service">Service</Link> },
];

const AppHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  const { setIsAuthenticated, isAuthenticated, user, setUser, cartUpdated } =
    useCurrentApp();
  const navigate = useNavigate();

  useEffect(() => {
    const blurTarget = document.getElementById("main-blur-area");
    if (!blurTarget) return;
    if (drawerOpen) blurTarget.classList.add("app-blurred");
    else blurTarget.classList.remove("app-blurred");
  }, [drawerOpen]);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (isAuthenticated && user && user._id) {
        try {
          const res = await getCurrentOrderAPI(user._id);
          if (res?.EC === 0) {
            const cartOrder = res.data;
            const totalQuantity = cartOrder?.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            setCartQuantity(totalQuantity || 0);
          } else {
            setCartQuantity(0);
          }
        } catch (err) {
          console.error("Error fetching cart quantity:", err);
          setCartQuantity(0);
        }
      } else {
        setCartQuantity(0);
      }
    };
    fetchCartQuantity();
  }, [isAuthenticated, user, cartUpdated]);

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.error === 0) {
      message.success("Log out successfully!");
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      navigate("/");
      await fetchAccountAPI();
    }
  };

  const accountMenu = (
    <Menu>
      {!isAuthenticated && (
        <>
          <Menu.Item key="signup">
            <Link to="/register">Sign up</Link>
          </Menu.Item>
          <Menu.Item key="signin">
            <Link to="/login">Sign in</Link>
          </Menu.Item>
        </>
      )}
      {isAuthenticated && (
        <>
          <Menu.Item key="account" icon={<User size={20} />}>
            <Link to="/info">Account</Link>
          </Menu.Item>
          {user?.role === "admin" && (
            <>
              <Menu.Item key="manage-user" icon={<UserCog size={20} />}>
                <Link to="/admin/manage-user">Manage User</Link>
              </Menu.Item>
              <Menu.Item key="manage-product" icon={<Search size={20} />}>
                <Link to="/admin/manage-product">Manage Product</Link>
              </Menu.Item>
              <Menu.Item key="manage-order" icon={<ClipboardList size={20} />}>
                <Link to="/admin/manage-order">Manage Order</Link>
              </Menu.Item>
            </>
          )}
          <Menu.Item key="my-order" icon={<ClipboardList size={20} />}>
            <Link to="/my-order">My order</Link>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogOut size={20} />}
            onClick={handleLogout}
          >
            Log out
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-gray-200 shadow-sm p-2">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-gray-900"
        >
          BingCloth
        </Link>

        {/* Desktop nav aligned left next to logo */}
        <div className="hidden sm:flex flex-1 ml-8">
          <Menu
            mode="horizontal"
            items={navLinks}
            className="border-0 bg-transparent"
          />
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-2 max-w-[200px]">
              <span
                className="font-medium text-gray-900 capitalize truncate"
                title={user?.name} // tooltip hiển thị đầy đủ khi hover
              >
                {user?.name}
              </span>
            </div>
          )}

          {/* Cart icon */}
          <Badge count={cartQuantity} overflowCount={99} size="small">
            <ShoppingCart
              size={20}
              onClick={() => setDrawerOpen(true)}
              className="text-2xl cursor-pointer text-gray-800 hover:text-blue-600"
            />
          </Badge>

          {/* Account dropdown */}
          <Dropdown
            overlay={accountMenu}
            placement="bottomRight"
            trigger={["click"]}
          >
            <User
              size={20}
              className="text-2xl cursor-pointer text-gray-800 hover:text-blue-600"
            />
          </Dropdown>

          {/* Mobile menu button */}
          <button
            className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
            aria-label="Open mobile menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon className="text-2xl text-black" />
          </button>
        </div>

        {/* Mobile menu drawer */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
        >
          <Menu
            mode="inline"
            items={navLinks}
            onClick={() => setMobileMenuOpen(false)}
          />
        </Drawer>

        {/* Cart drawer */}
        <CartDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      </div>
    </header>
  );
};

export default AppHeader;
