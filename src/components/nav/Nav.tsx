import { signIn, signOut, useSession } from "next-auth/react";
import { FaSignOutAlt, FaUserAlt } from "react-icons/fa";

const Nav = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex h-10 w-full items-center justify-between bg-black p-3">
      <div></div>
      {sessionData ? (
        <FaSignOutAlt
          onClick={() => void signOut()}
          className="cursor-pointer text-white"
        />
      ) : (
        <FaUserAlt
          onClick={() => void signIn("discord")}
          className="cursor-pointer text-white"
        />
      )}
    </div>
  );
};

export default Nav;
