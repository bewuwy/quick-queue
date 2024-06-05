"use client";

import { useState } from "react";

export type Order = {
    customer_id: string;
    position: number;
}

async function readyOrder(queue_id: number, position: number, [orders, setOrders]: [Order[], Function]) {
    
    // remove the order from the orders list
    setOrders(orders.filter((order: Order) => order.position !== position));

    // post to the server to mark the order as ready
    await fetch("/api/readyOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            queue_id,
            position
        })
    });
}

export default function OrdersList({ params }: { params: { orders: Order[], queue_id: number } }) {

    let [orders, setOrders] = useState<Order[]>(params.orders);

    return (<>
    <p>{orders.length} customers waiting</p>
    <br/>
    <div className="flex flex-col w-64 gap-2">
    
    {orders.map((order: any) => (
        <div key={order.customer_id+order.position.toString()} className="flex justify-between">
            <p>Order #{order.position}</p>

            <button onClick={async() => {
                readyOrder(params.queue_id, order.position, [orders, setOrders])
            }}>Ready</button>
        </div>
    ))}
    
    </div>
    </>);
}
