import { useOrders } from "../context/OrdersContext";
import {currency} from"../App"
import { Trash2 } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Delivered = () => {
  const { orders, setOrders } = useOrders();

  const deleteOrder = async (id) => {
    try {
      const response = await axios.post(backendUrl + "/api/order/delete", {
        orderId: id,
      });

      if (response.data.success) {
        toast.success("Order Deleted Successfully");
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== id)
        );
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <div>
      {orders.length > 0 ? (
        <h2>Delivered Orders</h2>
      ) : (
        <p>No delivered orders found.</p>
      )}
      {orders.map((order, index) => (
        <div
          className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm"
          key={index}
        >
          <div className="grid grid-rows-1 grid-cols-[1fr_1fr] gap-4">
            {order.items.map((item, index) => (
              <div key={index}>
                <img className="min-w-20" src={item.image[0]} alt="Item" />
                <p className="py-0.5">{item.name}</p>
              </div>
            ))}
          </div>
          <div>
            {order.items.map((item, idx) => (
              <p className="py-0.5" key={idx}>
                {item.name} x {item.quantity} <span> {item.size}</span>
                {idx !== order.items.length - 1 && ","}
              </p>
            ))}
            <p className="mt-3 mb-2 font-medium">
              {order.address.firstName + " " + order.address.lastName}
            </p>
            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state},{" "}
              {order.address.country}, {order.address.zipcode}
            </p>
            <p>Phone Number: {order.address.phone}</p>
          </div>
          <div>
            <p className="text-sm sm:text-[15px]">
              Items: {order.items.length}
            </p>
            <p className="mt-3">Method: {order.paymentMethod}</p>
            <p>Payment: {order.payment ? "Done" : "Pending"}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
          </div>
          <p className="text-sm sm:text-[15px]">
            {currency}
            {order.amount}
          </p>
          <h4 className="border border-black text-center p-3">Delivered👍</h4>
          <button
            onClick={() => deleteOrder(order._id)}
            className="flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Delivered;