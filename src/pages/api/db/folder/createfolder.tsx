import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function createFolder(folderName: string, userId: string, parentFolderId?: number) {
  try {

    if(parentFolderId)// normal folder creating case
    {
      const folderid = await prisma.folder.create({
        data: {
          name: folderName,
          user:{
            connect:{
             id: userId
            }
          },
          parent:{
            connect:{
             id: parentFolderId
            }
          }
        },
        select: {
          id: true,
        },
      });

      return  folderid.id;
    }
    else
    {
      const folderid = await prisma.folder.create({
        data: {
          name: folderName,
          user:{
            connect:{
             id: userId
            }
          }
        },
        select: {
          id: true,
        },
      });

      return  folderid.id;
    }
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folderName, parentFolderId, userId } = req.body;

  try {
    const folderid = await createFolder( folderName,userId, parentFolderId);
    await prisma.$disconnect();
    res.status(200).json({ message: 'created', folderid });
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
