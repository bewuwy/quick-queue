"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";

async function getTicketData(queue: number, customer_ids: string[]) {

    let res = await fetch('/api/getOrders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queue_id: queue, customer_ids: customer_ids })
    });

    let data = await res.json();

    return data;
}

type Ticket = {
    updated_at: string,
    position: number,
    ready: boolean,
    date_string: string,
    customer_id: string
}

export default function MyTickets({
    queue
}: {
    queue: number
}) {

    const initialised = useRef(false);

    let [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {

        if (initialised.current) {
            return;
        }
        initialised.current = true;

        // get local storage data
        let localData = localStorage.getItem('tickets');
        // filter out tickets for other queues
        let tickets_ids = localData ? JSON.parse(localData) : [];
        tickets_ids = tickets_ids.filter((ticket: { queue: number }) => ticket.queue == queue);
        
        if (tickets_ids.length == 0) {
            return;
        }

        function updateData() {

            getTicketData(queue, tickets_ids.map((ticket: { customer: string }) => ticket.customer)).then((data) => {
    
                let tickets_ = data.orders;
    
                // update date strings and customer ids
                tickets_ = tickets_.map((ticket: Ticket) => {
                    let date = new Date(ticket.updated_at);
                    
                    ticket.date_string = date.toDateString() === new Date().toDateString() 
                        ? date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                        : date.toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});

                    return ticket;
                });
    
                setTickets(tickets_);
            });
        }

        updateData();

        setInterval(updateData, 15 * 1000);

    }, [queue]);

    useEffect(() => {

        if (!initialised.current) {
            return;
        }

        if (tickets.length == 0) {
            return;
        }

        // remove old tickets from local storage
        let localData = localStorage.getItem('tickets');
        let tickets_ids = localData ? JSON.parse(localData) : [];

        tickets_ids = tickets_ids.filter((ticket: { queue: number }) => ticket.queue == queue);

        let new_ticket_ids = tickets.map((ticket: Ticket) => ticket.customer_id);

        // get old tickets not in the new list
        let old_tickets = tickets_ids.filter((ticket: { customer: string }) => !new_ticket_ids.includes(ticket.customer));

        let new_tickets = localData ? JSON.parse(localData) : [];

        // remove old tickets from new tickets
        new_tickets = new_tickets.filter((ticket: { customer: string }) => !old_tickets.some((old_ticket: { customer: string }) => old_ticket.customer == ticket.customer));

        localStorage.setItem('tickets', JSON.stringify(new_tickets));

    }, [tickets, queue]);

    if (!initialised.current) {
        return <p>Loading your tickets...</p>
    }

    if (tickets.length == 0) {
        return <></>
    }

    return (
        <div>
            <h2>My Tickets</h2>

            <ul className="flex flex-col gap-4">
                {tickets.map((ticket, index) => (
                    <Link href={`/queue/${queue}/${ticket.customer_id}`} key={index}>
                        <li key={index} className="flex gap-8 receipt-bg w-full p-4 items-center justify-between text-black">
                            <span className="text-4xl">#{ticket.position}</span>
                            {ticket.ready ? <span className="font-bold text-lg">Ready</span> : <span>In preparation</span>}
                            <div className="flex gap-2"><span className="hidden md:block">Created at </span><span>{ticket.date_string}</span></div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}
