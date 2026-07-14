import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import { Trash2, ArrowUp, ArrowDown, Upload, ImageIcon } from 'lucide-react'

// Import codebase default assets to enable seeding
import BrandImg1 from "@/assets/Brand1.jpg";
import BrandImg2 from "@/assets/Brand2.jpg";
import BrandImg3 from "@/assets/Brand3.jpg";
import BrandImg4 from "@/assets/Brand4.png";
import BrandImg5 from "@/assets/Brand5.jpg";
import BrandImg6 from "@/assets/Brand6.jpg";
import BrandImg7 from "@/assets/Brand7.jpg";
import BrandImg8 from "@/assets/Brand8.jpg";

import GraphicsImg1 from "@/assets/Graphics1.jpg";
import GraphicsImg2 from "@/assets/Graphics2.jpg";
import GraphicsImg3 from "@/assets/Graphics3.jpg";
import GraphicsImg4 from "@/assets/Graphics4.jpg";
import GraphicsImg5 from "@/assets/Graphics5.jpg";
import GraphicsImg6 from "@/assets/Graphics6.jpg";

import SocialImg1 from "@/assets/Social1.jpg";
import SocialImg2 from "@/assets/Social2.jpg";
import SocialImg3 from "@/assets/Social3.jpg";
import SocialImg4 from "@/assets/Social4.jpg";
import SocialImg5 from "@/assets/Social5.jpg";
import SocialImg6 from "@/assets/Social6.jpg";
import SocialImg7 from "@/assets/Social7.jpg";
import SocialImg8 from "@/assets/Social8.jpg";

const DEFAULT_PROJECTS: Record<string, string[]> = {
  "01": [BrandImg1, BrandImg2, BrandImg3, BrandImg4, BrandImg5, BrandImg6, BrandImg7, BrandImg8],
  "02": [GraphicsImg1, GraphicsImg2, GraphicsImg3, GraphicsImg4, GraphicsImg5, GraphicsImg6],
  "03": [SocialImg1, SocialImg2, SocialImg3, SocialImg4, SocialImg5, SocialImg6, SocialImg7, SocialImg8],
};

const SERVICE_TABS = [
  { slug: '01', label: 'Brand Design' },
  { slug: '02', label: 'Graphics Design' },
  { slug: '03', label: 'Social Media' },
]

function Feedback({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <p className="font-sans text-xs px-4 py-3 border" role="alert"
      style={type === 'success'
        ? { color: '#34d399', backgroundColor: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)' }
        : { color: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)' }}
    >{msg}</p>
  )
}

async function uploadImage(file: File, serviceSlug: string): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg'
  const path = `${serviceSlug}/${Date.now()}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from('portfolio-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (uploadErr) throw uploadErr

  const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
  return data.publicUrl
}

export default function ProjectsEditor() {
  const [activeSlug, setActiveSlug]   = useState('01')
  const [projects, setProjects]       = useState<Project[]>([])
  const [loading, setLoading]         = useState(true)
  const [feedback, setFeedback]       = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [importingDefaults, setImportingDefaults] = useState(false)
  // Upload state
  const [uploadFile, setUploadFile]   = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [preview, setPreview]         = useState<string | null>(null)
  const [uploading, setUploading]     = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function showFeedback(type: 'success' | 'error', message: string) {
    setFeedback({ type, message })
    if (type === 'success') setTimeout(() => setFeedback(null), 4000)
  }

  function loadProjects(slug: string) {
    setLoading(true)
    supabase
      .from('projects')
      .select('*')
      .eq('service_slug', slug)
      .order('display_order')
      .then(({ data, error }) => {
        if (!error && data) setProjects(data as Project[])
        setLoading(false)
      })
  }

  useEffect(() => { loadProjects(activeSlug) }, [activeSlug])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setUploadFile(file)
    if (file) setPreview(URL.createObjectURL(file))
    else setPreview(null)
  }

  async function handleUpload() {
    if (!uploadFile) return
    setUploading(true)
    setFeedback(null)
    try {
      const imageUrl   = await uploadImage(uploadFile, activeSlug)
      const nextOrder  = projects.length > 0
        ? Math.max(...projects.map(p => p.display_order)) + 1
        : 0

      const { error } = await supabase.from('projects').insert({
        service_slug:  activeSlug,
        image_url:     imageUrl,
        title:         uploadTitle.trim() || null,
        display_order: nextOrder,
      })

      if (error) {
        console.error("Supabase projects insert error:", error)
        throw error
      }

      showFeedback('success', 'Image added.')
      setUploadFile(null)
      setUploadTitle('')
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      loadProjects(activeSlug)
    } catch (err) {
      console.error("Full upload error caught:", err)
      showFeedback('error', err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function handleImportDefaults() {
    const defaults = DEFAULT_PROJECTS[activeSlug]
    if (!defaults || defaults.length === 0) return
    setImportingDefaults(true)
    setFeedback(null)

    try {
      const rows = defaults.map((url, index) => ({
        service_slug: activeSlug,
        image_url: url,
        title: `Default ${activeSlug} Project ${index + 1}`,
        display_order: index
      }))

      const { error } = await supabase.from('projects').insert(rows)
      if (error) throw error

      showFeedback('success', `Imported ${defaults.length} default images successfully.`)
      loadProjects(activeSlug)
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Import failed.')
    } finally {
      setImportingDefaults(false)
    }
  }

  async function handleDelete(project: Project) {
    if (!window.confirm('Delete this image? This cannot be undone.')) return
    setFeedback(null)

    // Remove from storage
    const storagePath = project.image_url.split('/portfolio-images/')[1]
    if (storagePath) {
      await supabase.storage.from('portfolio-images').remove([storagePath])
    }

    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    error ? showFeedback('error', error.message) : showFeedback('success', 'Image deleted.')
    if (!error) loadProjects(activeSlug)
  }

  async function handleReorder(index: number, direction: 'up' | 'down') {
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= projects.length) return

    const a = projects[index]
    const b = projects[swapIndex]

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from('projects').update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('projects').update({ display_order: a.display_order }).eq('id', b.id),
    ])

    if (e1 || e2) {
      showFeedback('error', 'Reorder failed.')
    } else {
      loadProjects(activeSlug)
    }
  }

  const inputStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--hudson-navbar-fg)',
  }

  return (
    <div className="space-y-8">
      {/* Service tabs */}
      <nav
        role="tablist"
        aria-label="Service gallery tabs"
        className="flex gap-1"
      >
        {SERVICE_TABS.map(tab => (
          <button
            key={tab.slug}
            role="tab"
            id={`proj-tab-${tab.slug}`}
            aria-selected={activeSlug === tab.slug}
            aria-controls={`proj-panel-${tab.slug}`}
            onClick={() => setActiveSlug(tab.slug)}
            className="font-sans text-xs font-bold tracking-[0.15em] uppercase px-5 py-2.5 transition-all duration-200"
            style={activeSlug === tab.slug
              ? { backgroundColor: 'var(--hudson-navbar-accent)', color: '#fff' }
              : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--hudson-navbar-fg-muted)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div
        id={`proj-panel-${activeSlug}`}
        role="tabpanel"
        aria-labelledby={`proj-tab-${activeSlug}`}
        className="space-y-6"
      >
        {/* Image grid */}
        {loading ? (
          <p className="font-mono text-xs animate-pulse" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
            Loading…
          </p>
        ) : projects.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
            style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <ImageIcon className="w-8 h-8" style={{ color: 'var(--hudson-navbar-fg-muted)' }} />
            <div className="space-y-1">
              <p className="font-sans text-xs" style={{ color: 'var(--hudson-navbar-fg)' }}>
                No database images for this category yet.
              </p>
              <p className="font-sans text-[10px]" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
                Upload new ones below, or import the default images from the codebase.
              </p>
            </div>
            <button
              type="button"
              onClick={handleImportDefaults}
              disabled={importingDefaults}
              className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2.5 border border-white/10 hover:border-white/20 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--hudson-navbar-fg)' }}
            >
              {importingDefaults ? 'Importing…' : 'Import Codebase Default Images'}
            </button>
          </div>
        ) : (
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            aria-label="Project images"
          >
            {projects.map((proj, i) => (
              <li
                key={proj.id}
                className="relative group overflow-hidden aspect-square"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <img
                  src={proj.image_url}
                  alt={proj.title ?? `Project image ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleReorder(i, 'up')}
                      disabled={i === 0}
                      aria-label="Move image up"
                      className="p-1.5 rounded text-white/70 hover:text-white disabled:opacity-30 transition-colors"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(i, 'down')}
                      disabled={i === projects.length - 1}
                      aria-label="Move image down"
                      className="p-1.5 rounded text-white/70 hover:text-white disabled:opacity-30 transition-colors"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj)}
                    aria-label="Delete image"
                    className="p-1.5 rounded transition-colors"
                    style={{ backgroundColor: 'rgba(248,113,113,0.2)', color: '#f87171' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Title badge */}
                {proj.title && (
                  <span
                    className="absolute bottom-0 left-0 right-0 font-mono text-[9px] truncate px-2 py-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.7)' }}
                  >
                    {proj.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Upload zone */}
        <div
          className="p-6 space-y-4"
          style={{ border: '1px dashed rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.02)' }}
        >
          <p
            className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: 'var(--hudson-navbar-fg-muted)' }}
          >
            Upload New Image
          </p>

          {preview && (
            <img
              src={preview}
              alt="Upload preview"
              className="w-32 h-32 object-cover"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            />
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-3">
              <input
                ref={fileInputRef}
                id={`proj-file-${activeSlug}`}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full font-sans text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:tracking-widest file:uppercase file:cursor-pointer file:transition-opacity file:hover:opacity-80"
                style={{
                  ...inputStyle,
                  color: 'var(--hudson-navbar-fg-muted)',
                  padding: '0.5rem',
                } as React.CSSProperties}
              />
              <input
                id={`proj-title-${activeSlug}`}
                type="text"
                placeholder="Optional caption / alt text"
                value={uploadTitle}
                onChange={e => setUploadTitle(e.target.value)}
                className="w-full font-sans text-sm px-4 py-3 focus:outline-none"
                style={inputStyle}
              />
            </div>

            <button
              type="button"
              id={`proj-upload-btn-${activeSlug}`}
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="self-end flex items-center gap-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-6 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-40 whitespace-nowrap"
              style={{ backgroundColor: 'var(--hudson-navbar-accent)' }}
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Uploading…' : 'Add Image'}
            </button>
          </div>
        </div>

        {feedback && <Feedback msg={feedback.message} type={feedback.type} />}
      </div>
    </div>
  )
}
