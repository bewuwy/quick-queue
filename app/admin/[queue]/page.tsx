import sql from "../../db";

import {Order} from "./ordersList";
import OrdersList from "./ordersList";

async function getQueueData(queue: number) {

    let data = await sql`
    SELECT name FROM queue WHERE queue_id=${ queue };
    `;

    let queue_name = data[0].name;

    data = await sql`
    SELECT customer_id, position
    FROM customers
    WHERE queue_id = ${ queue } and ready = FALSE
    ORDER BY position;
    `;

    let orders_waiting = data;

    return {
        orders_waiting,
        queue_name
    };
}

async function readyOrder(customer_id: string, position: number) {
    await sql`
    UPDATE customers
    SET ready = TRUE
    WHERE customer_id = ${ customer_id } AND position = ${ position };
    `;
}

export default async function QueuePage({ params }: { params: { queue: number }}) {

    let data = await getQueueData(params.queue);

    let orders: Order[] = data.orders_waiting.map((order: any) => {
        return {
            customer_id: order.customer_id,
            position: order.position
        };
    });

    return (
    <div>
        <h1>{data.queue_name}</h1>

        <OrdersList params={{ orders: orders, queue_id: params.queue }} />
    </div>
    )
}
