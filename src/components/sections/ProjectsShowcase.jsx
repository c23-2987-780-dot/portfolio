import { featuredProjects, projects } from '@/lib/content.js'
import { DevHint } from '@/components/ui/DevHint.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import Button from '@/components/ui/Button.jsx'
import { Stagger, StaggerItem } from '@/components/ui/Reveal.jsx'
import ProjectCard from '@/components/projects/ProjectCard.jsx'

const items = featuredProjects(3)

/** Home: up to three featured OJT projects, with a link to the full list. */
export default function ProjectsShowcase() {
  if (!items.length && !import.meta.env.DEV) return null

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="wrap">
        <SectionHeading
          title="OJT projects"
          action={
            projects.length > items.length && (
              <Button to="/projects" variant="secondary" arrow>
                All projects
              </Button>
            )
          }
        >
          What I worked on during my on-the-job training.
        </SectionHeading>

        {items.length ? (
          <Stagger as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {items.map((project) => (
              <StaggerItem as="li" key={project.slug}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <DevHint>
            No projects yet. Add a folder under <code>src/assets/works/projects/</code> and an entry
            in <code>src/data/projects.js</code>.
          </DevHint>
        )}
      </div>
    </section>
  )
}
