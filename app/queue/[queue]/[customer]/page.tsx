import sql from "../../../db";

async function getData(queue: string, customer: string) {

    // get name of the queue
    let data = await sql`
    SELECT name FROM queue WHERE queue_id=${ queue };
    `;
  
    let queue_name = data[0].name;

    // get customer and check order number
    data = await sql`
    SELECT position, ready FROM customers WHERE queue_id=${ queue } and customer_id=${ customer };
    `;

    let customer_position = data[0].position;
    let customer_ready = data[0].ready;

    if (customer_ready === true) {
        return {
            num_ahead: 0,
            customer_ready,
            customer_position,
            queue_name
        };
    }

    // get number of people ahead of the customer
    data = await sql`
    SELECT count(position) FROM customers WHERE queue_id=100 and ready=false and position<${ customer_position };
    `;

    let num_ahead = data[0].count;

    return {
        num_ahead,
        customer_ready,
        customer_position,
        queue_name
    };
}

export default async function WaitingPage({params}: { params: { queue: string, customer: string } }) {

    let data = await getData(params.queue, params.customer);

    return (
        <div>

        {/* refresh page every 30s */}
        <meta httpEquiv="refresh" content="30" />
        
        <h1>Quick Queue - { data.queue_name }</h1>
        <p>Order #{ data.customer_position }</p>
        <br/>
        
        { !data.customer_ready && (
            <p>{ data.num_ahead } people ahead of you</p>
        )}

        <p>{ data.customer_ready ? "Your order is ready" : "Your order is being prepared" }</p>
        </div>
    );
}
