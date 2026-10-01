import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { profile } from '@/data/profile.js'
import { ease } from '@/lib/motion.js'
import BackToTop from '@/components/layout/BackToTop.jsx'
import Footer from '@/components/layout/Footer.jsx'
import Navbar from '@/components/layout/Navbar.jsx'
import PageLoader from '@/components/layout/PageLoader.jsx'
import PageTransition from '@/components/layout/PageTransition.jsx'
import ScrollManager from '@/components/layout/ScrollManager.jsx'
import ScrollProgress from '@/components/layout/ScrollProgress.jsx'
import ThemeProvider from '@/components/layout/ThemeProvider.jsx'
import Home from '@/pages/Home.jsx'
import NotFound from '@/pages/NotFound.jsx'

// Everything except Home is split into its own chunk and loaded on first visit.
const loadPubmats = () => import('@/pages/PubmatsPage.jsx')
const loadProjects = () => import('@/pages/ProjectsPage.jsx')
const loadProjectDetail = () => import('@/pages/ProjectDetailPage.jsx')
const PubmatsPage = lazy(loadPubmats)
const ProjectsPage = lazy(loadProjects)
const ProjectDetailPage = lazy(loadProjectDetail)

/** Once the browser is idle, fetch the other pages so navigating to them is instant. */
function usePrefetchPages() {
  useEffect(() => {
    const run = () => [loadPubmats, loadProjects, loadProjectDetail].forEach((load) => load())
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 5000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(run, 2500)
    return () => window.clearTimeout(id)
  }, [])
}

const SITE_URL = (import.meta.env.VITE_SITE_URL || profile.site.url).replace(/\/$/, '')

const page = (element) => (
  <PageTransition>
    <Suspense fallback={<PageLoader />}>{element}</Suspense>
  </PageTransition>
)

function Shell() {
  const location = useLocation()
  usePrefetchPages()

  return (
    <div className="relative min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-medium focus:text-on-accent"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <ScrollManager />
      <Navbar />

      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={page(<Home />)} />
            <Route path="/pubmats" element={page(<PubmatsPage />)} />
            <Route path="/projects" element={page(<ProjectsPage />)} />
            <Route path="/projects/:slug" element={page(<ProjectDetailPage />)} />
            <Route path="*" element={page(<NotFound />)} />
          </Routes>
        </AnimatePresence>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
      <BackToTop />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          url: SITE_URL,
          email: profile.email,
          sameAs: profile.socials.map((s) => s.href),
        })}
      </script>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user" transition={{ ease }}>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  )
}
