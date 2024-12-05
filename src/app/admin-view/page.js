"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { getAllOrdersForAllUsers, updateStatusOfOrder } from "@/services/order";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function AdminView() {
  const {
    allOrdersForAllUsers,
    setAllOrdersForAllUsers,
    user,
    pageLevelLoader,
    setPageLevelLoader,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllOrdersForAllUsers() {
    setPageLevelLoader(true);
    const res = await getAllOrdersForAllUsers();

    if (res.success) {
      setPageLevelLoader(false);
      setAllOrdersForAllUsers(
        res.data && res.data.length
          ? res.data.filter((item) => item.user._id !== user._id)
          : []
      );
    } else {
      setPageLevelLoader(false);
    }
  }

  useEffect(() => {
    if (user !== null) extractAllOrdersForAllUsers();
  }, [user]);

  async function handleUpdateOrderStatus(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });
    const res = await updateStatusOfOrder({
      ...getItem,
      isProcessing: false,
    });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      extractAllOrdersForAllUsers();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-600 to-pink-500">
        <PulseLoader color={"#ffffff"} loading={pageLevelLoader} size={30} />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-500 py-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div className="bg-white shadow-xl rounded-xl p-8 transition transform hover:scale-105">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
              Admin Panel - Orders
            </h1>
            <div className="flow-root">
              {allOrdersForAllUsers && allOrdersForAllUsers.length ? (
                <ul className="flex flex-col gap-6">
                  {allOrdersForAllUsers.map((item) => (
                    <li
                      key={item._id}
                      className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shadow-lg p-6 flex flex-col space-y-4 rounded-lg transition-transform duration-500 hover:scale-105"
                    >
                      <div className="flex justify-between items-center">
                        <h1 className="font-bold text-xl text-purple-700">
                          Order ID: {item._id}
                        </h1>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Name:</span>{" "}
                            {item?.user?.name}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Email:</span>{" "}
                            {item?.user?.email}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Total:</span> $
                            {item?.totalPrice}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 overflow-x-auto">
                        {item.orderItems.map((orderItem, index) => (
                          <div
                            key={index}
                            className="shrink-0 transition transform hover:scale-110"
                          >
                            <img
                              alt="Order Item"
                              className="h-24 w-24 rounded-lg object-cover border-2 border-gray-300"
                              src={
                                orderItem &&
                                orderItem.product &&
                                orderItem.product.imageUrl
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 items-center">
                        <button
                          className={`mt-5 px-5 py-3 text-sm font-medium uppercase tracking-wide rounded-lg ${
                            item.isProcessing
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                          disabled
                        >
                          {item.isProcessing
                            ? "Processing Order"
                            : "Order Delivered"}
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(item)}
                          disabled={!item.isProcessing}
                          className="mt-5 px-5 py-3 text-sm font-medium uppercase tracking-wide bg-black text-white rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-gray-700 disabled:opacity-50"
                        >
                          {componentLevelLoader &&
                          componentLevelLoader.loading &&
                          componentLevelLoader.id === item._id ? (
                            <ComponentLevelLoader
                              text={"Updating..."}
                              color={"#ffffff"}
                              loading
                            />
                          ) : (
                            "Update Status"
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-600">
                  No orders found at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

