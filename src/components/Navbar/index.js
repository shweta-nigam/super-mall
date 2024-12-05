'use client'
import React, { Fragment, useContext, useEffect } from "react";
import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import CommonModal from "../CommonModal";
import CartModal from "../CartModal";


const extendedNavOptions = [
  ...navOptions,
  { id: "offers", label: "Offers", path: "/offers" }
];

const extendedAdminNavOptions = [
  ...adminNavOptions,
  { id: "offers", label: "Offers", path: "/offers" },
];

function NavItems({ isModalView = false, isAdminView, router }) {
  return (
    <div
      className={`items-center justify-between w-full md:flex md:w-auto ${
        isModalView ? "" : "hidden"
      }`}
      id="nav-items"
    >
      <ul
        className={`flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-white ${
          isModalView ? "border-none" : "border border-gray-100"
        }`}
      >
        {(isAdminView ? extendedAdminNavOptions : extendedNavOptions).map(
          (item) => (
            <li
              className="cursor-pointer block py-2 px-4 text-gray-900 rounded-lg md:px-6 md:py-2.5 hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white transition-all shadow-md"
              key={item.id}
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function Navbar() {
  const { showNavModal, setShowNavModal } = useContext(GlobalContext);
  const {
    user,
    isAuthUser,
    setIsAuthUser,
    setUser,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    showCartModal,
    setShowCartModal,
  } = useContext(GlobalContext);

  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      pathName !== "/admin-view/add-product" &&
      currentUpdatedProduct !== null
    )
      setCurrentUpdatedProduct(null);
  }, [pathName]);

  function handleLogout() {
    setIsAuthUser(false);
    setUser(null);
    Cookies.remove("token");
    localStorage.clear();
    router.push("/");
  }

  const isAdminView = pathName.includes("admin-view");

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#662D8C] to-[#ED1E79] text-white shadow-lg"
      >
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
          <div
            onClick={() => router.push("/")}
            className="flex items-center cursor-pointer"
          >
            <span className="text-2xl font-bold tracking-wide">MallifyIQ</span>
          </div>
          <div className="flex md:order-2 items-center gap-4">
            {!isAdminView && isAuthUser ? (
              <Fragment>
                <button
                  className="px-5 py-3 text-sm font-medium bg-white text-purple-700 rounded-lg hover:bg-purple-100 transition-all"
                  onClick={() => router.push("/account")}
                >
                  Account
                </button>
                <button
                  className="px-5 py-3 text-sm font-medium bg-white text-pink-600 rounded-lg hover:bg-pink-100 transition-all"
                  onClick={() => setShowCartModal(true)}
                >
                  Cart
                </button>
              </Fragment>
            ) : null}
            {user?.role === "admin" ? (
              isAdminView ? (
                <button
                  className="px-5 py-3 text-sm font-medium bg-white text-purple-700 rounded-lg hover:bg-purple-100 transition-all"
                  onClick={() => router.push("/")}
                >
                  Client View
                </button>
              ) : (
                <button
                  onClick={() => router.push("/admin-view")}
                  className="px-5 py-3 text-sm font-medium bg-white text-pink-600 rounded-lg hover:bg-pink-100 transition-all"
                >
                  Admin View
                </button>
              )
            ) : null}
            {isAuthUser ? (
              <button
                onClick={handleLogout}
                className="px-5 py-3 text-sm font-medium bg-white text-purple-700 rounded-lg hover:bg-purple-100 transition-all"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-3 text-sm font-medium bg-white text-pink-600 rounded-lg hover:bg-pink-100 transition-all"
              >
                Login
              </button>
            )}
            <button
              className="inline-flex items-center p-2 text-white rounded-lg md:hidden hover:bg-purple-800"
              onClick={() => setShowNavModal(true)}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <NavItems router={router} isAdminView={isAdminView} />
        </div>
      </nav>
      <CommonModal
        showModalTitle={false}
        mainContent={
          <NavItems
            router={router}
            isModalView={true}
            isAdminView={isAdminView}
          />
        }
        show={showNavModal}
        setShow={setShowNavModal}
      />
      {showCartModal && <CartModal />}
    </>
  );
}

