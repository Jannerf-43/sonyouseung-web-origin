// src/lib/mongodb.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('환경변수 MONGODB_URI가 설정되지 않았습니다.')
}

// Next.js (hot reload) 환경에서 중복 연결을 막기 위한 글로벌 캐시 타입
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache
}

const cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
}

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      // 필요하면 옵션 추가 (mongoose 버전 따라 기본값이 좋아서 일단 비워둠)
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}
