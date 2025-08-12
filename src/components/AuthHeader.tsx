"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthHeader() {
  const session = useSession();
  
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-black hover:opacity-80">
              StackIt
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="text-black hover:bg-gray-100 cursor-pointer" 
                onClick={() => {
                  !session.data?.user 
                    ? signIn("google", { callbackUrl: "http://localhost:3000/home" }) 
                    : signOut({ callbackUrl: "http://localhost:3000" })
                }}
              >
                {!session.data?.user ? "Sign In" : "Sign Out"}
              </Button>
            </Link>
            <Link href="/home">
              <Button className="bg-black text-white hover:bg-black/90 cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
