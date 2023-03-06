import type { Field, Form, Image, Submission } from "@prisma/client";

export type FormWithFields = Form & {
  fields: Field[];
};

export type SubmissionWithImages = {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    formId: string;
    data: {fieldId: string, value: string}[]
    deferred: boolean;
    approved: boolean | null;
} & {
  Image: Image[];
};
