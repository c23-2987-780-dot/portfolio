import { motion } from 'motion/react'
import { ease } from '@/lib/motion.js'
import Button from '@/components/ui/Button.jsx'
import Seo from '@/components/ui/Seo.jsx'

/** 404 for unknown routes and unknown project slugs. */
export default function NotFound({ what = 'page' }) {
  return (
    <>
      <Seo title="Not found" description="This page doesn't exist." />
      <section className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[clamp(5rem,20vw,9rem)] leading-none font-bold tracking-tighter text-accent-text"
          >
            404
          </motion.p>
          <h1 className="mt-6 text-h3">That {what} isn&rsquo;t here.</h1>
          <p className="mx-auto mt-3 max-w-sm text-muted">
            It may have moved, or the link has a typo.
          </p>
          <Button to="/" size="lg" className="mt-8" arrow>
            Back to the start
          </Button>
        </div>
      </section>
    </>
  )
}
