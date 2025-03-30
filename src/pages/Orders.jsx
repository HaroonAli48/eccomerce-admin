import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders); // Store all orders (including delivered ones)
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const whatsapp = (order) => {
    const customerName = `${order.address.firstName} ${order.address.lastName}`;
    const orderItems = order.items.map(item => `${item.name} (x${item.quantity}, Size: ${item.size})`).join(", ");
    const orderAmount = `${currency}${order.amount}`;
    const phoneNumber = '+923335273923';
    
    const message = `Dear ${customerName},\n\nThank you for placing your order with us! We have successfully received your order for:\n ${orderItems}.\n The total amount due is *${orderAmount}*.\nTo complete the payment process, please deposit the amount into our JazzCash account:\n\nNumber: 03335273923\n\nAfter making the payment, kindly send us the receipt screenshot. We will promptly verify your payment, update your order status, and ensure that your order is delivered to you soon.\n\nThank you for choosing us! We appreciate your business and look forward to serving you.\n\nBest regards,\nArooj Collection`;
  
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };
  

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        fetchAllOrders(); // Refresh orders after updating status
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);


return (
  <div>
    <h3>Order Page</h3>
    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      orders.map((order, index) => 
        order.status !== "Delivered" && ( // Just hide Delivered orders
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm"
            key={index}
          >
            <div className="grid grid-rows-1 grid-cols-[1fr_1fr] gap-4">
              {order.items.map((item, idx) => (
                <div key={idx}>
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
                {order.address.city}, {order.address.state}, {order.address.country},{" "}
                {order.address.zipcode}
              </p>
              <p>Phone Number: {order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              {/* <p>Payment: {order.payment ? "Done" : "Pending"}</p> */}
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <div onClick={()=>whatsapp(order)} className="border border-2 cursor-pointer flex align-center p-2 my-3">
              <img src={assets.whatsapp} className="max-w-6 mr-2" alt="Whatsapp" />Message
              </div></div>                
            
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              {order.paymentMethod==='COD'?null:<option value="Unpaid">Unpaid</option>}
              {order.paymentMethod==='COD'?null:<option value="Paid">Paid</option>}
              <option value="Out for delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        )
      )
    )}
  </div>
);

};

export default Orders;
