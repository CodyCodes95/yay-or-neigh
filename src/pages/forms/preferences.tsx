import { Switch } from "@headlessui/react";
import type { Form } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";

type FormPreferencesProps = {
  form: Form;
};

const FormPreferences: React.FC<FormPreferencesProps> = ({ form }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };
  const [formIntroEnabled, setFormIntroEnabled] = useState(false);
  return (
    <form className="flex w-1/4 flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col p-2">
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          {"Form Name"}
        </label>
        <input
          type={"text"}
          {...register("formName", { required: true })}
          placeholder="My cool form"
          className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
            errors.formName?.type === "required" && "dark:border-red-500"
          }`}
        />
        {errors.formName && <span className="text-white"></span>}
      </div>
      <div className="flex flex-col p-2">
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          {"Start Date"}
        </label>
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          type={"date"}
          {...register("startDate", { required: true })}
        />
        {errors.firstName && <span>{errors.firstName?.message as string}</span>}
      </div>
      <div className="flex flex-col p-2">
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          {"End Date"}
        </label>
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          type={"date"}
          {...register("endDate", { required: true })}
        />
        {errors.firstName && <span>{errors.firstName?.message as string}</span>}
      </div>
      <Switch
        checked={formIntroEnabled}
        onChange={setFormIntroEnabled}
        className={`${
          formIntroEnabled ? "bg-blue-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            formIntroEnabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
      <input
        className="mr-2 mb-2 cursor-pointer rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 duration-200 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
        type="submit"
      />
    </form>
  );
};

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const form = api.form.getForm.useQuery(
    { formId: formId as string },
    {
      enabled: !!formId,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-[#000000c7]">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#333] to-[#04050a]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {form.data ? <FormPreferences form={form.data} /> : null}
      </div>
    </main>
  );
};

export default FormContainer;
