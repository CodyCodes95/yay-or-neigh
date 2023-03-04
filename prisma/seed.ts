import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function seedDb() {
  const form = await prisma.form.create({
    data: {
      name: "Status Seasonal '22",
      userId: "cletf6amz0000ehj4f4vo14d3",
    },
  });
  await prisma.field.createMany({
    data: [
      {
        name: "Full Name",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Postcode",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "City",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "State",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Instagram Name",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Make",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Model",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Engine Mods",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Suspension Mods",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Exterior Mods",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Interior Mods",
        type: "text",
        formId: form.id,
        required: true,
      },
      {
        name: "Link to HD Photos",
        type: "text",
        formId: form.id,
        required: false,
      },
      {
        name: "Photographer Username",
        type: "text",
        formId: form.id,
        required: false,
      },
    ],
  });
}
seedDb()
  .then(async () => {
    console.log("DONE");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
