export interface SiteContent {
  id: number
  hero_greeting: string
  hero_name: string
  hero_tagline: string
  about_paragraph_1: string
  about_paragraph_2: string
  contact_blurb: string
  contact_email: string
  contact_phone: string
  cv_url: string | null
  updated_at: string
}

export interface Service {
  slug: string          // '01' | '02' | '03'
  title: string
  description: string
  tags: string[]
  updated_at: string
}

export interface Project {
  id: string
  service_slug: string
  title: string | null
  image_url: string     // Supabase Storage public URL
  display_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  quote: string
  avatar_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}
