import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

// get the client data 
export default async function handle(req: { body: any; }, res: { json: (arg0: any) => void; }) {
    const clientData = await prisma.client.findMany({
        include: {
            psiscores: {
              orderBy: {
                date: 'asc',
              },
            }
          },
    });
    res.json(clientData);
}