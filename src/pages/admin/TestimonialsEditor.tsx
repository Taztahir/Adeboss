import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/types'
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown, X } from 'lucide-react'

const LABEL = 'block font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-2'
const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--hudson-navbar-fg)',
}

function Feedback({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <p className="font-sans text-xs px-4 py-3 border" role="alert"
      style={type === 'success'
        ? { color: '#34d399', backgroundColor: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)' }
        : { color: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)' }}
    >{msg}</p>
  )
}

const EMPTY_FORM = { name: '', role: '', quote: '', avatar_url: '' }

function TestimonialForm({
  initial = EMPTY_FORM,
  submitLabel,
  onSubmit,
  onCancel,
  saving,
}: {
  initial?: typeof EMPTY_FORM
  submitLabel: string
  onSubmit: (data: typeof EMPTY_FORM) => void
  onCancel?: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)
  function set(key: keyof typeof EMPTY_FORM, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div
      className="p-6 space-y-4"
      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tm-name" className={LABEL} style={{ color: 'var(--hudson-navbar-fg-muted)' }}>Name</label>
          <input id="tm-name" type="text" value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full font-sans text-sm px-4 py-3 focus:outline-none" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="tm-role" className={LABEL} style={{ color: 'var(--hudson-navbar-fg-muted)' }}>Role / Company</label>
          <input id="tm-role" type="text" value={form.role} onChange={e => set('role', e.target.value)}
            className="w-full font-sans text-sm px-4 py-3 focus:outline-none" style={inputStyle} />
        </div>
      </div>
      <div>
        <label htmlFor="tm-quote" className={LABEL} style={{ color: 'var(--hudson-navbar-fg-muted)' }}>Quote</label>
        <textarea id="tm-quote" rows={3} value={form.quote} onChange={e => set('quote', e.target.value)}
          className="w-full font-sans text-sm px-4 py-3 focus:outline-none resize-none" style={inputStyle} />
      </div>
      <div>
        <label htmlFor="tm-avatar" className={LABEL} style={{ color: 'var(--hudson-navbar-fg-muted)' }}>Avatar URL (optional)</label>
        <input id="tm-avatar" type="url" placeholder="https://…" value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)}
          className="w-full font-sans text-sm px-4 py-3 focus:outline-none" style={inputStyle} />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onSubmit(form)}
          disabled={saving || !form.name || !form.quote}
          className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase px-6 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: 'var(--hudson-navbar-accent)' }}
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase px-6 py-3 transition-opacity hover:opacity-70"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--hudson-navbar-fg-muted)' }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading]           = useState(true)
  const [editingId, setEditingId]       = useState<string | null>(null)
  const [savingId, setSavingId]         = useState<string | null>(null)
  const [addingSaving, setAddingSaving] = useState(false)
  const [showAddForm, setShowAddForm]   = useState(false)
  const [feedback, setFeedback]         = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showFeedback(type: 'success' | 'error', message: string) {
    setFeedback({ type, message })
    if (type === 'success') setTimeout(() => setFeedback(null), 3500)
  }

  function load() {
    supabase.from('testimonials').select('*').order('display_order')
      .then(({ data }) => {
        if (data) setTestimonials(data as Testimonial[])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  async function handleAdd(form: typeof EMPTY_FORM) {
    setAddingSaving(true)
    const nextOrder = testimonials.length > 0
      ? Math.max(...testimonials.map(t => t.display_order)) + 1 : 0

    const { error } = await supabase.from('testimonials').insert({
      name: form.name,
      role: form.role,
      quote: form.quote,
      avatar_url: form.avatar_url.trim() || null,
      display_order: nextOrder,
    })

    error ? showFeedback('error', error.message) : showFeedback('success', 'Testimonial added.')
    setAddingSaving(false)
    if (!error) { setShowAddForm(false); load() }
  }

  async function handleUpdate(id: string, form: typeof EMPTY_FORM) {
    setSavingId(id)
    const { error } = await supabase.from('testimonials').update({
      name:       form.name,
      role:       form.role,
      quote:      form.quote,
      avatar_url: form.avatar_url.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq('id', id)

    error ? showFeedback('error', error.message) : showFeedback('success', 'Testimonial updated.')
    setSavingId(null)
    if (!error) { setEditingId(null); load() }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this testimonial?')) return
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    error ? showFeedback('error', error.message) : showFeedback('success', 'Deleted.')
    if (!error) load()
  }

  async function handleReorder(index: number, dir: 'up' | 'down') {
    const swapIndex = dir === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= testimonials.length) return
    const a = testimonials[index], b = testimonials[swapIndex]
    await Promise.all([
      supabase.from('testimonials').update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('testimonials').update({ display_order: a.display_order }).eq('id', b.id),
    ])
    load()
  }

  if (loading) return (
    <p className="font-mono text-xs animate-pulse" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
      Loading testimonials…
    </p>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      {/* List */}
      {testimonials.length === 0 && (
        <p className="font-sans text-sm" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
          No testimonials yet. Add one below.
        </p>
      )}

      {testimonials.map((t, i) => (
        <div
          key={t.id}
          className="p-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {editingId === t.id ? (
            <TestimonialForm
              initial={{ name: t.name, role: t.role, quote: t.quote, avatar_url: t.avatar_url ?? '' }}
              submitLabel="Save Changes"
              onSubmit={form => handleUpdate(t.id, form)}
              onCancel={() => setEditingId(null)}
              saving={savingId === t.id}
            />
          ) : (
            <div className="flex gap-4">
              {/* Avatar */}
              <div
                className="shrink-0 w-10 h-10 overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {t.avatar_url
                  ? <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--hudson-navbar-accent)' }}>
                      {t.name[0]}
                    </div>
                }
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-sm" style={{ color: 'var(--hudson-navbar-fg)' }}>
                  {t.name}
                </p>
                <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
                  {t.role}
                </p>
                <p className="font-sans text-sm mt-3 leading-relaxed" style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
                  "{t.quote}"
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-1 shrink-0">
                <button type="button" onClick={() => handleReorder(i, 'up')} disabled={i === 0}
                  aria-label="Move up" className="p-1.5 transition-opacity hover:opacity-100 disabled:opacity-20"
                  style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => handleReorder(i, 'down')} disabled={i === testimonials.length - 1}
                  aria-label="Move down" className="p-1.5 transition-opacity hover:opacity-100 disabled:opacity-20"
                  style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => setEditingId(t.id)} aria-label="Edit testimonial"
                  className="p-1.5 transition-colors"
                  style={{ color: 'var(--hudson-navbar-accent)' }}>
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => handleDelete(t.id)} aria-label="Delete testimonial"
                  className="p-1.5 transition-colors hover:text-red-400"
                  style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {feedback && <Feedback msg={feedback.message} type={feedback.type} />}

      {/* Add new */}
      {showAddForm ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
              New Testimonial
            </p>
            <button type="button" onClick={() => setShowAddForm(false)} aria-label="Cancel add"
              style={{ color: 'var(--hudson-navbar-fg-muted)' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <TestimonialForm submitLabel="Add Testimonial" onSubmit={handleAdd} saving={addingSaving} />
        </div>
      ) : (
        <button
          type="button"
          id="tm-add-btn"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-6 py-3 transition-opacity hover:opacity-90"
          style={{ border: '1px solid var(--hudson-navbar-accent)', color: 'var(--hudson-navbar-accent)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Testimonial
        </button>
      )}
    </div>
  )
}
