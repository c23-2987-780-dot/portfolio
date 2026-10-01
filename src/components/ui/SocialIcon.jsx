import {
  TbBrandBehance,
  TbBrandDribbble,
  TbBrandFacebook,
  TbBrandGithub,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandTiktok,
} from 'react-icons/tb'
import { Link2, Mail } from 'lucide-react'

const ICONS = {
  github: TbBrandGithub,
  linkedin: TbBrandLinkedin,
  instagram: TbBrandInstagram,
  behance: TbBrandBehance,
  facebook: TbBrandFacebook,
  dribbble: TbBrandDribbble,
  tiktok: TbBrandTiktok,
  email: Mail,
}

export default function SocialIcon({ name, className }) {
  const Icon = ICONS[name] ?? Link2
  return <Icon className={className} aria-hidden="true" />
}
