import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function seedDb() {
  const form = await prisma.form.create({
    data: {
      name: "Status Seasonal '22",
      userId: "clewtiu210000ehfz5qoreyk0",
      endDate: new Date("2023-12-31"),
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
  const fields = await prisma.field.findMany({})
  const data = fields.map(field => {
    return {
      value: "test",
      fieldId: field.id
    }
  })
  const createSubmissions = await prisma.submission.createMany({
    data: [
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
      {
        formId: form.id,
        email: "cody@test.com",
        data: data,
      },
    ],
  });
  const submissions = await prisma.submission.findMany();
  const submissionImages = await prisma.image.createMany({
    data: submissions.map((submission) => {
      return {
        url: "http://res.cloudinary.com/codycodes/image/upload/v1677907517/submissions/eos8xyif8kyw0bo5hugh.jpg",
        submissionId: submission.id,
      };
    }),
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
