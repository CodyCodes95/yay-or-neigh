import type { Field } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Form from "~/components/Form";
import { api } from "~/utils/api";

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const form = api.form.getForm.useQuery(
    { formId: formId as string },
    {
      onSuccess: (data) => {
        setFields(data?.fields as Field[]);
      },
      enabled: !!formId,
    }
  );
  const [fields, setFields] = useState<Field[]>([]);
  return (
    <main className="flex min-h-screen justify-start bg-gradient-to-b from-[#333] to-[#04050a]">
      {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "></div> */}
      <div className="m-12 flex w-1/4 flex-col text-gray-200">
        <div className="mb-6 border p-4 shadow-xl">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            My field
          </label>
          <input
            placeholder="Text field"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 border p-4 shadow-xl">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Large input
          </label>
          <input
            type="text"
            placeholder="Large text field"
            className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-1/4 flex-col justify-center">
          {fields?.map((field) => {
            switch (field.type) {
              case "text":
                return (
                  <div key={field.id} className="flex flex-col p-2">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      {field.name}
                    </label>
                    <input
                      key={field.id}
                      placeholder={field.name}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    />
                  </div>
                );
            }
          })}
        </div>
      </div>
    </main>
  );
};

export default FormContainer;
