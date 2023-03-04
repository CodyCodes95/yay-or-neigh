import { signIn, signOut, useSession } from "next-auth/react";
import {
  FaUserAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaWpforms,
} from "react-icons/fa";
import { Menu } from "@headlessui/react";
import Link from "next/link";

const Nav = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex h-10 w-full items-center justify-between bg-black p-3">
      <div></div>
      {sessionData ? (
        // <FaSignOutAlt
        //   onClick={() => void signOut()}
        //   className="cursor-pointer text-white"
        // />
        <div className="relative">
          <Menu>
            <Menu.Button className="p-1">
              <FaUserAlt className="text-white" />
            </Menu.Button>
            <Menu.Items
              className={"absolute top-8 right-[-10px] flex flex-col"}
            >
              <div className="w-32 rounded-md bg-gray-600 py-1 text-white">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={` flex w-full items-center p-2 rounded-lg duration-150 ${
                        active ? "bg-blue-500" : "bg-gray-600"
                      }`}
                      href="/myforms"
                    >
                      <FaWpforms className="text-white mr-2" />
                      My Forms
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={` flex w-full cursor-pointer items-center p-2 rounded-lg duration-150 ${
                        active ? "bg-blue-500" : "bg-gray-600"
                      }`}
                      onClick={() => void signOut()}
                    >
                      <FaSignOutAlt className="mr-2"/>
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      ) : (
        <FaSignInAlt
          onClick={() => void signIn("discord")}
          className="cursor-pointer text-white"
        />
      )}
    </div>
  );
};

export default Nav;
