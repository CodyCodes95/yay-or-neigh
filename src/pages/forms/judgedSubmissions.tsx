import type { Submission } from "@prisma/client";
import { useRouter } from "next/router";
import { useMemo } from "react";
import type { Column } from "react-table";
import Table from "~/components/Table";
import { api } from "~/utils/api";

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
    ],
    []
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#04050a] text-gray-500">
      <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
        {submissions.data?.length && (
          <Table data={submissions.data} columns={columns} />
        )}
      </div>
    </main>
  );
};

export default JudgedSubmissions;
