import { featuredPubmats, pubmats } from '@/lib/content.js'
import { DevHint } from '@/components/ui/DevHint.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import Button from '@/components/ui/Button.jsx'
import PubmatGallery from '@/components/gallery/PubmatGallery.jsx'

const items = featuredPubmats(8)

/** Home: a curated masonry of pubmats (those flagged `featured`), with a link to the full gallery. */
export default function PubmatsShowcase() {
  if (!items.length && !import.meta.env.DEV) return null

  return (
    <section id="pubmats" className="scroll-mt-24 py-20 md:py-28">
      <div className="wrap">
        <SectionHeading
          title="Pubmats"
          action={
            pubmats.length > items.length && (
              <Button to="/pubmats" variant="secondary" arrow>
                View all {pubmats.length}
              </Button>
            )
          }
        >
          Posters and graphics for school events, observances and announcements. Select a piece to
          view it full size.
        </SectionHeading>

        {items.length ? (
          <PubmatGallery items={items} />
        ) : (
          <DevHint>
            No pubmats yet. Drop PNGs into <code>src/assets/works/pubmats/</code> and they appear
            here.
          </DevHint>
        )}
      </div>
    </section>
  )
}
