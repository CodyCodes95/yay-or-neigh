import type { Field, Form } from "@prisma/client";

export type FormWithFields = (Form & {
    fields: Field[];
})
