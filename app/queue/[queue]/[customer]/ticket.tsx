"use client";

import Image from 'next/image';
import { CookingPot, Utensils } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

async function getData(queue: number, customer: string) {
    
    let res = await fetch('/api/getOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queue_id: queue, customer_id: customer })
    });

    let data;
    
    try {
        data = await res.json();
    }
    catch (error) {
        console.error('Failed to fetch ticket data');
        return {
            error: 'Failed to fetch ticket data'
        };
    }

    return data;
}

type PageData = {
    num_ahead: number,
    customer_ready: boolean,
    customer_position: number,
    queue_name: string,
    updated_at: string,
    error?: string
}

export default function Ticket({ queue, customer }: {
    queue: number,
    customer: string
}) {

    let [data, setData] = useState<PageData | null>(null);

    const initialised = useRef(false);

    useEffect(() => {

        if (initialised.current) {
            return;
        }
        initialised.current = true;

        // get local storage data
        let localData = localStorage.getItem('tickets');
        // add current ticket to local storage
        if (localData) {
            let tickets = JSON.parse(localData);

            // check if ticket already exists
            let exists = tickets.some((ticket: { customer: string, queue: number }) => ticket.customer == customer && ticket.queue == queue);
            if (!exists) {
                
                tickets.push({ queue, customer });
                localStorage.setItem('tickets', JSON.stringify(tickets));
            }

        } else {
            localStorage.setItem('tickets', JSON.stringify([{ queue, customer }]));
        }

        function updateData() {

            getData(queue, customer).then(data => {
                setData(data);
            });
        }

        setInterval(updateData, 15 * 1000);

        updateData();
    }, [queue, customer]);

    if (!data) {
        return <p>Loading your ticket info...</p>
    }

    if (data.error) {
        return <p>{ data.error }</p>
    }

    let ticket_date = new Date(data.updated_at);
    // if generated today, show only time
    let ticket_date_str = ticket_date.toDateString() === new Date().toDateString() 
        ? ticket_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        : ticket_date.toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});

    let is_are = data.num_ahead > 1 ? 's are' : ' is';

    return (<>
        <span className='text-6xl mb-4'>#{ data.customer_position }</span>

        <div className='mb-4 flex flex-col items-center'>
            <h1>Order from { data.queue_name }</h1>
            <p>Ticket generated at { ticket_date_str }</p> 
        </div>  
        
        {
            !data.customer_ready? (data.num_ahead > 0 ? <p>{ data.num_ahead } order{is_are} ahead of you</p> : <p>You are next!</p>) : null
        }

        <div className='flex mt-12 gap-2'>
            { data.customer_ready 
                ? <div className='font-bold text-xl flex gap-2'>Your order is ready! <Utensils className='w-6 h-6'/></div> 
                : <>Your order is being prepared <CookingPot className='w-6 h-6'/></> 
            } 
        </div>

        <div className='flex flex-col items-center mt-14'>
            <p className='text-sm'>Thank you for using QuickQueue</p>
            <Image src="/images/barcode.png" alt="barcode" width={118} height={512} className='flex-grow w-4/5' />
            <p>quickqueue.vercel.app</p>
        </div>
    </>)
}
