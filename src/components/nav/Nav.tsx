import { signIn, signOut, useSession } from "next-auth/react";
import {
  FaUserAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaWpforms,
} from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
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
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items
                className={"absolute top-2 right-[-10px] flex flex-col"}
              >
                <div className="w-32 rounded-md bg-gray-600 py-1 text-white">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        className={` flex w-full items-center rounded-lg p-2 ${
                          active ? "bg-blue-500" : "bg-gray-600"
                        }`}
                        href="/forms/myforms"
                      >
                        <FaWpforms className="mr-2 text-white" />
                        My Forms
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={` flex w-full cursor-pointer items-center rounded-lg p-2 ${
                          active ? "bg-blue-500" : "bg-gray-600"
                        }`}
                        onClick={() => void signOut()}
                      >
                        <FaSignOutAlt className="mr-2" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
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
