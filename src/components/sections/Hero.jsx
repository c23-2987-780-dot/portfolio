import { motion } from 'motion/react'
import { Download } from 'lucide-react'
import heroPicture from '@/assets/profile/profile-picture.jpeg?w=480;800;1080&format=avif;webp&withoutEnlargement&as=picture'
import { profile } from '@/data/profile.js'
import { techStack } from '@/data/techStack.js'
import { stats } from '@/lib/content.js'
import { ease } from '@/lib/motion.js'
import { useTilt } from '@/hooks/useTilt.js'
import ArchFrame from '@/components/ui/ArchFrame.jsx'
import Button from '@/components/ui/Button.jsx'
import CountUp from '@/components/ui/CountUp.jsx'
import Marquee from '@/components/ui/Marquee.jsx'
import Picture from '@/components/ui/Picture.jsx'
import TechIcon from '@/components/ui/TechIcon.jsx'

const STATS = [
  { label: 'Pubmats', value: stats.pubmats },
  { label: 'OJT projects', value: stats.projects },
  { label: 'Tools', value: stats.tools },
].filter((s) => s.value > 0)

/** The portrait in its arch. It leans a few degrees toward the cursor on desktop. */
function Portrait() {
  const tilt = useTilt({ max: 4 })

  return (
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="mx-auto w-full max-w-[24rem] lg:max-w-none"
    >
      <motion.div style={tilt.style} {...tilt.handlers}>
        <ArchFrame>
          <div className="aspect-[3/4]">
            <Picture
              picture={heroPicture}
              alt={profile.photoAlt}
              eager
              sizes="(min-width: 1024px) 26rem, 80vw"
            />
          </div>
        </ArchFrame>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-36">
      {/* The one gradient on the site: a faint lamp-gold glow behind the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-48 size-[46rem] rounded-full"
        style={{ background: 'radial-gradient(closest-side, var(--hint), transparent)' }}
      />

      <div className="relative wrap grid items-center gap-12 pb-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          {profile.availability && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line py-1.5 pr-3.5 pl-3 text-sm text-muted"
            >
              <span className="relative grid size-2.5 place-items-center" aria-hidden="true">
                <span
                  className="absolute size-full rounded-full bg-ok"
                  style={{ animation: 'ping-ring 2.2s ease-out infinite' }}
                />
                <span className="relative size-2 rounded-full bg-ok" />
              </span>
              {profile.availability}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            className="text-display font-bold"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="mt-4 text-xl font-medium text-accent-text md:text-2xl"
          >
            {profile.title}
          </motion.p>

          {/* Static on purpose: this is the largest text block, so animating it in would delay LCP. */}
          <p className="mt-5 max-w-xl text-lg text-muted">{profile.tagline}</p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button to={{ pathname: '/', hash: 'pubmats' }} size="lg" arrow magnetic>
              View my work
            </Button>
            {profile.resume ? (
              <Button href={profile.resume} download variant="secondary" size="lg" icon={Download}>
                Résumé
              </Button>
            ) : (
              <Button to={{ pathname: '/', hash: 'contact' }} variant="secondary" size="lg">
                Get in touch
              </Button>
            )}
          </motion.div>

          {STATS.length > 0 && (
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease, delay: 0.35 }}
              className="mt-10 flex gap-10 border-t border-line pt-6"
            >
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm text-muted">{s.label}</dt>
                  <dd className="text-4xl font-semibold tracking-tight">
                    <CountUp value={s.value} />
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>

        <div className="lg:col-span-5">
          <Portrait />
        </div>
      </div>

      <div className="relative border-y border-line py-5">
        <Marquee duration={46}>
          {techStack.map((tool) => (
            <span key={tool.name} className="inline-flex items-center gap-2.5 text-sm text-muted">
              <TechIcon name={tool.icon} label={tool.name} className="text-base text-accent-text" />
              {tool.name}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
