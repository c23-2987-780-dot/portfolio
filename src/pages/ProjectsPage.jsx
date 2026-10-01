import { projects } from '@/lib/content.js'
import { DevHint } from '@/components/ui/DevHint.jsx'
import PageHeader from '@/components/ui/PageHeader.jsx'
import Seo from '@/components/ui/Seo.jsx'
import { Stagger, StaggerItem } from '@/components/ui/Reveal.jsx'
import ProjectCard from '@/components/projects/ProjectCard.jsx'

export default function ProjectsPage() {
  return (
    <>
      <Seo
        title="Projects"
        description="Apps and tools built during on-the-job training: problem, build and outcome."
      />
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="wrap">
          <PageHeader title="OJT projects">
            What I worked on during my on-the-job training.
          </PageHeader>

          {projects.length ? (
            <Stagger as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {projects.map((project) => (
                <StaggerItem as="li" key={project.slug}>
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <DevHint>
              No projects yet. Add an entry in <code>src/data/projects.js</code>.
            </DevHint>
          )}
        </div>
      </section>
    </>
  )
}
