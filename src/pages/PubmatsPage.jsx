import { pubmatFilters, pubmats } from '@/lib/content.js'
import { DevHint } from '@/components/ui/DevHint.jsx'
import PageHeader from '@/components/ui/PageHeader.jsx'
import Seo from '@/components/ui/Seo.jsx'
import PubmatGallery from '@/components/gallery/PubmatGallery.jsx'

export default function PubmatsPage() {
  return (
    <>
      <Seo
        title="Pubmats"
        description="Every pubmat: posters, social graphics, announcements and event materials."
      />
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="wrap">
          <PageHeader title="Pubmats">
            Posters and graphics for school events, observances and announcements. Filter by type,
            then select a piece to view it full size.
          </PageHeader>

          {pubmats.length ? (
            <PubmatGallery
              items={pubmats}
              categories={pubmatFilters}
              filterable
              pageSize={12}
              priority
            />
          ) : (
            <DevHint>
              No pubmats yet. Drop PNGs into <code>src/assets/works/pubmats/</code>.
            </DevHint>
          )}
        </div>
      </section>
    </>
  )
}
