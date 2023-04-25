import type { Submission } from "@prisma/client";
import type { Image, Field } from "@prisma/client";
import { useEffect, useState } from "react";
import ImageCarousel from "~/components/carousel/ImageCarousel";
import Spacer from "./Spacer";
import { api } from "~/utils/api";

type SubmissionData = {
  fieldId: string;
  value: string;
};

type SubmissionProps = {
  submission: Submission & {
    Image: Image[];
  };
};

const JudgeSubmission: React.FC<SubmissionProps> = ({ submission }) => {
  const [currentFieldValues, setCurrentFieldValues] = useState<any>([]);

  const fields = api.form.getFields.useQuery(
    {
      formId: submission.formId as string,
    },
    {
      enabled: !!submission.formId,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (typeof submission.data === "object" && Array.isArray(submission.data)) {
      setCurrentFieldValues(submission.data);
    }
  }, [submission]);

  const onJudge = (approved: boolean) => 1 + 1;

  const onDefer = () => 1 + 1;

  return (
    <>
      <div className="flex max-h-[66vh] w-full items-center rounded-lg bg-[#333] p-4">
        <ImageCarousel images={submission.Image} />
        <Spacer amount={2} />
        <div className="flex max-h-[66vh] w-1/2 flex-col overflow-auto text-white">
          <div className="flex items-center justify-center p-2">
            <p className="ml-2 text-xl font-bold text-white">
              {submission.email}
            </p>
          </div>
          {currentFieldValues.map((field: SubmissionData) => (
            <div className="flex p-2" key={field.fieldId}>
              <p className="w-1/4 min-w-[25%] break-words font-medium text-gray-900 dark:text-white">
                {fields.data?.find((x) => x.id === field.fieldId)?.name}
              </p>
              <p className="ml-2 text-gray-400">{field.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className=" flex w-1/6 flex-col justify-around">
        <div className="flex w-full justify-between">
          <button
            onClick={() => {
              onJudge(false);
            }}
            className="mr-2 mb-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
          >
            No
          </button>
          <button
            onClick={() => {
              onJudge(true);
            }}
            className="mr-2 mb-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800"
          >
            Yes
          </button>
        </div>
        <Spacer amount={3} />
        <button
          onClick={onDefer}
          className="mr-2 mb-2 rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
        >
          Defer
        </button>
      </div>
    </>
  );
};

export default JudgeSubmission;
