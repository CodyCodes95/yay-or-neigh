import type { Field, Form } from "@prisma/client";

export type FormWithFields = Form & {
  fields: Field[];
};

export type SubmissionWithImages = Submission & {
  Image: Image[];
};
