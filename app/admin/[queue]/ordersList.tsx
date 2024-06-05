"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export type Order = {
    customer_id: string;
    position: number;
}

async function handleReadyOrder(queue_id: number, position: number, [orders, setOrders]: [Order[], Function], type: string | undefined) {
    
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
            position,
            type
        })
    });
}

export default function OrdersList({ params, type }: { params: { orders: Order[], queue_id: number }, type: string | undefined }) {

    let [orders, setOrders] = useState<Order[]>(params.orders);

    let text_top = "customer(s) waiting";
    if (type === "ready") {
        text_top = "order(s) ready for pickup";
    }

    let button_text = "Ready";
    if (type === "ready") {
        button_text = "Delete";
    }

    return (<>
    <p>{orders.length} {text_top}</p>
    <br/>

    <ul className="flex flex-col w-full sm:w-64 md:w-1/2 gap-2">
    {orders.map((order: any) => (
            <li key={order.customer_id+order.position.toString()} className="flex justify-between items-center">
                <p>Order #{order.position}</p>

                <Button variant="outline" onClick={async() => {
                    handleReadyOrder(params.queue_id, order.position, [orders, setOrders], type)
                }}>{button_text}</Button>
            </li>
    ))}
    </ul>

    </>);
}
