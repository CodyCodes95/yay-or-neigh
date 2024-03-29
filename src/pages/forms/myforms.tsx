import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaListUl } from "react-icons/fa";
import { FiGrid, FiLink, FiSettings } from "react-icons/fi";
import Spacer from "~/components/Spacer";
import { api } from "~/utils/api";
import { getRelativeDays } from "~/utils/formats";

const FormContainer: NextPage = () => {
  const [displayType, setDisplayType] = useState<"grid" | "list">("grid");
  const myForms = api.form.getMyForms.useQuery();

  if (!myForms.data) {
    return (
      <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#111] to-[#04050a]">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center  bg-gradient-to-b from-[#111] to-[#04050a]">
      <div className="container flex flex-col items-center gap-12 px-4 py-16 text-gray-400">
        <div className="flex w-3/4 items-center justify-between">
          <input
            className="w-3/4 border-2 border-gray-500 bg-black p-2"
            type="text"
            placeholder="Search"
          />
          <div className="flex border-2 border-gray-500 p-1">
            <span
              onClick={() => setDisplayType("grid")}
              className={`group cursor-pointer rounded-sm p-1 px-2 ${
                displayType === "grid" ? "bg-[#333]" : ""
              }`}
            >
              <FiGrid className="text-lg duration-150 group-hover:text-white" />
            </span>
            <span
              onClick={() => setDisplayType("list")}
              className={`group cursor-pointer rounded-sm p-1 px-2 ${
                displayType === "grid" ? "" : "bg-[#333]"
              }`}
            >
              <FaListUl className=" text-lg duration-150 group-hover:text-white" />
            </span>
          </div>
          <button className="mr-2 rounded-md border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 duration-150 hover:bg-black hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white dark:focus:ring-gray-700">
            Create New
          </button>
        </div>
        <div className="w-3/4">
            <div className={`${displayType === "grid" ? "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4" : "first-letter:"}`}>
              {myForms.data?.map((form) => (
                <div
                  key={form.id}
                  className="flex flex-col rounded-md border-2 border-[#333] bg-black"
                >
                  <div className="flex h-44 flex-col p-3">
                    <div className="flex w-full items-center justify-between">
                      <h4 className="text-white">{form.name}</h4>
                      <div className="flex">
                        <span
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/forms?formId=${form.id}`
                            );
                            toast.success("Copied to clipboard");
                          }}
                          className="cursor-pointer rounded-lg bg-[#333] p-2"
                        >
                          <FiLink />
                        </span>
                        <Spacer amount={1} />
                        <Link
                          href={`/forms/builder?formId=${form.id}`}
                          className="cursor-pointer rounded-lg bg-[#333] p-2"
                        >
                          <FiSettings />
                        </Link>
                      </div>
                    </div>
                    <p className="p-1 text-sm">
                      {form.submissions.length} Submission
                      {form.submissions.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex w-full">
                      <p className="p-1 text-sm">
                        Created {getRelativeDays(form.createdAt)}
                      </p>
                      <p className="p-1 text-sm">
                        Closes {getRelativeDays(form.endDate)}
                      </p>
                    </div>
                    <div className="mt-1 flex h-full w-full items-center justify-around py-2">
                      <Link
                        className="p-2 hover:bg-[#333] duration-100"
                        href={`/forms/judge?formId=${form.id}`}
                      >
                        Judge
                      </Link>
                      <Link
                        className="p-2 hover:bg-[#333] duration-100"
                        href={`/forms/submissions?formId=${form.id}`}
                      >
                        All Submissions
                      </Link>
                      <Link
                        className="p-2 hover:bg-[#333] duration-100"
                        target={"_blank"}
                        href={`/forms?formId=${form.id}`}
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </main>
  );
};

export default FormContainer;
