"use client";

import { MoonStar, Sun, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logoWhite from "@/public/LogoWhite.png";
import logoBlack from "@/public/LogoBlack.png";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { customLogout } from "@/services/authservices";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/industries", label: "Industries" },
  { href: "/testimonials", label: "Testimonials" },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, refetch } = useAuth();

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode =
      localStorage.getItem("darkMode") === "true" ||
      (!localStorage.getItem("darkMode") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    if (isDarkMode) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await customLogout();
      await refetch();
      setLogoutModal(false);
      router.push("/auth/login");
    } catch {
      setLogoutModal(false);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (!mounted) return <>{children}</>;

  return (
    <>
      <nav className="w-full  bg-white/85 dark:bg-black/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}  
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src={isDark ? logoWhite : logoBlack}
                alt="Company Logo"
                height={100}
                width={100}
                className="h-9 md:h-15 w-auto object-contain"
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-9">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative text-sm tracking-widest text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 py-1.5
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-gray-900 dark:after:bg-gray-100 after:rounded-sm after:transition-all after:duration-300 hover:after:w-full"
                >
                  {label}
                </Link>
              ))}

              {/* Dot separator */}
              <span className="w-1 h-1 rounded-full  bg-gray-400 dark:bg-gray-700 inline-block" />

              {/* Auth: logout button (only when logged in) */}
              {!loading && user && (
                <button
                  onClick={() => setLogoutModal(true)}
                  className="flex items-center gap-1.5 text-sm font-normal cursor-pointer text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                  aria-label="Logout"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              )}

              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-[34px] h-[34px] rounded-full cursor-pointer text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/7 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <MoonStar size={16} />}
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-[34px] h-[34px] rounded-full cursor-pointer text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/7 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <MoonStar size={16} />}
              </button>
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="flex items-center justify-center w-[34px] h-[34px] rounded-lg text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/7 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white/97 dark:bg-black/97 backdrop-blur-md ${
            menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 pb-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block text-[1.05rem] font-light tracking-widest uppercase text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 py-3.5 border-b border-black/7 dark:border-white/7 last:border-none hover:pl-2 transition-all duration-200"
              >
                {label}
              </Link>
            ))}

            {/* Mobile logout */}
            {!loading && user && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutModal(true);
                }}
                className="flex items-center gap-2 w-full text-[1.05rem] font-light tracking-widest uppercase text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 py-3.5 hover:pl-2 transition-all duration-200"
              >
                <LogOut size={15} />
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {children}

      {/* Logout confirmation modal */}
      <ConfirmModal
        open={logoutModal}
        title="Log out?"
        description="You'll be signed out of your account and redirected to the login page."
        confirmLabel="Log out"
        cancelLabel="Stay"
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutModal(false)}
      />
    </>
  );
}