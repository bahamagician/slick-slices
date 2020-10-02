import { useState, useContext } from 'react';
import OrderContext from '../components/OrderContext';

export default function usePizza({ pizzas, inputs }) {
  // Create some state to hold our order
  // const [order, setOrder] = useState([]);
  // Make a function to add things to an order
  const [order, setOrder] = useContext(OrderContext);
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }
  // Make a function to remove things from order
  function removeFromOrder(index) {
    setOrder([...order.slice(0, index), ...order.slice(index + 1)]);
  }
  // Send this data to a serverless function upon checkout
  // TODO

  return {
    order,
    addToOrder,
    removeFromOrder,
  };
}
