import { type FormWithFields } from "~/types/prismaRelations";
import { useForm } from "react-hook-form";
import { BsCameraFill } from "react-icons/bs";
import Compressor from "compressorjs";
import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Spacer from "./Spacer";

type FormProps = {
  form: FormWithFields;
};

const Form: React.FC<FormProps> = ({ form }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(0);

  const createSubmission = api.submission.createSubmission.useMutation();
  const uploadImage = api.image.uploadSubmissionImage.useMutation();

  const handleImageAttach = (e: any) => {
    Array.from(e.target.files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (onLoadEvent: any) => {
        setImages((imageState: string[]) => [
          ...imageState,
          onLoadEvent.target.result,
        ]);
      };
      new Compressor(file, {
        quality: 0.6,
        maxHeight: 1422,
        maxWidth: 800,
        success(result) {
          reader.readAsDataURL(result);
        },
      });
    });
  };

  const onSubmit = async (data: any) => {
    if (!images.length) {
      toast.error("Please attach at least one image");
      return;
    }
    setIsLoading(true);
    delete data.file;
    const submission = await createSubmission.mutateAsync({
      formId: form.id,
      email,
      fields: Object.entries(data).map(([key, value]) => ({
        fieldId: key,
        value: value as string,
      })),
    });
    if (submission) {
      const imagePromises = images.map(async (image: string) => {
        return await uploadImage.mutateAsync({
          image: image,
          submissionId: submission.id,
        });
      });
      await Promise.all(imagePromises);
      setSubmitted(true);
    }
  };

  if (page === 0) {
    return (
      <motion.div
        className="container text-gray-300"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>
          Hey there! Thank you for your interest in displaying your vehicle at
          Status, CH. IV. We encourage you to clearly and sufficiently fill in
          all sections below in order to assist us in selecting a diverse and
          quality range of vehicles.
        </p>
        <Spacer amount={6} />
        <p>
          Before completing the application form, please read the information
          below:
        </p>
        <Spacer amount={6} />
        <p>Event Date/Time: 10/12/22 from 3PM to 9PM</p>
        <p>Event Location: PICA, Port Melbourne</p>
        <Spacer amount={6} />
        <p>
          All vehicles participating in the show must undergo the selection
          process. We value quality over quantity and this process allows us to
          narrow the selection down to 150 vehicles for CH. IV. Our focus is to
          showcase stance, however, all build styles are welcome. Your vehicle
          must be presentable with genuine parts, we do not support replica
          parts!!!
        </p>
        <Spacer amount={6} />
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
        <Spacer amount={6} />
        <p>
          *Please outline and clarify future mods that you plan on completing
          before the show in the appropriate section.
        </p>
        <p>
          *Ensure that the email you provide is active and regularly checked as
          this is our preferred method of contact.
        </p>
        <p>
          *If the section of the form does not apply to you, please put “N/A” in
          the box provided.
        </p>
        <p>
          *When uploading photos of your vehicle either use the “link to HD
          photos” box or select “upload images” to manually select images from
          your device. Please ensure your images are clear and display your
          vehicle clearly from different angles. iPhone photos are acceptable.
        </p>
        <Spacer amount={6} />
        <p>
          Please don&apos;t hesitate to contact us via Facebook or Instagram if
          you have any questions or concerns!
        </p>
        <Spacer amount={6} />
        <button
          onClick={() => setPage(1)}
          className="mr-2 mb-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
        >
          Begin
        </button>
      </motion.div>
    );
  }

  if (page === 1) {
    return (
      <motion.div
        className="flex w-full flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className=" w-1/5 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <button
          onClick={() => setPage(2)}
          className="mt-6 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
        >
          Next
        </button>
      </motion.div>
    );
  }

  if (submitted)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-500">
          Your form for {form.name} has been successfully submitted.
        </p>
      </motion.div>
    );

  if (isLoading && page !== 2) {
    return (
      <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-[#000000c7]">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <form className="flex w-1/4 flex-col" onSubmit={handleSubmit(onSubmit)}>
      {isLoading ? (
        <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-[#000000c7]">
          <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
        </div>
      ) : null}
      {form.fields.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <div key={field.id} className="flex flex-col p-2">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  {field.name}
                </label>
                <input
                  key={field.id}
                  {...register(field.id, { required: field.required })}
                  placeholder={field.name}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                {errors[field.id] && (
                  <span>{errors[field.id]?.message as string}</span>
                )}
              </div>
            );
        }
      })}
      <div className="flex justify-between p-2">
        <BsCameraFill
          onClick={() => {
            document.getElementById("images-input")?.click();
          }}
          className="cursor-pointer text-3xl text-white hover:text-gray-200"
        ></BsCameraFill>
        <input
          hidden
          id="images-input"
          accept="image/*"
          type="file"
          multiple
          onChange={handleImageAttach}
        />
        <p className="text-white">{images.length} Images attached</p>
      </div>
      <input
        className="mr-2 mb-2 cursor-pointer rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 duration-200 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
        type="submit"
      />
    </form>
  );
};

export default Form;
