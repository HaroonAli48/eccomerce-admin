import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const OrdersContext = createContext();

export const OrdersProvider = ({ children, token }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });

      if (response.data.success) {
        const filteredOrders = response.data.orders.filter(order => order.status === "Delivered");
        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <OrdersContext.Provider value={{ orders, setOrders, fetchOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
