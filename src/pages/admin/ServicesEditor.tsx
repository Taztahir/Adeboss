import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Service } from '@/lib/types'
import { X, Plus } from 'lucide-react'

const LABEL = 'block font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-2'

function Feedback({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <p className="font-sans text-xs px-4 py-3 border" role="alert"
      style={type === 'success'
        ? { color: '#34d399', backgroundColor: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)' }
        : { color: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)' }}
    >{msg}</p>
  )
}

function ServiceCard({ service, onSaved }: { service: Service; onSaved: () => void }) {
  const [title, setTitle]       = useState(service.title)
  const [desc, setDesc]         = useState(service.description)
  const [tags, setTags]         = useState<string[]>(service.tags)
  const [newTag, setNewTag]     = useState('')
  const [saving, setSaving]     = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function addTag() {
    const t = newTag.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setNewTag('')
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)
    const { error } = await supabase
      .from('services')
      .update({ title, description: desc, tags, updated_at: new Date().toISOString() })
      .eq('slug', service.slug)

    setFeedback(error
      ? { type: 'error', message: error.message }
      : { type: 'success', message: 'Service saved.' }
    )
    setSaving(false)
    if (!error) { onSaved(); setTimeout(() => setFeedback(null), 3000) }
  }

  const inputStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--hudson-navbar-fg)',
  }

  return (
    <article
      className="p-6 space-y-5"
      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      aria-label={`Service ${service.slug} editor`}
    >
      <header className="flex items-center gap-3">
        <span
          className="font-mono text-xs font-bold tracking-widest"
          style={{ color: 'var(--hudson-navbar-accent)' }}
        >
          {service.slug}
        </span>
        <h3 className="font-serif text-base font-bold" style={{ color: 'var(--hudson-navbar-fg)' }}>
          {service.title}
        </h3>
      </header>

      {/* Title */}
      <div>
        <label htmlFor={`svc-title-${service.slug}`} className={LABEL} style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
          Title
        </label>
        <input
          id={`svc-title-${service.slug}`}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full font-sans text-sm px-4 py-3 focus:outline-none"
          style={inputStyle}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor={`svc-desc-${service.slug}`} className={LABEL} style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
          Description
        </label>
        <textarea
          id={`svc-desc-${service.slug}`}
          rows={4}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="w-full font-sans text-sm px-4 py-3 focus:outline-none resize-none"
          style={inputStyle}
        />
      </div>

      {/* Tags */}
      <div>
        <p className={LABEL} style={{ color: 'var(--hudson-navbar-fg-muted)' }}>Tags</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-3 py-1"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--hudson-navbar-fg-muted)' }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            id={`svc-newtag-${service.slug}`}
            type="text"
            placeholder="New tag…"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            className="flex-1 font-sans text-xs px-3 py-2 focus:outline-none"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={addTag}
            aria-label="Add tag"
            className="px-3 py-2 text-white flex items-center gap-1 font-sans text-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      {feedback && <Feedback msg={feedback.message} type={feedback.type} />}

      <button
        type="button"
        id={`svc-save-${service.slug}`}
        onClick={handleSave}
        disabled={saving}
        className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase px-6 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: 'var(--hudson-navbar-accent)' }}
      >
        {saving ? 'Saving…' : 'Save Service'}
      </button>
    </article>
  )
}

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)

  function load() {
    supabase
      .from('services')
      .select('*')
      .order('slug')
      .then(({ data }) => {
        if (data) setServices(data as Service[])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <p className="font-mono text-xs animate-pulse" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
      Loading services…
    </p>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="font-sans text-sm" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
        Edit the title, description, and tags for each service. Routes (<code className="font-mono text-xs">/works/01</code> etc.) remain unchanged.
      </p>
      {services.map(svc => (
        <ServiceCard key={svc.slug} service={svc} onSaved={load} />
      ))}
    </div>
  )
}
