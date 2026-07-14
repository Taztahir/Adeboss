import { useState, useEffect, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteContent } from '@/lib/types'

const FIELD_LABEL = 'block font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-2'
const INPUT_BASE  = 'w-full font-sans text-sm px-4 py-3 focus:outline-none transition-colors duration-200 resize-none'

function inputStyle(focused: boolean) {
  return {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${focused ? 'var(--hudson-navbar-accent)' : 'rgba(255,255,255,0.1)'}`,
    color: 'var(--hudson-navbar-fg)',
  }
}

function Feedback({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <p
      className="font-sans text-xs px-4 py-3 border"
      role="alert"
      style={
        type === 'success'
          ? { color: '#34d399', backgroundColor: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)' }
          : { color: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)' }
      }
    >
      {msg}
    </p>
  )
}

function Field({
  id, label, value, onChange, multiline = false, rows = 4,
}: {
  id: string; label: string; value: string
  onChange: (v: string) => void; multiline?: boolean; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const common = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: inputStyle(focused),
    className: INPUT_BASE,
  }
  return (
    <div>
      <label htmlFor={id} className={FIELD_LABEL} style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
        {label}
      </label>
      {multiline
        ? <textarea {...common} rows={rows} />
        : <input type="text" {...common} />}
    </div>
  )
}

export default function SiteContentEditor() {
  const [data, setData]       = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    supabase
      .from('site_content')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setData(data as SiteContent)
        setLoading(false)
      })
  }, [])

  function set<K extends keyof SiteContent>(key: K, val: SiteContent[K]) {
    setData(prev => prev ? { ...prev, [key]: val } : prev)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setFeedback(null)

    const { error } = await supabase
      .from('site_content')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', 1)

    setFeedback(
      error
        ? { type: 'error', message: error.message }
        : { type: 'success', message: 'Site content saved successfully.' }
    )
    setSaving(false)
    if (!error) setTimeout(() => setFeedback(null), 4000)
  }

  if (loading) return (
    <p className="font-mono text-xs animate-pulse" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
      Loading…
    </p>
  )
  if (!data) return (
    <p className="font-sans text-xs" style={{ color: '#f87171' }}>
      Failed to load site content.
    </p>
  )

  return (
    <form onSubmit={handleSave} className="space-y-10 max-w-2xl">
      {/* Hero */}
      <section aria-labelledby="sc-hero-heading">
        <h3
          id="sc-hero-heading"
          className="font-serif text-lg font-bold mb-6 pb-3"
          style={{ color: 'var(--hudson-navbar-fg)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          Hero
        </h3>
        <div className="space-y-4">
          <Field id="sc-greeting"  label="Greeting label"  value={data.hero_greeting}  onChange={v => set('hero_greeting', v)} />
          <Field id="sc-name"      label="Name"            value={data.hero_name}       onChange={v => set('hero_name', v)} />
          <Field id="sc-tagline"   label="Tagline"         value={data.hero_tagline}    onChange={v => set('hero_tagline', v)} />
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="sc-about-heading">
        <h3
          id="sc-about-heading"
          className="font-serif text-lg font-bold mb-6 pb-3"
          style={{ color: 'var(--hudson-navbar-fg)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          About
        </h3>
        <div className="space-y-4">
          <Field id="sc-about1" label="Paragraph 1" value={data.about_paragraph_1} onChange={v => set('about_paragraph_1', v)} multiline rows={5} />
          <Field id="sc-about2" label="Paragraph 2" value={data.about_paragraph_2} onChange={v => set('about_paragraph_2', v)} multiline rows={5} />
        </div>
      </section>

      {/* Contact */}
      <section aria-labelledby="sc-contact-heading">
        <h3
          id="sc-contact-heading"
          className="font-serif text-lg font-bold mb-6 pb-3"
          style={{ color: 'var(--hudson-navbar-fg)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          Contact
        </h3>
        <div className="space-y-4">
          <Field id="sc-blurb"  label="Blurb"    value={data.contact_blurb} onChange={v => set('contact_blurb', v)} multiline rows={3} />
          <Field id="sc-email"  label="Email"    value={data.contact_email} onChange={v => set('contact_email', v)} />
          <Field id="sc-phone"  label="Phone"    value={data.contact_phone} onChange={v => set('contact_phone', v)} />
          <Field id="sc-cv"     label="CV URL"   value={data.cv_url ?? ''}  onChange={v => set('cv_url', v || null)} />
        </div>
      </section>

      {feedback && <Feedback msg={feedback.message} type={feedback.type} />}

      <button
        type="submit"
        id="sc-save-btn"
        disabled={saving}
        className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase px-8 py-4 text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: 'var(--hudson-navbar-accent)' }}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
