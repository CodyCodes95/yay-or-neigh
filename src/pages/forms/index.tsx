import { type NextPage } from "next";
import { useRouter } from "next/router";
import Form from "~/components/Form";
import { api } from "~/utils/api";

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const form = api.form.getForm.useQuery({ formId: formId as string }, {
    enabled: !!formId,
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#15162c] to-[#04050a]">
      {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "></div> */}
      {form.data ? <Form form={form.data} /> : null}
    </main>
  );
};

export default FormContainer;
