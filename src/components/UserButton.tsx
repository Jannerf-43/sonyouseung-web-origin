'use client'

import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'

export default function UserButtons() {
  return (
    <div className="flex items-center space-x-4">
      <SignedIn>
        <UserButton afterSignOutUrl="/sign-in" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium shadow-md text-sm">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  )
}
