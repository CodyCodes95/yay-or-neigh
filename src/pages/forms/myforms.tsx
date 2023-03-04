import { type NextPage } from "next";
import { useRouter } from "next/router";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { api } from "~/utils/api";

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const myForms = api.form.getMyForms.useQuery();

  if (!myForms.data) {
    return (
      <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#15162c] to-[#04050a]">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center  bg-gradient-to-b from-[#111] to-[#04050a]">
      <div className="container flex flex-col items-center gap-12 px-4 py-16 text-gray-400">
        <div className="flex items-center w-3/4">
          <input className="border-2 w-3/4 border-gray-500 bg-black p-2" type="text" placeholder="Search" />
          <div className="flex">
            <BsFillGrid3X3GapFill />
            <AiOutlineUnorderedList />
                  </div>
                  <button>Create New</button>
        </div>
      </div>
    </main>
  );
};

export default FormContainer;
