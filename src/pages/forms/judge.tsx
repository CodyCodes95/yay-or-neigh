import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Spacer from "~/components/Spacer";
import type { SubmissionWithImages } from "~/types/prismaRelations";
import { api } from "~/utils/api";
import useEmblaCarousel from "embla-carousel-react";
import {
  DotButton,
  PrevButton,
  NextButton,
} from "../../components/carousel/EmblaCarouselArrowsDotsButtons";

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [previousSubmission, setPreviousSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [nextSubmission, setNextSubmission] =
    useState<SubmissionWithImages | null>(null);
  const [carouselRef, emblaApi] = useEmblaCarousel();
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
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

    const scrollPrev = useCallback(
      () => emblaApi && emblaApi.scrollPrev(),
      [emblaApi]
    );
    const scrollNext = useCallback(
      () => emblaApi && emblaApi.scrollNext(),
      [emblaApi]
    );
    const scrollTo = useCallback(
      (index: number) => emblaApi && emblaApi.scrollTo(index),
      [emblaApi]
    );
  
    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setPrevBtnEnabled(emblaApi.canScrollPrev());
      setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
      if (!emblaApi) return;
      onSelect();
      setScrollSnaps(emblaApi.scrollSnapList());
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);
    }, [emblaApi, setScrollSnaps, onSelect]);

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
      <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
        {currentSubmission && fields.data ? (
          <>
            <div className="flex max-h-[66vh] w-3/4 items-center rounded-lg bg-[#333] p-4">
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
                  <div className="relative w-full flex items-center justify-center">
                    {scrollSnaps.map((_, index) => (
                      <DotButton
                        key={index}
                        selected={index === selectedIndex}
                        onClick={() => scrollTo(index)}
                      />
                    ))}
                </div>
              </div>
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
          </>
        ) : null}
      </div>
    </main>
  );
};

export default FormContainer;
