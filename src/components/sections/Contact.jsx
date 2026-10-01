import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, MapPin, Send } from 'lucide-react'
import { profile } from '@/data/profile.js'
import { cn } from '@/lib/utils.js'
import { ease, spring } from '@/lib/motion.js'
import Button from '@/components/ui/Button.jsx'
import { Reveal } from '@/components/ui/Reveal.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import SocialIcon from '@/components/ui/SocialIcon.jsx'
import Toast from '@/components/ui/Toast.jsx'

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Tell me your name.'
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email so I can reply.'
  if (message.trim().length < 10)
    errors.message = 'A few more words, please (at least 10 characters).'
  return errors
}

/** Floating-label field with an animated, announced error. */
function Field({ label, name, multiline = false, error, ...rest }) {
  const id = useId()
  const errorId = `${id}-error`
  const Control = multiline ? 'textarea' : 'input'

  return (
    <div>
      <div className="relative">
        <Control
          id={id}
          name={name}
          placeholder=" "
          rows={multiline ? 5 : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'peer block w-full rounded-lg border bg-surface-2/60 px-4 pt-6 pb-2.5 text-base transition-colors duration-300 outline-none placeholder:text-transparent focus:border-accent',
            error ? 'border-bad' : 'border-line',
            multiline && 'min-h-36 resize-y',
          )}
          {...rest}
        />
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-4 origin-left text-muted transition-all duration-300 ease-lamp',
            multiline ? 'top-6' : 'top-1/2 -translate-y-1/2',
            'peer-focus:top-3 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-accent-text',
            'peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-75',
          )}
        >
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-1.5 px-1 text-sm text-bad"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function SentPanel({ onReset, viaMail }) {
  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
      className="grid min-h-96 place-items-center text-center"
    >
      <div>
        <motion.svg
          viewBox="0 0 52 52"
          fill="none"
          className="mx-auto size-20 text-ok"
          aria-hidden="true"
        >
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease }}
          />
          <motion.path
            d="M15 27l8 8 14-17"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.5 }}
          />
        </motion.svg>
        <h3 className="mt-6 text-h3">{viaMail ? 'Your email app is opening' : 'Message sent'}</h3>
        <p className="mx-auto mt-2 max-w-xs text-muted">
          {viaMail
            ? 'Press send there and it will reach me.'
            : 'Thanks for writing. I will get back to you soon.'}
        </p>
        <Button variant="secondary" className="mt-8" onClick={onReset}>
          Send another
        </Button>
      </div>
    </motion.div>
  )
}

function ContactForm() {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | mailto | error

  const clearError = (name) => errors[name] && setErrors((e) => ({ ...e, [name]: undefined }))

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (data.get('company')) return // honeypot: real people never see this field

    const values = {
      name: data.get('name') ?? '',
      email: data.get('email') ?? '',
      message: data.get('message') ?? '',
    }
    const found = validate(values)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      form.elements[firstInvalid]?.focus()
      return
    }

    if (!ENDPOINT) {
      const subject = `Portfolio message from ${values.name}`
      const body = `${values.message}\n\n— ${values.name} (${values.email})`
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus('mailto')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const sent = status === 'sent' || status === 'mailto'

  return (
    <div className="card rounded-xl p-6 md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <SentPanel viaMail={status === 'mailto'} onReset={() => setStatus('idle')} />
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <Field
              label="Your name"
              name="name"
              autoComplete="name"
              error={errors.name}
              onChange={() => clearError('name')}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              error={errors.email}
              onChange={() => clearError('email')}
            />
            <Field
              label="Message"
              name="message"
              multiline
              error={errors.message}
              onChange={() => clearError('message')}
            />
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={status === 'sending'}
                icon={status === 'sending' ? undefined : Send}
              >
                {status === 'sending' ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending
                  </>
                ) : (
                  'Send message'
                )}
              </Button>
              {status === 'error' && (
                <p role="alert" className="text-sm text-bad">
                  That didn&rsquo;t go through. Try again, or email me directly.
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function CopyEmail({ email, onCopied }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      onCopied?.()
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <motion.button
      type="button"
      onClick={copy}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className="group inline-flex items-center gap-4 rounded-lg border border-line py-2.5 pr-3 pl-5 transition-colors hover:border-accent/70"
    >
      <span className="text-sm">{email}</span>
      <span className="grid size-8 place-items-center rounded-md bg-surface-2 transition-colors group-hover:bg-accent group-hover:text-on-accent">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'done' : 'copy'}
            initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0, rotate: 40 }}
            transition={{ duration: 0.2 }}
            className="grid place-items-center"
          >
            {copied ? (
              <Check className="size-4 text-ok group-hover:text-on-accent" />
            ) : (
              <Copy className="size-4" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{copied ? 'Email copied to clipboard' : 'Copy email address'}</span>
    </motion.button>
  )
}

export default function Contact() {
  const [toast, setToast] = useState(false)

  const flashToast = () => {
    setToast(true)
    window.setTimeout(() => setToast(false), 2200)
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            index="05"
            kicker="Contact"
            title="Let&rsquo;s make something"
            accent="together"
          />
          <Reveal as="p" className="max-w-md text-lg text-muted">
            Looking for an intern, a junior developer or someone to design your next poster? Send a
            note and I will reply soon.
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <CopyEmail email={profile.email} onCopied={flashToast} />
          </Reveal>

          {profile.location && (
            <Reveal delay={0.15} className="mt-6 flex items-center gap-2 text-muted">
              <MapPin className="size-4 text-accent-text" aria-hidden="true" />
              {profile.location}
            </Reveal>
          )}

          {profile.socials.length > 0 && (
            <Reveal delay={0.2} className="mt-8">
              <ul className="flex flex-wrap gap-3">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <motion.a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={s.label}
                      whileHover={{ y: -3, scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      transition={spring}
                      className="grid size-12 place-items-center rounded-lg border border-line text-xl transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
                    >
                      <SocialIcon name={s.icon} />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <ContactForm />
        </Reveal>
      </div>

      <Toast open={toast}>Email copied to clipboard</Toast>
    </section>
  )
}
