export interface Repo {
  id: number
  name: string
  description: string
  stars: number
  forks: number // '공유 수' 대신 Fork 수를 사용
  watchers: number // '뷰 횟수' 대신 Watcher 수를 사용
  url: string // 리포지토리 링크
}

// GitHub Content API 응답 타입 (파일, 디렉토리)
export interface RepoContent {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url: string | null
  html_url: string
}

// 디렉토리/파일 목록 상태 관리를 위한 인터페이스
export interface DirectoryState {
  isOpen: boolean
  repoName: string
  repoOwner: string
  contents: RepoContent[]
  isLoading: boolean
  error: string | null
  currentPath: string // 현재 탐색 중인 디렉토리 경로 (루트는 빈 문자열)
}
