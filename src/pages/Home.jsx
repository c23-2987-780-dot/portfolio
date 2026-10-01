import Seo from '@/components/ui/Seo.jsx'
import Hero from '@/components/sections/Hero.jsx'
import PubmatsShowcase from '@/components/sections/PubmatsShowcase.jsx'
import ProjectsShowcase from '@/components/sections/ProjectsShowcase.jsx'
import About from '@/components/sections/About.jsx'
import TechStack from '@/components/sections/TechStack.jsx'
import Contact from '@/components/sections/Contact.jsx'

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <PubmatsShowcase />
      <ProjectsShowcase />
      <About />
      <TechStack />
      <Contact />
    </>
  )
}
