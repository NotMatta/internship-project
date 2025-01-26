import { handle } from "@/lib/utils";
import prisma from "@/prisma/prisma-client";

export const GET = async(req) => {
  return handle(req,["READ_LOGS"],async() => {
    const params = (new URL(req.url)).searchParams;
    const {search,type,from,to} = {search:params.get("search"),type:params.get("type"),from:params.get("from"),to:params.get("to")};
    if(!search || !type || !from || !to) return Response.json({message:"Missing parameters"},{status:400});
    const actionType = type == "any" ? {} : {action: type};
    const logs = await prisma.log.findMany({
      where:{
        AND:[
          {message: {contains: search, mode: "insensitive"}},
          actionType,
          {date: {gte: new Date(from)}},
          {date: {lte: new Date(to)}}
        ]
      },
      orderBy: {date: "desc"},
    });
    console.log("Logs:",logs);
    return Response.json({logs},{status:200});
  })
}
