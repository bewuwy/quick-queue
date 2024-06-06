import sql from '../../db';

// handle POST request to /api/getOrder
// request body: { queue_id: number, customer_id: number }
export async function POST(request: Request) {

    let res;

    try {
        res = await request.json();
        // Add your code here
    } catch (error) {
        return new Response('Wrong request body', { status: 500 });
    }

    let queue_id = res?.queue_id;
    let customer_id = res?.customer_id;

    // get name of the queue
    let data = await sql`
    SELECT name FROM queue WHERE queue_id=${ queue_id };
    `;

    let queue_name = data[0].name;

    // get customer and check order number
    data = await sql`
    SELECT position, ready, updated_at FROM customers WHERE queue_id=${ queue_id } and customer_id=${ customer_id };
    `;

    let customer_position = data[0].position;
    let customer_ready = data[0].ready;
    let updated_at = data[0].updated_at;

    let num_ahead = 0;

    if (customer_ready !== true) {
        // get number of people ahead of the customer
        data = await sql`
        SELECT count(position) FROM customers WHERE queue_id=100 and ready=false and position<${ customer_position };
        `;

        num_ahead = data[0].count;
    }

    let data_json = {
        num_ahead,
        customer_ready,
        customer_position,
        queue_name,
        updated_at
    }

    return new Response(JSON.stringify(data_json), { status: 200 });
}
