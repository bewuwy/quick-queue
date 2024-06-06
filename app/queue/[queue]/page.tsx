import Link from "next/link";
import sql from "../../db";
import { buttonVariants } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import MyTickets from "./mytickets";

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

export default async function QueuePage({ params }: { params: { queue: number }}) {

    let data = await getQueueData(params.queue);

    return (
    <div className="flex-grow mb-12 flex flex-col justify-between w-full md:w-[30rem] self-center">
        <div className="flex flex-col gap-8">
            <div>
                <h1>{data.queue_name}</h1>
                { data.num_waiting == 0 ? <p>No one is waiting</p> : <p>{data.num_waiting} order(s) waiting</p>}
            </div>

            <MyTickets queue={params.queue} />
        </div>

        <Link className={buttonVariants({ variant: "secondary" })} href={`${params.queue}/add`}><CirclePlus className='w-5 h-5 mr-2' />Queue up</Link>
    </div>
    )
}
