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

    data = await sql`
    SELECT customer_id, position
    FROM customers
    WHERE queue_id = ${ queue } and ready = TRUE
    ORDER BY position;
    `;

    let orders_ready = data;

    // sql.end();

    return {
        orders_waiting,
        orders_ready,
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

    let waiting_orders: Order[] = data.orders_waiting.map((order: any) => {
        return {
            customer_id: order.customer_id,
            position: order.position
        };
    });
    let ready_orders: Order[] = data.orders_ready.map((order: any) => {
        return {
            customer_id: order.customer_id,
            position: order.position
        };
    });

    return (
    <div>
        <h1>{data.queue_name}</h1>

        <div className="lg:flex justify-between lg:gap-24">

            <div className="flex-grow lg:border-r-4">
                <h2 className="mt-12">Waiting orders</h2>
                <OrdersList params={{ orders: waiting_orders, queue_id: params.queue }} type="waiting" />
            </div>

            <div className="flex-grow">
                <h2 className="mt-12">Ready orders</h2>
                <OrdersList params={{ orders: ready_orders, queue_id: params.queue }} type="ready" />
            </div>
        </div>

    </div>
    )
}
