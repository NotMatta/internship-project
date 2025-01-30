import jwt from "jsonwebtoken"
import prisma from "@/prisma/prisma-client"

export const GET = async (req) => {
  try{
    const token = req.headers.get("authorization")?.split(" ")[1];
    if(!token){
      return Response.json("Aucun token fourni", {status: 401});
    }
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const FoundUser = await prisma.user.findUnique({where: {id: decoded.id}, include:{role:true}});
      if (!FoundUser) {
        return Response.json("Utilisateur non trouvé", { status: 404 });
      }
      const {password, ...user} = FoundUser;
      if(user.roleId != decoded.roleId){
        return Response.json("Non autorisé", {status: 401});
      }
      return Response.json({user}, {status: 200});
    }
    catch(err){
      console.error(err);
      return Response.json("Token invalide", {status: 401});
    }
  } catch(err){
    console.error(err); 
    return Response.json("Erreur serveur interne", {status: 500});
  }
};
