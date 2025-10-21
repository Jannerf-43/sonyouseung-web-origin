import { notFound } from 'next/navigation'

export interface Post {
  slug: string
  title: string
  category: 'Python' | 'Next.js & React' | '개발 트렌드' | '일상 & 생각'
  date: string
  excerpt: string
  content: string
}

const DUMMY_POSTS: Post[] = [
  {
    slug: 'ai-development-future',
    title: '2026년 AI 개발 트렌드 전망',
    category: '개발 트렌드',
    date: '2025-10-20',
    excerpt:
      'LLM의 발전과 Edge AI의 확산 등 다가올 개발 환경 변화를 예측합니다.',
    content:
      '인공지능 기술은 빠르게 발전하고 있으며, 개발자들은 끊임없이 새로운 도구와 패러다임을 익혀야 합니다.',
  },
  {
    slug: 'daily-coding-routine',
    title: '효율적인 코딩 루틴 만들기',
    category: '일상 & 생각',
    date: '2025-10-19',
    excerpt: '집중력을 높이고 번아웃을 방지하는 나만의 코딩 습관 공유.',
    content:
      '매일 일정한 시간에 코딩을 시작하고 짧은 휴식을 자주 취하는 것이 중요합니다.',
  },
  {
    slug: 'nextjs-app-router-guide',
    title: 'Next.js App Router 101: 기본 가이드',
    category: 'Next.js & React',
    date: '2025-10-18',
    excerpt:
      'Next.js의 새로운 App Router 구조와 서버/클라이언트 컴포넌트 사용법을 정리했습니다.',
    content: `## Next.js App Router 개요
    Next.js 13부터 도입된 App Router는 React Server Components를 기반으로 하며, 데이터 패칭 방식과 라우팅 시스템에 큰 변화를 가져왔습니다. 
    
    ### 주요 개념
    1.  **Server Components:** 서버에서 렌더링됩니다.
    2.  **Client Components:** 브라우저에서 상호작용성(useState, useEffect 등)이 필요할 때 사용됩니다.
    
    App Router는 개발의 유연성과 성능 최적화를 동시에 제공합니다.`,
  },
  {
    slug: 'python-data-structures',
    title: '파이썬 핵심 자료 구조 5가지',
    category: 'Python',
    date: '2025-10-17',
    excerpt:
      '리스트, 딕셔너리, 튜플, 셋의 기본적인 사용법과 성능을 비교 분석합니다.',
    content:
      '파이썬 프로그래밍의 효율성을 높이는 가장 기본적인 단계는 적절한 자료 구조를 선택하는 것입니다.',
  },
  {
    slug: 'web-assembly-intro',
    title: 'WebAssembly (Wasm) 입문',
    category: '개발 트렌드',
    date: '2025-10-16',
    excerpt: '웹 환경에서 C/C++ 같은 언어를 실행하는 Wasm의 기본 원리.',
    content: 'WebAssembly는 웹의 성능 한계를 뛰어넘기 위해 등장한 기술입니다.',
  },
  {
    slug: 'react-hooks-deep-dive',
    title: 'React Hooks: useEffect 대신 use-what?',
    category: 'Next.js & React',
    date: '2025-10-15',
    excerpt:
      '더 이상 복잡한 useEffect에 의존하지 않고 상태를 관리하는 최신 React 방법론을 소개합니다.',
    content: `
        <p>React 개발에서 흔히 발생하는 side effect 관리의 어려움을 줄이는 새로운 Hooks 사용 패턴에 대한 자세한 내용입니다. 11111
        
        <a 
            href="https://www.naver.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="color: #4f46e5; text-decoration: underline; font-weight: 600;"
        >
            네이버
        </a>링크 시험. (수정됨)</p>
    `,
  },
  {
    slug: 'webserverprograming',
    title: '웹서버보안프로그래밍 실습',
    category: '개발 트렌드',
    date: '2025-10-21',
    excerpt: '중부대학교 재학중 웹서버보안프로그래밍 실습의 결과를 소개합니다.',
    content: `
        <p>웹서버보안프로그래밍 실습을 진행하며 Next.js 를 사용하여 만든 실습 웹서버 사이트의 경로 입니다. 
        <br>
        웹서버 사이트 주소 : http://celrk-web-2.vercel.app
        <br>
        
        <a 
            href="//celrk-web-2.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="color: #4f46e5; text-decoration: underline; font-weight: 600;"
        >
            실습링크 가기
        </a> 클릭하시오 </p>
    `,
  },
]

// 이름만 date인 string을 진짜 Date 타입으로 변환해서 정렬
export function getPosts(): Post[] {
  const sortedPosts = DUMMY_POSTS.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })
  return sortedPosts
}

export function getPostBySlug(slug: string): Post {
  const post = DUMMY_POSTS.find((p) => p.slug === slug)
  if (!post) {
    notFound()
  }
  return post
}
