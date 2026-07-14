import { useRef, useState, useEffect } from 'react'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  /** Extra wrapper class for the outer div */
  wrapperClassName?: string
}

/**
 * LazyImage — fades in when the image enters the viewport.
 * Uses IntersectionObserver so the browser only starts the
 * network request once the element is close to being visible.
 * Respects prefers-reduced-motion for the fade transition.
 */
export default function LazyImage({
  src,
  alt,
  wrapperClassName = '',
  className = '',
  ...props
}: LazyImageProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [loaded,  setLoaded]  = useState(false)

  // Observe the wrapper; as soon as it's within 200px of the viewport,
  // set visible = true which swaps in the real src.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={wrapperClassName}>
      {/*
        We render the <img> immediately but give it an empty src until
        the element is near the viewport. Once visible, we swap in the
        real src and let the browser load it.
      */}
      <img
        {...props}
        src={visible ? src : undefined}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={className}
        style={{
          ...((props as React.CSSProperties | undefined) && {}),
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
          // Respect reduced-motion: skip transition but still show image
          ...(window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? { opacity: 1, transition: 'none' }
            : {}),
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
