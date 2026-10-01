import { useState } from 'react'
import { cn } from '@/lib/utils.js'

/**
 * Renders a vite-imagetools `as=picture` object (AVIF + WebP sources, intrinsic size) with a
 * pulsing placeholder and a fade-in once decoded. Intrinsic width/height reserve the space so
 * nothing shifts. Fills its parent; give the parent the aspect ratio.
 */
export default function Picture({ picture, alt, sizes, eager = false, className, imgClassName }) {
  const [loaded, setLoaded] = useState(eager)
  const { sources, img } = picture

  return (
    <picture className={cn('relative block size-full overflow-hidden bg-surface-2', className)}>
      {!loaded && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-line" />}
      {Object.entries(sources).map(([format, srcSet]) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0) setLoaded(true)
        }}
        src={img.src}
        width={img.w}
        height={img.h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={cn(
          'size-full object-cover transition-opacity duration-700',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </picture>
  )
}
