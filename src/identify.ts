import { PrismaClient, Contact } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const identifyHandler = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber required" });
  }

  // 1️⃣ Find initial matches
  const initialMatches = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    }
  });

  // 2️⃣ If no matches → create primary
  if (initialMatches.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    });

    return res.json({
      contact: {
        primaryContactId: newContact.id,
        emails: email ? [email] : [],
        phoneNumbers: phoneNumber ? [phoneNumber] : [],
        secondaryContactIds: []
      }
    });
  }

  // 3️⃣ Collect all connected contacts (graph traversal)
  const visited = new Set<number>();

  const collectConnected = async (contacts: Contact[]) => {
    for (const contact of contacts) {
      if (!visited.has(contact.id)) {
        visited.add(contact.id);

        const related = await prisma.contact.findMany({
          where: {
            OR: [
              { id: contact.linkedId || -1 },
              { linkedId: contact.id }
            ]
          }
        });

        await collectConnected(related);
      }
    }
  };

  await collectConnected(initialMatches);

  const allContacts = await prisma.contact.findMany({
    where: { id: { in: Array.from(visited) } },
    orderBy: { createdAt: "asc" }
  });

  // 4️⃣ Oldest becomes primary
  const primary = allContacts[0];

  // 5️⃣ Convert other primaries to secondary
  for (const contact of allContacts) {
    if (contact.id !== primary.id && contact.linkPrecedence === "primary") {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          linkPrecedence: "secondary",
          linkedId: primary.id
        }
      });
    }
  }

  // 6️⃣ If new info not already present → create secondary
  const emailExists = allContacts.some(c => c.email === email);
  const phoneExists = allContacts.some(c => c.phoneNumber === phoneNumber);

  if (!emailExists || !phoneExists) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: "secondary"
      }
    });
  }

  // 7️⃣ Fetch final contacts
  const finalContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  const emails = [...new Set(finalContacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean))];

  const secondaryIds = finalContacts
    .filter(c => c.linkPrecedence === "secondary")
    .map(c => c.id);

  return res.json({
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds: secondaryIds
    }
  });
};