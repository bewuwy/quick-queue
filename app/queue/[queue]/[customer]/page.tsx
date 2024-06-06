import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Ticket from "./ticket";

export default function WaitingPage({params}: { params: { queue: number, customer: string } }) {

    return (
        <div className="self-center w-full flex flex-col">

            <Link href={`/queue/${params.queue}`} className="flex items-center mb-4" ><ArrowLeft className="w-5 h-5 mr-2" />Go back to the shop</Link>

            <div className='flex flex-col receipt-bg px-6 py-6 justify-between items-center self-center w-fit md:w-96'>
            
                <Suspense fallback={<p>Loading your ticket info...</p>}>
                    <Ticket queue={params.queue} customer={params.customer} />
                </Suspense>
            </div>
        </div>
    );
}
