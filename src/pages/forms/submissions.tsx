import type { Submission } from "@prisma/client";
import { useRouter } from "next/router";
import { useMemo } from "react";
import type { Column } from "react-table";
import Table from "~/components/Table";
import { api } from "~/utils/api";
import { FaWpforms } from "react-icons/fa";

const JudgedSubmissions = () => {
  const router = useRouter();
  const { formId } = router.query;

  const submissions = api.submission.getAllSubmissions.useQuery(
    {
      formId: formId as string,
    },
    {
      enabled: !!formId,
      refetchOnWindowFocus: false,
    }
  );

  const columns = useMemo<Array<Column<Submission>>>(
    () => [
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Result",
        accessor: "approved",
        Cell: ({ value }) => {
          if (value === null) {
            return <p>Pending</p>;
          }
          return value ? (
            <p className="text-green-500">Approved</p>
          ) : (
            <p className="text-red-500">Rejected</p>
          );
        },
      },
      {
        Header: "Submission Date",
        accessor: (d) => new Date(d.createdAt).toLocaleDateString(),
      },
      {
        Header: "Submission",
        accessor: (d) => (
            <FaWpforms className="text-white w-5 cursor-pointer h-5 inline"/>

        ),
      },
    ],
    []
  );

  return (
    <main className="flex min-h-screen flex-col items-center  bg-gradient-to-b from-[#111] to-[#04050a] text-gray-500">
      <div className="container flex flex-col gap-12 px-4 py-16 ">
        {submissions.data?.length && (
          <Table data={submissions.data} columns={columns} />
        )}
      </div>
    </main>
  );
};

export default JudgedSubmissions;
