import { Link, useNavigate } from "react-router";
import { FiUser } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { useCurrentApp } from "../context/app.context";
import { fetchAccountAPI, logoutAPI } from "../../services/api.user";
import { message } from "antd";
import { useEffect, useState } from "react";
import CartDrawer from "../client/cartDrawer";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import { MdOutlineManageSearch } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { MdManageHistory } from "react-icons/md";

const AppHeader = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const blurTarget = document.getElementById("main-blur-area");
    if (open) {
      blurTarget?.classList.add("app-blurred");
    } else {
      blurTarget?.classList.remove("app-blurred");
    }
  }, [open]);

  const { setIsAuthenticated, isAuthenticated, user, setUser } =
    useCurrentApp();
  const navigate = useNavigate();

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

  return (
    <div
      className={`grid grid-cols-[1fr_4fr_2fr] max-sm:grid-cols-2 p-3 sticky top-0 z-1000 bg-[#fff] text-[#000]`}
    >
      <nav className="p-3 flex gap-4 my-auto ml-0 items-center">
        <div className="drawer sm:hidden">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer"
              className="btn btn-primary drawer-button"
            >
              <GiHamburgerMenu className="text-2xl cursor-pointer" />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <Link
                onClick={() =>
                  (document.getElementById("my-drawer").checked = false)
                }
                className="p-5 px-8 cursor-pointer"
                to="/"
              >
                Home
              </Link>
              <Link
                onClick={() =>
                  (document.getElementById("my-drawer").checked = false)
                }
                className="p-5 px-8 cursor-pointer"
                to="/store"
              >
                Store
              </Link>
              <Link
                onClick={() =>
                  (document.getElementById("my-drawer").checked = false)
                }
                className="p-5 px-8 cursor-pointer"
                to="/about"
              >
                About
              </Link>
              <Link
                onClick={() =>
                  (document.getElementById("my-drawer").checked = false)
                }
                className="p-5 px-8 cursor-pointer"
                to="/service"
              >
                Service
              </Link>
            </ul>
          </div>
        </div>
        <span className="font-bold">BingCloth</span>
      </nav>
      <nav className="p-3 max-sm:hidden my-auto">
        <Link className="p-5 px-8 cursor-pointer" to="/">
          Home
        </Link>
        <Link className="p-5 px-8 cursor-pointer" to="/store">
          Store
        </Link>
        <Link className="p-5 px-8 cursor-pointer" to="/about">
          About
        </Link>
        <Link className="p-5 px-8 cursor-pointer" to="/service">
          Service
        </Link>
      </nav>
      <nav className="flex gap-5 justify-end p-3">
        <div className="flex items-center">
          {isAuthenticated && (
            <div className="flex gap-3 max-lg:hidden items-center">
              <FiUser className="text-2xl font-bold cursor-pointer" />
              <span className="font-bold">{user.name}</span>
            </div>
          )}
        </div>
        <button onClick={() => setOpen(true)}>
          <IoCartOutline className="text-2xl cursor-pointer" />
        </button>

        <div className="dropdown dropdown-end">
          <div tabIndex="0" role="button" className="btn m-1">
            <FiUser className="text-2xl font-bold cursor-pointer md:hidden" />
            <GiHamburgerMenu className="text-2xl cursor-pointer max-md:hidden" />
          </div>
          <ul
            tabIndex="0"
            className="dropdown-content menu bg-[#fff] rounded-box z-1 w-52 p-2 shadow-sm"
          >
            {!isAuthenticated && (
              <Link to="/register">
                <li
                  tabIndex={0}
                  onClick={() => document.activeElement.blur()}
                  className="p-1 px-3 hover:bg-gray-300 font-[600]"
                >
                  Sign up
                </li>
              </Link>
            )}
            {!isAuthenticated && (
              <Link to="/login">
                <li
                  tabIndex={0}
                  onClick={() => document.activeElement.blur()}
                  className="p-1 px-3 hover:bg-gray-300 font-[600]"
                >
                  Sign in
                </li>
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/info"
                className="flex gap-1 items-center hover:bg-gray-300 font-[500] px-3"
              >
                <MdAccountCircle />
                <li
                  tabIndex={0}
                  onClick={() => document.activeElement.blur()}
                  className="p-1"
                >
                  Account
                </li>
              </Link>
            )}
            {isAuthenticated && (
              <Link
                onClick={handleLogout}
                className="flex gap-1 items-center hover:bg-gray-300 font-[500] px-3"
              >
                <IoLogOutOutline />
                <li className="p-1">Log out</li>
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin/manage-user"
                className="flex gap-1 items-center hover:bg-gray-300 font-[500] px-3"
              >
                <MdManageAccounts />
                <li
                  tabIndex={0}
                  onClick={() => document.activeElement.blur()}
                  className="p-1"
                >
                  Manage User
                </li>
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin/manage-product"
                className="flex gap-1 items-center hover:bg-gray-300 font-[500] px-3"
              >
                <MdOutlineManageSearch />
                <li
                  tabIndex={0}
                  onClick={() => document.activeElement.blur()}
                  className="p-1"
                >
                  Manage Product
                </li>
              </Link>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin/manage-order"
                className="flex gap-1 items-center hover:bg-gray-300 font-[500] px-3"
              >
                <MdOutlineManageSearch />
                <li
                  tabIndex={0}
                  onClick={() => document.activeElement.blur()}
                  className="p-1"
                >
                  Manage Order
                </li>
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/my-order"
                className="flex gap-1 items-center hover:bg-gray-300 font-[500] px-3"
              >
                <MdManageHistory />
                <li
                  tabIndex={0}
                  onClick={() => document.activeElement.blur()}
                  className="p-1"
                >
                  My order
                </li>
              </Link>
            )}
          </ul>
        </div>
        <CartDrawer open={open} setOpen={setOpen} />
      </nav>
    </div>
  );
};

export default AppHeader;
