import { Field, Form } from "@prisma/client";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";


type FormWithFields = UseTRPCQueryResult<(Form & {
    fields: Field[];
}) | null>