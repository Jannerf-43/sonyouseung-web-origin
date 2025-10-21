import Link from 'next/link'
import { Repo } from '@/types/about'

// 환경변수에서 깃허브 이름과 토큰 불러오기
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Jannerf-43'
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
const GITHUB_BASE_URL = 'https://api.github.com'

const fetchGithubRepos = async (
  username: string,
  token: string
): Promise<Repo[]> => {
  if (!username || !token) return []

  const res = await fetch(
    `${GITHUB_BASE_URL}/users/${username}/repos?type=public&sort=updated`,
    {
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'Next.js App',
      },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) return []

  interface GithubRepoApiResponse {
    id: number
    name: string
    description: string | null
    stargazers_count: number
    forks_count: number
    watchers_count: number
    html_url: string
  }

  const data = (await res.json()) as GithubRepoApiResponse[]

  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description || 'No description provided.',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    url: repo.html_url,
  }))
}

export default async function AboutPage() {
  const repos = await fetchGithubRepos(GITHUB_USERNAME, GITHUB_TOKEN)

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-center">
        나의 소개 및 활동 내역 🧑‍💻
      </h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
        안녕하세요. 중부대학교 재학중인 손유승입니다. 자주 사용하는 애칭은
        Jannerf 입니다. 밑엔 제 github 주소와 접근 링크들이 있습니다.
      </p>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            GitHub 리포지토리
          </h2>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-700 transition flex items-center gap-2 shadow-md"
          >
            GitHub로 이동
          </a>
        </div>

        {repos.length === 0 ? (
          <div className="text-center p-10 text-lg text-gray-500 bg-gray-50 rounded-xl">
            GitHub 유저({GITHUB_USERNAME})의 공개 리포지토리를 찾을 수 없습니다.
          </div>
        ) : (
          <div className="space-y-6">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
              >
                <Link href={`/about/${repo.name}`} passHref>
                  <h3 className="text-xl font-bold text-blue-700 cursor-pointer hover:underline">
                    {repo.name}
                  </h3>
                </Link>
                <p className="text-gray-700 text-sm mb-4 min-h-[40px]">
                  {repo.description}
                </p>
                <div className="flex space-x-6 text-gray-600 text-sm mt-3">
                  <div className="flex items-center gap-1.5">
                    ⭐ {repo.stars}
                  </div>
                  <div className="flex items-center gap-1.5">
                    🍴 {repo.forks}
                  </div>
                  <div className="flex items-center gap-1.5">
                    👀 {repo.watchers}
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
