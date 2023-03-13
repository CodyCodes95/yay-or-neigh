import next, { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ImageCarousel from "~/components/carousel/ImageCarousel";
import Spacer from "~/components/Spacer";
import type { SubmissionWithImages } from "~/types/prismaRelations";
import { api } from "~/utils/api";
import TinderCard from "react-tinder-card";

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [previousSubmission, setPreviousSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [nextSubmission, setNextSubmission] =
    useState<SubmissionWithImages | null>(null);
  const fields = api.form.getFields.useQuery(
    {
      formId: formId as string,
    },
    {
      enabled: !!formId,
    }
  );
  const submissionOne = api.submission.getUnjudgedSubmissions.useQuery(
    {
      formId: formId as string,
      offset: 0,
    },
    {
      onSuccess: (data) => {
        setCurrentSubmission(data as SubmissionWithImages);
      },
      enabled: !!formId,
    }
  );
  const submissionTwo = api.submission.getUnjudgedSubmissions.useQuery(
    {
      formId: formId as string,
      offset: 1,
    },
    {
      enabled: false,
    }
  );

  const onSwipe = (direction: any) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier: any) => {
    console.log(myIdentifier + " left the screen");
  };

  // useEffect(() => {
  //   if (formId) {
  //     submissionOne.refetch();
  //     submissionTwo.refetch();
  //   }
  // }, [formId]);

  // useEffect(() => {
  //   if (currentSubmission === null && submissionOne.data) {
  //     setCurrentSubmission(submissionOne.data as SubmissionWithImages);
  //   }
  // }, [submissionOne, currentSubmission]);
  // // useEffect(() => {
  // //   if (
  // //     currentSubmission === null &&
  // //     submissionOne.data &&
  // //     submissionTwo.data
  // //   ) {
  // //     setCurrentSubmission(submissionOne.data as SubmissionWithImages);
  // //     setNextSubmission(submissionTwo.data as SubmissionWithImages);
  // //   }
  // // }, [submissionOne, submissionTwo, currentSubmission]);

  // useEffect(() => {
  //   console.log(previousSubmission, currentSubmission, nextSubmission);
  // }, [previousSubmission, currentSubmission, nextSubmission]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#04050a] text-gray-500">
      <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
        {currentSubmission && fields.data ? (
          <>
            <TinderCard
              onSwipe={onSwipe}
              onCardLeftScreen={() => onCardLeftScreen("fooBar")}
              preventSwipe={["right", "left"]}
            >
              <div className="flex max-h-[66vh] w-full items-center rounded-lg bg-[#333] p-4">
                <ImageCarousel images={currentSubmission.Image} />
                <Spacer amount={2} />
                <div className="flex max-h-[66vh] w-1/2 flex-col overflow-auto text-white">
                  <div className="flex items-center justify-center p-2">
                    <p className="ml-2 text-xl font-bold text-white">
                      {currentSubmission.email}
                    </p>
                  </div>
                  {currentSubmission.data.map((field) => (
                    <div className="flex p-2" key={field.fieldId}>
                      <p className="w-1/4 min-w-[25%] break-words font-medium text-gray-900 dark:text-white">
                        {fields.data.find((x) => x.id === field.fieldId)?.name}
                      </p>
                      <p className="ml-2 text-gray-400">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TinderCard>
          </>
        ) : (
          <div className="fixed left-0 top-0 flex h-[screen] w-screen items-center justify-center bg-gradient-to-b from-[#111] to-[#04050a]">
            <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <div className=" flex w-1/6 flex-col justify-around">
          <div className="flex w-full justify-between">
            <button className="mr-2 mb-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900">
              No
            </button>
            <button className="mr-2 mb-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800">
              Yes
            </button>
          </div>
          <Spacer amount={3} />
          <button className="mr-2 mb-2 rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800">
            Defer
          </button>
        </div>
      </div>
    </main>
  );
};

export default FormContainer;
