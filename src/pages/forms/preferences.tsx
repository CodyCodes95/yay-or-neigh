import { Switch } from "@headlessui/react";
import type { Form } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { OutputData } from "@editorjs/editorjs";
import Spacer from "~/components/Spacer";

type FormPreferencesProps = {
  form: Form;
};

const FormPreferences: React.FC<FormPreferencesProps> = ({ form }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const EditorBlock = dynamic(() => import("../../components/Editor"), {
    ssr: false,
  });

  const [data, setData] = useState<OutputData>();
  const [showPreview, setShowPreview] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
  };
  const [formIntroEnabled, setFormIntroEnabled] = useState(false);
  return (
    <form
      className="flex w-full flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      {showPreview ? (
        <div
          onClick={() => setShowPreview(false)}
          className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-[#000000c7]"
        >
          <motion.div
            className="container text-gray-300"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>
              Hey there! Thank you for your interest in displaying your vehicle
              at Status, CH. IV. We encourage you to clearly and sufficiently
              fill in all sections below in order to assist us in selecting a
              diverse and quality range of vehicles.
            </p>
            <Spacer amount={4} />
            <p>
              Before completing the application form, please read the
              information below:
            </p>
            <Spacer amount={4} />
            <p>Event Date/Time: 10/12/22 from 3PM to 9PM</p>
            <p>Event Location: PICA, Port Melbourne</p>
            <Spacer amount={4} />
            <p>
              All vehicles participating in the show must undergo the selection
              process. We value quality over quantity and this process allows us
              to narrow the selection down to 150 vehicles for CH. IV. Our focus
              is to showcase stance, however, all build styles are welcome. Your
              vehicle must be presentable with genuine parts, we do not support
              replica parts!!!
            </p>
            <Spacer amount={4} />
            <p>Status, CH. IV Vehicle Application Important Dates:</p>
            <p>04/09/22: Round 1 applications open</p>
            <p>
              02/10/22: Round 1 application results sent out and round 2
              applications open
            </p>
            <p>06/11/22: Round 2 application results sent out</p>
            <p>
              27/11/22: Pending vehicles must be finalised and be given final
              outcome
            </p>
            <Spacer amount={4} />
            <p>
              *Please outline and clarify future mods that you plan on
              completing before the show in the appropriate section.
            </p>
            <p>
              *Ensure that the email you provide is active and regularly checked
              as this is our preferred method of contact.
            </p>
            <p>
              *If the section of the form does not apply to you, please put
              “N/A” in the box provided.
            </p>
            <p>
              *When uploading photos of your vehicle either use the “link to HD
              photos” box or select “upload images” to manually select images
              from your device. Please ensure your images are clear and display
              your vehicle clearly from different angles. iPhone photos are
              acceptable.
            </p>
            <Spacer amount={4} />
            <p>
              Please don&apos;t hesitate to contact us via Facebook or Instagram
              if you have any questions or concerns!
            </p>
            <Spacer amount={4} />
          </motion.div>
        </div>
      ) : null}
      <div className="flex w-3/4 flex-col p-2">
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
      <div className="flex w-3/4 flex-col p-2">
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
      <div className="flex w-3/4 flex-col p-2">
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
      <div className="flex w-3/4 text-gray-400">
        <p>Custom landing page</p>
        <Switch
          checked={formIntroEnabled}
          onChange={setFormIntroEnabled}
          className={`${
            formIntroEnabled ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${
              formIntroEnabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>
      <Spacer amount={2} />
      {formIntroEnabled ? (
        <div className="">
          <EditorBlock
            data={data}
            onChange={(e: any) => console.log(e)}
            holder="editorjs-container"
          />
          <Spacer amount={2} />
          <button
            onClick={() => setShowPreview(true)}
            className="mr-2 mb-2 rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          >
            Preview
          </button>
        </div>
      ) : null}
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
