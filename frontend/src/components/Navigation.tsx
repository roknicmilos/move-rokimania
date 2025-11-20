"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, History, Home, LogIn, UserPlus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";

const loggedInMenuItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: History },
] as const;

const loggedOutMenuItems = [
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/register", label: "Register", icon: UserPlus },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const [ open, setOpen ] = useState(false);
  const { user, logout, isLoading, refetchUser } = useUser();

  const menuItems = isLoading ? [] : user ? loggedInMenuItems : loggedOutMenuItems;

  const handleLinkClick = () => {
    refetchUser();
    setOpen(false);
  };

  const NavLinks = () => (
    <>
      {menuItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium transition-colors",
              isActive
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
            onClick={handleLinkClick}
          >
            <Icon className="h-5 w-5"/>
            {label}
          </Link>
        );
      })}
      {user && (
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            setOpen(false);
          }}
          className={
            "flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium" +
            " text-gray-700 hover:bg-gray-100 hover:text-gray-900 justify-start"
          }
        >
          <LogOut className="h-5 w-5"/>
          Log Out
        </Button>
      )}
    </>
  );

  return (
    <header
      className={
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur" +
        " supports-[backdrop-filter]:bg-white/80"
      }>
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold text-xl">
          <span className="hidden sm:inline-block">Move@Rokimania</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex gap-2">
            {menuItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink
                    asChild
                  >
                    <Link
                      href={href}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => refetchUser && refetchUser()}
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
            {user && (
              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  onClick={() => logout()}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-2"/>
                  Log Out
                </Button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6"/>
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 pt-12">
            <SheetHeader>
              <SheetTitle className="text-left text-2xl font-bold flex items-center gap-3">
                Move@Rokimania
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-2">
              <NavLinks/>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
