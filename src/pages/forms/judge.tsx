import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { SubmissionWithImages } from "~/types/prismaRelations";
import { api } from "~/utils/api";

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [previousSubmission, setPreviousSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [nextSubmission, setNextSubmission] =
    useState<SubmissionWithImages | null>(null);
  const submissionOne = api.submission.getUnjudgedSubmissions.useQuery(
    {
      formId: formId as string,
      offset: 0,
    },
    {
      enabled: false,
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

  useEffect(() => {
    if (formId) {
      submissionOne.refetch();
      submissionTwo.refetch();
    }
  }, [formId]);

  useEffect(() => {
    if (
      currentSubmission === null &&
      submissionOne.data &&
      submissionTwo.data
    ) {
      setCurrentSubmission(submissionOne.data);
      setNextSubmission(submissionTwo.data);
    }
  }, [submissionOne, submissionTwo, currentSubmission]);

  useEffect(() => {
    console.log(previousSubmission, currentSubmission, nextSubmission);
  }, [previousSubmission, currentSubmission, nextSubmission]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#04050a]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {currentSubmission ? (
          <>
            <div className="flex max-h-[50vh] w-2/3 rounded-lg bg-[#333] p-4">
              <img
                className=" max-h-[50vh] object-cover"
                src={currentSubmission.Image[0].url}
                alt={`${currentSubmission?.email} Image`}
              />
              <div className="flex w-1/2 flex-col overflow-auto">
                <div className="flex w-full">
                  <p className="">Email:</p>
                  <p>{currentSubmission.email}</p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};

export default FormContainer;
