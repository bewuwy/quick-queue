import sql from '../../db';

// handle POST request to /api/readyOrder
export async function POST(request: Request) {

    let res;

    try {
        res = await request.json();
        // Add your code here
    } catch (error) {
        return new Response('Wrong request body', { status: 500 });
    }

    let queue_id = res?.queue_id;
    let position = res?.position;
    let type = res?.type;

    if (type === 'waiting') {

        await sql`
        UPDATE customers
        SET ready = TRUE
        WHERE queue_id = ${ queue_id } and position = ${ position };
        `;
    } else if (type === 'ready') {

        await sql`
        DELETE FROM customers
        WHERE queue_id = ${ queue_id } AND position = ${ position } AND ready = TRUE;
        `;
    }

    // sql.end();

    return new Response('ok', { status: 200 });
}
