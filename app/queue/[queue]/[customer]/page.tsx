import Image from 'next/image';
import { CookingPot, Utensils } from 'lucide-react';

import sql from "../../../db";

async function getData(queue: string, customer: string) {

    // get name of the queue
    let data = await sql`
    SELECT name FROM queue WHERE queue_id=${ queue };
    `;
  
    let queue_name = data[0].name;

    // get customer and check order number
    data = await sql`
    SELECT position, ready, updated_at FROM customers WHERE queue_id=${ queue } and customer_id=${ customer };
    `;

    let customer_position = data[0].position;
    let customer_ready = data[0].ready;
    let updated_at = data[0].updated_at;

    if (customer_ready === true) {        
        // sql.end();

        return {
            num_ahead: 0,
            customer_ready,
            customer_position,
            queue_name,
            updated_at
        };
    }

    // get number of people ahead of the customer
    data = await sql`
    SELECT count(position) FROM customers WHERE queue_id=100 and ready=false and position<${ customer_position };
    `;

    // sql.end();

    let num_ahead = data[0].count;

    return {
        num_ahead,
        customer_ready,
        customer_position,
        queue_name,
        updated_at
    };
}

export default async function WaitingPage({params}: { params: { queue: string, customer: string } }) {

    let data = await getData(params.queue, params.customer);
    
    let ticket_date = new Date(data.updated_at);
    // if generated today, show only time
    let ticket_date_str = ticket_date.toDateString() === new Date().toDateString() 
        ? ticket_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        : ticket_date.toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});

    let is_are = data.num_ahead > 1 ? 's are' : ' is';

    return (
        <div className='flex flex-col receipt-bg px-4 py-6 justify-between items-center md:w-96 self-center'>
        {/* refresh page every 30s */}
        { !data.customer_ready? <meta httpEquiv="refresh" content="30" /> : null }
        
        <span className='text-6xl mb-4'>#{ data.customer_position }</span>

        <div className='mb-4 flex flex-col items-center'>
            <h1>Order from { data.queue_name }</h1>
            <p>Ticket generated at { ticket_date_str }</p> 
            {/* TODO: add time */}
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

        </div>
    );
}
