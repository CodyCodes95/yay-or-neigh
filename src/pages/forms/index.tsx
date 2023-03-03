import { useTsController } from "@ts-react/form";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { z } from "zod";
import Form from "~/components/Form";
import { api } from "~/utils/api";

const TextField = ({ inputType }: { inputType: string }) => {
  const { field, error } = useTsController<string>();
  return (
    <>
      <input
        type={inputType || "text"}
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
      />
      {error?.errorMessage && <span>{error.errorMessage}</span>}
    </>
  );
};

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const form = api.form.getForm.useQuery({ formId: formId as string });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "></div> */}
      {form ? <Form form={form} /> : null}
    </main>
  );
};

export default FormContainer;
