import { useState } from "react";

export default function usePizza({pizzas, inputs}){
  const [order, setOrder] = useState([]);
  function addToOrder(orderedPizza){
    setOrder([...order, orderedPizza]);
  }

}