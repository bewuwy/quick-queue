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

    await sql`
    UPDATE customers
    SET ready = TRUE
    WHERE queue_id = ${ queue_id } and position = ${ position };
    `;

    // sql.end();

    return new Response('ok', { status: 200 });
}
