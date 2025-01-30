import { decryptData, encryptData, handle, validatePassword } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"

const secret = process.env.SECRET

export const PUT = async (req) => {
  return await handle(req,[],async ({tokenRes}) => {
    const body = await req.json();
    if(body.newPassword !== body.confirmPassword){
      return Response.json("Les mots de passe ne correspondent pas", {status: 400});
    }

    if(!validatePassword(body.password).isValid || !validatePassword(body.newPassword).isValid){
      return Response.json(validatePassword("").message, {status: 400});
    }

    if(body.password == body.newPassword){
      return Response.json("Le nouveau mot de passe ne peut pas être le même que l'ancien mot de passe", {status: 400});
    }
    const user = await prisma.user.findUnique({where:{id:tokenRes.body.user.id}});
    const storedPassword = decryptData(user.password,secret);

    if(body.password != storedPassword){
      return Response.json("Mot de passe incorrect", {status: 400});
    }
    const newPassword = encryptData(body.newPassword,secret);
    await prisma.user.update({
      where: {id: tokenRes.body.user.id},
      data: {
        password: newPassword
      }
    });
    await prisma.log.create({
      data: {
        message: `"${tokenRes.body.user.name}" a changé son mot de passe`,
        action: "UPDATE_USER",
        userId: tokenRes.body.user.id
      }
    });
    return Response.json("Mot de passe mis à jour", {status: 200});
  });
};
