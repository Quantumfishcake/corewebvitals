import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function handle(req, res) {
    console.log("body", req.body);

    const newScore = await prisma.Psi_Score.create({
        data: {
          ...req.body
        },
      });
      res.json(newScore);
}
