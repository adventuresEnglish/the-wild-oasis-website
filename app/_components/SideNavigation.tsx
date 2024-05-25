"use client";
//import { headers } from "next/headers";
import { usePathname } from "next/navigation";
import { NAV } from "../_lib/constants";
import SignOutButton from "./SignOutButton";

function SideNavigation() {
  //const pathname = headers().get("x-url");
  const pathname = usePathname();
  return (
    <nav className="border-r border-primary-900">
      <ul className="flex flex-col gap-2 h-full text-lg">
        {NAV.map((link) => (
          <li key={link.name}>
            <a
              className={`py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 ${
                //pathname?.endsWith(link.href) ? "bg-primary-900" : ""
                pathname === link.href ? "bg-primary-900" : ""
              }`}
              href={link.href}>
              {link.icon}
              <span>{link.name}</span>
            </a>
          </li>
        ))}

        <li className="mt-auto">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
