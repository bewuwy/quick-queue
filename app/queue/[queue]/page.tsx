import sql from "../../db";

// queue page

async function getQueueData(queue: number) {

    let data = await sql`
    SELECT name FROM queue WHERE queue_id=${ queue };
    `;

    let queue_name = data[0].name;

    data = await sql`
    SELECT count(position) FROM customers WHERE queue_id=${ queue } and ready=false;
    `;

    let num_waiting = data[0].count;

    return {
        num_waiting,
        queue_name
    };
}

export default async function QueuePage({ params }: { params: { queue: string }}) {

    let data = await getQueueData(parseInt(params.queue));

    return (
    <div>
        <h1>{data.queue_name}</h1>
        <p>{data.num_waiting} people waiting</p>
        <br/>
        <a href={`${params.queue}/add`}>Queue up</a>
    </div>
    )
}
