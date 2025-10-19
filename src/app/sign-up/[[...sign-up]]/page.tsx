import { SignUp } from '@clerk/nextjs'
import React from 'react'

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center py-10">
      {/* Clerk의 SignIn 컴포넌트를 렌더링합니다. 
        [[...sign-in]] 경로는 Clerk이 내부적으로 사용하는 모든 인증 경로를 처리합니다.
      */}
      <SignUp />
    </div>
  )
}
