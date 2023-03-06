import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spacer from "~/components/Spacer";
import type { SubmissionWithImages } from "~/types/prismaRelations";
import { api } from "~/utils/api";
import useEmblaCarousel from "embla-carousel-react";

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [previousSubmission, setPreviousSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [nextSubmission, setNextSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [carouselRef] = useEmblaCarousel();
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
  const fields = api.form.getFields.useQuery(
    {
      formId: formId as string,
    },
    {
      enabled: !!formId,
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
      setCurrentSubmission(submissionOne.data as SubmissionWithImages);
      setNextSubmission(submissionTwo.data as SubmissionWithImages);
    }
  }, [submissionOne, submissionTwo, currentSubmission]);

  useEffect(() => {
    console.log(previousSubmission, currentSubmission, nextSubmission);
  }, [previousSubmission, currentSubmission, nextSubmission]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#04050a]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {currentSubmission && fields.data ? (
          <>
            <div className="flex max-h-[66vh] w-2/3 rounded-lg bg-[#333] p-4">
              <div className="embla w-2/3" ref={carouselRef}>
                <div className="embla__container">
                  {currentSubmission.Image.map((image) => (
                    <img
                      key={image.id}
                      className=" embla__slide max-h-[50vh] object-cover"
                      src={image.url}
                      alt={`${currentSubmission?.email} Image`}
                    />
                  ))}
                </div>
              </div>
              <Spacer amount={2} />
              <div className="flex w-full flex-col overflow-auto text-white">
                <div className="flex p-2">
                  <p className="block w-1/3 font-medium text-gray-900 dark:text-white">
                    Email:
                  </p>
                  <p className="ml-2 text-gray-400">
                    {currentSubmission.email}
                  </p>
                </div>
                {currentSubmission.data.map((field) => (
                  <div className="flex p-2" key={field.fieldId}>
                    <p className="block w-1/3 font-medium text-gray-900 dark:text-white">
                      {fields.data.find((x) => x.id === field.fieldId)?.name}
                    </p>
                    <p className="ml-2 text-gray-400">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};

export default FormContainer;
