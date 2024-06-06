import { Suspense } from "react";
import Ticket from "./ticket";

export default function WaitingPage({params}: { params: { queue: number, customer: string } }) {

    return (
        <div className='flex flex-col receipt-bg px-4 py-6 justify-between items-center md:w-96 self-center'>
        
            <Suspense fallback={<p>Loading your ticket info...</p>}>
                <Ticket queue={params.queue} customer={params.customer} />
            </Suspense>

        </div>
    );
}
