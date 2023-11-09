import {
  FaChartLine,
  FaCheck,
  FaCog,
  FaEnvelope,
  FaFlag,
  FaHome,
  FaReceipt,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import Link from "next/link";
import {LuSwords} from "react-icons/lu";

type AdminWrapperProps = {
  children: React.ReactNode;
};
const AdminWrapper = (props: AdminWrapperProps) => {
  return (
    <div className={"bg-gray-800 min-h-screen h-full"}>
      <nav className="fixed top-0 z-50 w-full border-b bg-gray-800 border-gray-700 md:hidden">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                onClick={() => {
                  const sidebar = document.getElementById("logo-sidebar");
                  if (sidebar) {
                    if (sidebar.classList.contains("sidebar-open")) {
                      sidebar.classList.remove("sidebar-open");
                      sidebar.classList.add("translate-x-0"); // hide
                      sidebar.classList.add("sm:translate-x-0");
                      return;
                    }
                    const hasNormalTranslate =
                      sidebar.classList.contains("translate-x-0");
                    const hasSmTranslate =
                      sidebar.classList.contains("sm:translate-x-0");
                    if (hasNormalTranslate || hasSmTranslate) {
                      sidebar.classList.remove("translate-x-0");
                      sidebar.classList.remove("sm:translate-x-0");
                      sidebar.classList.add("sidebar-open");
                    }
                    /*
                    const a = sidebar.classList.toggle("translate-x-0");
                    const b = sidebar.classList.toggle("sm:translate-x-0");
                    log({ a, b });
                     */
                  }
                }}
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link href="/" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white hover-circle">
                  Admin
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 md:pt-4 transition-transform -translate-x-full border-r sm:translate-x-0 bg-gray-800 border-gray-700 sidebar-open"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/"
                className="flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700"
              >
                <FaHome
                  className={
                    "w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white "
                  }
                />
                <span className="ml-3 hover-circle">Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/players/"
                className="flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700"
              >
                <FaUsers
                  className={
                    "w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white "
                  }
                />
                <span className="ml-3 hover-circle">Players</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/matches/"
                className="flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700"
              >
                <LuSwords
                  className={
                    "w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white "
                  }
                />
                <span className="ml-3 hover-circle">Matches</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-8 mt-12 md:mt-0 sm:ml-64 text-white">{props.children}</div>
    </div>
  );
};

export default AdminWrapper;
