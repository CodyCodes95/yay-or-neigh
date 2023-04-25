import { useEffect } from "react";
import type { Column } from "react-table";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { Menu, Transition } from "@headlessui/react";

type TableProps = {
  data: any;
  columns: Array<Column<any>>;
};

const Table: React.FC<TableProps> = ({ data, columns }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    gotoPage,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 15 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  return (
    <div>
      <div className="flex w-full justify-between items-center">
        <div className="relative">
          <Menu>
            <Menu.Button className="p-1">
              <button className="mr-2 rounded-md border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 duration-150 hover:bg-black hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white dark:focus:ring-gray-700">
                Actions
              </button>
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
                  <Menu.Item>{({ active }) => <p>Click me</p>}</Menu.Item>
                  <Menu.Item>{({ active }) => <p>Click me 2</p>}</Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <input
          type="text"
          className="py-1"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <table
        className="w-full text-left text-sm text-gray-500 dark:text-white"
        {...getTableProps()}
      >
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-[#212121] dark:text-gray-400">
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, i) => (
                <th
                  className="px-6 py-3 text-center"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={i}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                className="border-b bg-white text-center dark:border-gray-700 dark:bg-[#333]"
                {...row.getRowProps()}
                key={i}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <td className="px-4 py-3" {...cell.getCellProps()} key={i}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <nav
        className="flex items-center justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {1 + pageIndex * pageSize}-{page.length + pageIndex * pageSize}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {data.length}
          </span>
        </span>
        <ul className="inline-flex items-center -space-x-px">
          <li onClick={previousPage}>
            <a className="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </li>
          {[
            pageIndex - 2,
            pageIndex - 1,
            pageIndex,
            pageIndex + 1,
            pageIndex + 2,
          ]
            .filter((pageNo) => pageNo > 0 && pageNo <= pageOptions.length)
            .map((page) => {
              return (
                <li
                  key={page}
                  onClick={() => {
                    gotoPage(page - 1);
                  }}
                >
                  <a className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    {page}
                  </a>
                </li>
              );
            })}
          <li onClick={nextPage}>
            <a
              href="#"
              className="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Table;
