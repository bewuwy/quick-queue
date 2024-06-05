import { redirect } from "next/navigation";
import ShortUniqueId from "short-unique-id";

import sql from "../../../db";

async function enqueue(queue: number) {

  const uid = new ShortUniqueId({ length: 10 });
  let customer_id = uid.rnd();

  await sql`    
    UPDATE queue
    SET last_num = last_num + 1
    WHERE queue_id = ${ queue };
  `;

  await sql`
    INSERT INTO customers(queue_id, customer_id, position)
    values (${ queue }, ${customer_id}, (SELECT last_num FROM queue WHERE queue_id = ${ queue }));
  `;

  // sql.end();

  return {
    customer_id
  };
}


export default async function AddPage({ params }: { params: { queue: number }}) {

    let data = await enqueue(params.queue);
    
    // redirect to the waiting page
    redirect(`/queue/${params.queue}/${data.customer_id}`);
}
