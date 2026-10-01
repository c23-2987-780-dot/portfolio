import { Box, Code, Mail, MapPin, Palette, Sparkles } from 'lucide-react'
import { experience } from '@/data/experience.js'
import { profile } from '@/data/profile.js'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import Timeline from './Timeline.jsx'

const FOCUS_ICONS = { palette: Palette, code: Code, cube: Box }

export default function About() {
  const facts = [
    { icon: MapPin, label: 'Based in', value: profile.location },
    { icon: Sparkles, label: 'Status', value: profile.availability },
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  ].filter((f) => f.value)

  return (
    <section id="about" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <SectionHeading title="About me" />

          <div className="space-y-4 text-lg">
            {profile.about.intro.map((paragraph, i) => (
              <Reveal
                as="p"
                key={i}
                delay={i * 0.06}
                className={i === 0 ? 'text-fg' : 'text-muted'}
              >
                {paragraph}
              </Reveal>
            ))}
          </div>

          <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-3">
            {profile.about.focus.map((card) => {
              const Icon = FOCUS_ICONS[card.icon] ?? Sparkles
              return (
                <StaggerItem as="li" key={card.title}>
                  <div className="card group h-full rounded-xl p-5">
                    <span className="mb-4 grid size-10 place-items-center rounded-lg bg-surface-2 text-accent-text transition-colors duration-300 group-hover:bg-accent group-hover:text-on-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold">{card.title}</h3>
                    <p className="mt-1.5 text-sm leading-snug text-muted">{card.text}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>

          {facts.length > 0 && (
            <Reveal
              as="dl"
              className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-8 sm:grid-cols-3"
            >
              {facts.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="min-w-0">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <Icon className="size-4 text-accent-text" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="mt-1 break-words">
                    {href ? (
                      <a
                        href={href}
                        className="underline decoration-line underline-offset-4 hover:text-accent-text hover:decoration-accent"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </Reveal>
          )}
        </div>

        <div className="lg:col-span-5">
          <Reveal>
            <h3 className="mb-8 text-h3">Experience &amp; education</h3>
          </Reveal>
          <Timeline entries={experience} />
        </div>
      </div>
    </section>
  )
}
