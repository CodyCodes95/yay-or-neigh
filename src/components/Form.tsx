import { type FormWithFields } from "~/types/prismaRelations";
import { useForm } from "react-hook-form";
import { BsCameraFill } from "react-icons/bs";
import Compressor from "compressorjs";
import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

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
    const email = data.email;
    delete data.email;
    delete data.file;
    const submission = await createSubmission.mutateAsync({
      formId: form.id,
      email: email,
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

  return (
    <form className="flex w-1/4 flex-col" onSubmit={handleSubmit(onSubmit)}>
      {isLoading ? (
        <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-[#000000c7]">
          <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
        </div>
      ) : null}
      <div className="flex flex-col p-2">
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <input
          {...register("email", { required: true })}
          placeholder="Email"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
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
          className="text-3xl text-white cursor-pointer hover:text-gray-200"
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
