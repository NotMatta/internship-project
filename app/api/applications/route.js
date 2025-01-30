import { decryptData, encryptData, handle, isValidURL, isValidIP } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"

const secret = process.env.SECRET

export const GET = async (req) => {
  return handle(req,["READ_APPS"], async ({tokenRes}) => {
    const applications = await prisma.application.findMany({where:{userId:tokenRes.body.user.id}})
    applications.forEach((application) => {
      application.password = decryptData(application.password,secret)
    })
    return Response.json(applications, {status: 200})
  })
}

export const POST = async (req) => {
  return handle(req,["WRITE_APPS"],async ({tokenRes}) => {
    const body = await req.json();
    const {logo,name,address,type,login,password} = body;
    if(!logo || !name || !address || !type || !login || !password){
      return Response.json("Requête incorrecte", {status: 400});
    }
    if(!isValidURL(logo)){
      return Response.json("URL du logo invalide", {status: 400});
    }
    if(type == "URL" && !isValidURL(address) || type == "IP" && !isValidIP(address)){
      return Response.json("Adresse invalide", {status: 400});
    }
    const encyptedPassword = encryptData(password,secret);
    const newApplication = await prisma.application.create({
      data: {
        name,
        logo,
        login,
        type,
        address,
        password: encyptedPassword,
        userId: tokenRes.body.user.id
      }
    });
    await prisma.log.create({
      data: {
        message: `Nouvelle application créée : « ${name} » par « ${tokenRes.body.user.name} »`,
        action: "CREATE_APP",
        userId: tokenRes.body.user.id
      }
    });
    return Response.json({...newApplication,password}, {status: 201});
  });
};

export const PUT = async (req) => {
  return handle(req,["WRITE_APPS"],async ({tokenRes}) => {
    const body = await req.json();
    const {logo,name,address,type,login,password,id} = body;
    if(!logo || !name || !address || !type || !login || !password || !id){
      return Response.json("Requête incorrecte", {status: 400});
    }
    if(!isValidURL(logo)){
      return Response.json("URL du logo invalide", {status: 400});
    }
    if(type == "URL" && !isValidURL(address) || type == "IP" && !isValidIP(address)){
      return Response.json("Adresse invalide", {status: 400});
    }
    const encyptedPassword = encryptData(password,secret);
    const updatedApplication = await prisma.application.update({
      where: {id, userId: tokenRes.body.user.id},
      data: {
        name,
        logo,
        login,
        type,
        address,
        password: encyptedPassword,
        updatedAt: new Date()
      }
    });
    await prisma.log.create({
      data: {
        message: `Application mise à jour : « ${name} » par « ${tokenRes.body.user.name} »`,
        action: "UPDATE_APP",
        userId: tokenRes.body.user.id
      }
    });
    return Response.json({...updatedApplication,password}, {status: 202});
  });
};

export const DELETE = async (req) => {
  return handle(req,["WRITE_APPS"],async ({tokenRes}) => {
    const body = await req.json();
    const {id} = {id:body.id};
    if(!id){
      return Response.json("L'identifiant est requis", {status: 400});
    }
    const deletedApplication = await prisma.application.delete({
      where: {id, userId: tokenRes.body.user.id}
    });
    await prisma.log.create({
      data: {
        message: `Application supprimée : « ${deletedApplication.name} » par « ${tokenRes.body.user.name} »`,
        action: "DELETE_APP",
        userId: tokenRes.body.user.id,
      }
    });
    return Response.json(deletedApplication, {status: 200});
  });
};
