import sql from '../../db';

// handle POST request to /api/getOrder
// request body: { queue_id: number, customer_ids: string[] }
export async function POST(request: Request) {

    let res;

    try {
        res = await request.json();
        // Add your code here
    } catch (error) {
        return new Response('Wrong request body', { status: 500 });
    }

    let queue_id: number = res?.queue_id;
    let customer_ids: string[] = res?.customer_ids;

    // get customer and check order number
    let data = await sql`
    SELECT position, ready, updated_at, customer_id FROM customers WHERE queue_id=${ queue_id } and customer_id in ${ sql(customer_ids) };
    `;

    let orders = [...data];

    let data_json = {
        orders
    }

    return new Response(JSON.stringify(data_json), { status: 200 });
}
