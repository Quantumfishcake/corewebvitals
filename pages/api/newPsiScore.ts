import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function handle(req: { body: any; }, res: { json: (arg0: any) => void; }) {
    const newScore = await prisma.psi_Score.create({
        data: {
          ...req.body
        },
      });
      res.json(newScore);
}
