import jwt from "jsonwebtoken"
import prisma from "@/prisma/prisma-client"

export const GET = async (req) => {
  try{
    const token = req.headers.get("authorization").split(" ")[1]
    if(!token){
      return Response.json("No token provided", {status: 401})
    }
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const FoundUser = await prisma.user.findUnique({where: {id: decoded.id}, include:{role:true}})
      const {password, ...user} = FoundUser
      if(!user){
        return Response.json("User not found", {status: 404})
      }
      if(user.roleId != decoded.roleId){
        return Response.json("Unauthorized", {status: 401})
      }
      return Response.json({user}, {status: 200})
    }
    catch(err){
      console.log(err)
      return Response.json("Invalid token", {status: 401})
    }
  } catch(err){
    console.log(err)
    return Response.json("Internal Server Error", {status: 500})
  }
}
