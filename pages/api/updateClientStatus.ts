import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handle(req: { body: any }, res: { json: (arg0: any) => void }) {
  const newData:any = {};
  //format data
  if (req.body.field === "status") {
    req.body.newValue = parseInt(req.body.newValue);
  }
  newData[req.body.field] = req.body.newValue;
  const updateStatus = await prisma.client.update({
    where: {
      id: req.body.id,
    },
    data: {
      ...newData,
    },
  });
  res.json(updateStatus);
}
