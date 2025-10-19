// app/about/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
// NOTE: GITHUB_TOKEN import 삭제, Repo 인터페이스만 사용
import { Repo } from '@/types/about'

// 🛑 환경 변수에서 직접 가져와 클라이언트에서 사용합니다.
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Jannerf-43'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''

// ----------------------------------------------------
// TypeScript - GitHub API 응답 타입 정의
// ----------------------------------------------------
interface GithubRepoApiResponse {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  html_url: string
}

// ----------------------------------------------------
// 1. GitHub API 호출 설정 (토큰 직접 사용)
// ----------------------------------------------------

const GITHUB_BASE_URL = 'https://api.github.com'

// 리포지토리 목록을 가져오는 함수 (클라이언트에서 토큰을 직접 사용)
const fetchGithubRepos = async (
  username: string,
  token: string
): Promise<Repo[]> => {
  const API_URL = `${GITHUB_BASE_URL}/users/${username}/repos?type=public&sort=updated`

  if (!username || !token) {
    console.error('GitHub username or token is missing.')
    return []
  }

  try {
    const response = await fetch(API_URL, {
      headers: {
        // ⚠️ 클라이언트에서 토큰을 사용하여 인증 (보안 위험)
        Authorization: `token ${token}`,
        'User-Agent': 'Next.js App',
      },
      // 캐싱 설정 (1시간마다 재검증)
      next: { revalidate: 3600 },
    })

    // Rate Limit 초과 등 오류 발생 시 상태 코드 확인
    if (!response.ok) {
      console.error(
        `GitHub API Error: ${response.status} ${response.statusText}. Rate Limit may be exceeded.`
      )
      return []
    }

    const data: GithubRepoApiResponse[] = await response.json()

    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description provided.',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      url: repo.html_url,
    }))
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return []
  }
}

// ----------------------------------------------------
// 2. 메인 컴포넌트 및 로직
// ----------------------------------------------------

export default function AboutPage() {
  const { isLoaded, user } = useUser()
  const [repos, setRepos] = useState<Repo[]>([])
  const [isLoadingRepos, setIsLoadingRepos] = useState(true)

  // 리포지토리 목록 가져오기
  useEffect(() => {
    // GITHUB_USERNAME과 GITHUB_TOKEN을 클라이언트에서 직접 사용
    if (isLoaded && GITHUB_USERNAME && GITHUB_TOKEN) {
      setIsLoadingRepos(true)
      fetchGithubRepos(GITHUB_USERNAME, GITHUB_TOKEN)
        .then((data) => setRepos(data))
        .finally(() => setIsLoadingRepos(false))
    } else if (isLoaded) {
      setIsLoadingRepos(false)
    }
  }, [isLoaded])

  // 로딩 상태 처리 (Clerk user info)
  if (!isLoaded) {
    return (
      <div className="text-center p-12 text-lg text-gray-500 bg-white rounded-xl shadow-lg">
        인증 정보를 불러오는 중...
      </div>
    )
  }

  // GitHub 아이콘 (SVG 컴포넌트)
  const GithubIcon = ({
    size = 24,
    className = 'text-gray-800',
  }: {
    size?: number
    className?: string
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.676.084-.676 1.205.084 1.839 1.237 1.839 1.237 1.07 1.836 2.809 1.305 3.492.998.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.796 24 17.293 24 12 24 5.373 18.627 0 12 0z" />
    </svg>
  )

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 1. 내 소개에 대한 큰 문구 */}
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-center">
        개발자 소개 및 활동 내역 🧑‍💻
      </h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
        안녕하세요! 이 블로그를 운영하는 개발자입니다. 저의 프로필과 주로
        활동하는 GitHub 리포지토리들을 소개합니다.
      </p>

      {/* 2. 개인 프로필 정보 */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
          개인 프로필 정보
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-40 text-gray-500 font-medium">이메일:</span>
            <span className="text-gray-900 font-semibold">
              {user?.primaryEmailAddress?.emailAddress || '이메일 정보 없음'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-40 text-gray-500 font-medium">
              GitHub 계정명:
            </span>
            <span className="text-blue-600 font-semibold flex items-center gap-2">
              <GithubIcon className="text-blue-600" />
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {GITHUB_USERNAME}
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* 3 & 4. GitHub 리포지토리 목록 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            주요 GitHub 리포지토리
          </h2>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-700 transition flex items-center gap-2 shadow-md"
            aria-label={`${GITHUB_USERNAME} 님의 GitHub 프로필로 이동`}
          >
            <GithubIcon size={18} className="text-white" />
            GitHub로 이동
          </a>
        </div>

        {/* GitHub API 로딩 처리 */}
        {isLoadingRepos ? (
          <div className="text-center p-10 text-lg text-gray-500 flex justify-center items-center gap-2 bg-gray-50 rounded-xl">
            <svg
              className="animate-spin h-5 w-5 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            리포지토리 목록을 불러오는 중입니다...
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center p-10 text-lg text-gray-500 bg-gray-50 rounded-xl">
            GitHub 유저({GITHUB_USERNAME})의 공개 리포지토리를 찾을 수 없거나
            API 요청에 실패했습니다. (토큰({GITHUB_TOKEN.substring(0, 4)}...)을
            확인해주세요.)
          </div>
        ) : (
          <div className="space-y-6">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <Link href={`/about/${repo.name}`} passHref>
                    <h3 className="text-xl font-bold text-blue-700 cursor-pointer hover:underline">
                      {repo.name}
                    </h3>
                  </Link>
                </div>

                <p className="text-gray-700 text-sm mb-4 min-h-[40px]">
                  {repo.description}
                </p>

                <div className="flex space-x-6 text-gray-600 text-sm mt-3">
                  <div className="flex items-center gap-1.5">
                    <span role="img" aria-label="Stars" className="text-lg">
                      ⭐
                    </span>
                    <span className="font-semibold">{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span role="img" aria-label="Forks" className="text-lg">
                      🍴
                    </span>
                    <span className="font-semibold">{repo.forks}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span role="img" aria-label="Watchers" className="text-lg">
                      👀
                    </span>
                    <span className="font-semibold">{repo.watchers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
