export const runtime = 'nodejs'

import { clerkMiddleware } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import { UserProfile } from '@/models/UserProfile'

export default clerkMiddleware(async (auth) => {
  const { userId } = await auth()

  if (userId) {
    await connectDB()

    const existing = await UserProfile.findOne({ clerkUserId: userId })

    if (!existing) {
      await UserProfile.create({
        clerkUserId: userId,
        role: 'basic',
      })
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
