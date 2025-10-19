'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { RepoContent, DirectoryState } from '@/types/about'

// ----------------------------------------------------
// TypeScript - GitHub API 응답 타입 정의 (any 오류 해결)
// ----------------------------------------------------
interface GithubContentApiResponse {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url: string | null
  html_url: string
}

// ----------------------------------------------------
// 1. GitHub API 호출 함수 (Repo Contents)
// ----------------------------------------------------

const GITHUB_BASE_URL = 'https://api.github.com'
const GITHUB_USERNAME = 'Jannerf-43'

// 특정 리포지토리의 디렉토리/파일 내용을 가져오는 함수
const fetchRepoContents = async (
  owner: string,
  repo: string,
  path: string = ''
): Promise<RepoContent[]> => {
  const API_URL = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/contents/${path}`

  try {
    const response = await fetch(API_URL, { cache: 'no-store' })
    if (!response.ok) {
      console.error(
        `Failed to fetch content: ${response.status} ${response.statusText}`
      )
      return []
    }

    // any 타입 대신 명시적으로 GithubContentApiResponse[] 사용
    const data: GithubContentApiResponse[] = await response.json()

    if (!Array.isArray(data)) return []

    return (
      data
        // 필터링 시 타입 가드 사용
        .filter(
          (item): item is GithubContentApiResponse =>
            item.type === 'file' || item.type === 'dir'
        )
        // item이 GithubContentApiResponse 타입이므로 map의 인자에 any 불필요
        .map((item) => ({
          name: item.name,
          path: item.path,
          type: item.type,
          download_url: item.download_url,
          html_url: item.html_url,
        }))
        // 디렉토리를 파일보다 먼저 정렬
        .sort((a: RepoContent, b: RepoContent) =>
          a.type === 'dir' && b.type === 'file' ? -1 : 1
        )
    )
  } catch (error) {
    console.error('Error fetching repository contents:', error)
    return []
  }
}

// ----------------------------------------------------
// 2. SVG 아이콘
// ----------------------------------------------------

// 폴더 아이콘 (간단한 SVG)
const FolderIcon = ({
  className = 'text-blue-500',
}: {
  className?: string
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.22A2 2 0 0 0 4.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>
)

// 파일 아이콘 (간단한 SVG)
const FileIcon = ({ className = 'text-gray-500' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 2H9a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
    <path d="M10 9h4" />
    <path d="M10 13h4" />
  </svg>
)

// ----------------------------------------------------
// 3. 메인 컴포넌트 및 로직
// ----------------------------------------------------

// params의 타입을 명확하게 정의
interface DetailPageParams {
  name: string
}

interface RepoDetailPageProps {
  params: DetailPageParams
}

export default function RepoDetailPage({ params }: RepoDetailPageProps) {
  // TypeScript 오류를 피하기 위해 'use' 훅 사용을 제거하고 직접 접근으로 되돌립니다.
  const repoName = params.name

  // DirectoryState 타입에서 필요 없는 필드(isOpen, repoOwner)를 제외하고 사용
  const [directoryState, setDirectoryState] = useState<
    Omit<DirectoryState, 'isOpen' | 'repoOwner'>
  >({
    repoName: repoName,
    contents: [],
    isLoading: true,
    error: null,
    currentPath: '',
  })

  // 디렉토리 내용 가져오기 함수 (재사용 가능한 콜백)
  const loadDirectoryContents = useCallback(
    async (path: string) => {
      setDirectoryState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        currentPath: path,
      }))

      const contents = await fetchRepoContents(GITHUB_USERNAME, repoName, path)

      setDirectoryState((prev) => ({
        ...prev,
        isLoading: false,
        contents: contents,
        error:
          contents.length === 0 && path === ''
            ? '리포지토리를 찾을 수 없거나 내용이 비어있습니다.'
            : null,
      }))
    },
    [repoName]
  ) // repoName이 변경될 때만 재생성

  // 초기 로드 시 또는 repoName 변경 시 루트 디렉토리 로드
  useEffect(() => {
    if (repoName) {
      loadDirectoryContents('')
    }
  }, [repoName, loadDirectoryContents])

  // 디렉토리 항목 클릭 핸들러 (탐색)
  const handleContentClick = useCallback(
    (content: RepoContent) => {
      if (content.type === 'dir') {
        // 디렉토리일 경우 새로운 경로로 내용 로드
        loadDirectoryContents(content.path)
      } else {
        // 파일일 경우 새 탭에서 GitHub 링크 열기
        window.open(content.html_url, '_blank')
      }
    },
    [loadDirectoryContents]
  )

  // 상위 디렉토리로 이동 (Go Back)
  const handleGoBack = useCallback(() => {
    const segments = directoryState.currentPath
      .split('/')
      .filter((s) => s.length > 0)
    segments.pop() // 마지막 세그먼트 제거
    const parentPath = segments.join('/') // 부모 경로 재구성

    loadDirectoryContents(parentPath)
  }, [loadDirectoryContents, directoryState.currentPath])

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        <Link
          href="/about"
          className="text-gray-500 hover:text-indigo-600 transition text-2xl font-bold"
        >
          &larr;
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 truncate">
          {repoName}
        </h1>
        <a
          href={`https://github.com/${GITHUB_USERNAME}/${repoName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-700 transition flex items-center gap-1.5 shadow-md"
        >
          GitHub에서 보기
        </a>
      </div>

      {/* 현재 경로 및 이동 버튼 */}
      <div className="p-4 bg-gray-100 rounded-xl mb-6 flex items-center gap-3 shadow-inner">
        <button
          onClick={handleGoBack}
          disabled={
            directoryState.currentPath === '' || directoryState.isLoading
          }
          className={`px-3 py-1 text-sm rounded-lg transition ${
            directoryState.currentPath === '' || directoryState.isLoading
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
        >
          &larr; 상위 폴더
        </button>
        <span className="text-sm text-gray-700 font-mono truncate">
          경로: {directoryState.currentPath || 'Root /'}
        </span>
      </div>

      {/* 디렉토리 내용 */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-2 min-h-[300px]">
        {directoryState.isLoading ? (
          <div className="text-center py-10 text-lg text-gray-500">
            <span className="animate-pulse">디렉토리 내용 로딩 중...</span>
          </div>
        ) : directoryState.error ? (
          <div className="text-center py-10 text-lg text-red-500">
            {directoryState.error}
          </div>
        ) : (
          directoryState.contents.map((content) => (
            <button
              key={content.path}
              onClick={() => handleContentClick(content)}
              className="w-full text-left p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 transition border border-gray-200"
            >
              <div className="flex items-center gap-3 truncate">
                {content.type === 'dir' ? <FolderIcon /> : <FileIcon />}
                <span
                  className={`text-base truncate ${
                    content.type === 'dir'
                      ? 'font-semibold text-gray-800'
                      : 'text-gray-600'
                  }`}
                >
                  {content.name}
                </span>
              </div>
              {content.type === 'file' && (
                <span className="text-xs text-blue-500">파일 보기 &rarr;</span>
              )}
            </button>
          ))
        )}
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        GitHub API를 통해 실시간으로 데이터를 가져오고 있습니다.
      </p>
    </div>
  )
}
