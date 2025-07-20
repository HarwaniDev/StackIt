"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Bell } from "lucide-react";
import React from "react";
import type { Session } from "next-auth";
import type { SessionContextValue } from "next-auth/react";

interface HeaderProps {
  session: SessionContextValue;
  notificationCount?: number;
  onSignIn?: () => void;
  onSignOut?: () => void;
  children?: React.ReactNode;
}

export default function Header({ session, notificationCount = 0, onSignIn, onSignOut, children }: HeaderProps) {
  return (
    <header className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-100">
              StackIt
            </Link>
            {children}
          </div>
          {session?.data?.user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white">
                  <DropdownMenuItem className="bg-white hover:bg-gray-50">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-black">New answer on your question</p>
                      <p className="text-xs text-gray-600">Someone answered "How to join 2 columns..."</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-white/20">
                    <Avatar className="h-8 w-8 ring-2 ring-white/30">
                    <img src={session.data.user.image ?? ""} alt="" />
                      {/* <AvatarFallback className="bg-orange-500 text-white">{session.user.name ? session.user.name[0] : ""}</AvatarFallback> */}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem className="bg-white hover:bg-gray-50 text-black">
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="bg-white hover:bg-gray-50 text-black" onClick={onSignOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={onSignIn}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 