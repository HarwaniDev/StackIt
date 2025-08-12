"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Bell } from "lucide-react";
import React from "react";
import type { SessionContextValue } from "next-auth/react";

interface Notification {
  message: string;
  createdAt: string;
  slug: string;
}

interface HeaderProps {
  session: SessionContextValue;
  notificationCount?: number;
  notifications?: Notification[];
  onClearNotifications?: () => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
  children?: React.ReactNode;
}

export default function Header({ session, notificationCount = 0, notifications = [], onClearNotifications, onSignIn, onSignOut, children }: HeaderProps) {
  return (
    <header className="border-b bg-white text-black">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-black hover:opacity-80">
              StackIt
            </Link>
            {children}
          </div>
          {session?.data?.user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-black hover:bg-gray-100 cursor-pointer">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white">
                  {notifications.length === 0 ? (
                    <DropdownMenuItem className="bg-white hover:bg-gray-50">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-black">No notifications</p>
                      </div>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {notifications.map((notification, idx) => (
                        <DropdownMenuItem key={idx} className="bg-white hover:bg-gray-50">
                          <Link href={`/question/${notification.slug}`} className="w-full">
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-medium text-black">{notification.message}</p>
                              <p className="text-xs text-gray-600">{notification.createdAt}</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem className="bg-white hover:bg-gray-50 flex justify-center">
                        <Button variant="outline" className="w-full cursor-pointer" onClick={onClearNotifications}>
                          Clear All
                        </Button>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 cursor-pointer">
                    <Avatar className="h-8 w-8 ring-2 ring-gray-300">
                      <img src={session.data.user.image ?? ""} alt="" />
                      {/* <AvatarFallback className="bg-orange-500 text-white">{session.user.name ? session.user.name[0] : ""}</AvatarFallback> */}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white ">
                  <DropdownMenuItem className="bg-white hover:bg-gray-50 text-black cursor-pointer">
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="bg-white hover:bg-gray-50 text-black cursor-pointer" onClick={onSignOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button variant="ghost" className="text-black hover:bg-gray-100" onClick={onSignIn}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 