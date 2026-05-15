import { clsx } from 'clsx'

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={clsx('mb-12', alignStyles[align], className)}>
      <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-primary-600 max-w-2xl mx-auto text-pretty">
          {subtitle}
        </p>
      )}
      <div className={clsx(
        'mt-6 h-1 w-20 bg-gradient-to-l from-primary-400 to-primary-600 rounded-full',
        align === 'center' && 'mx-auto',
        align === 'left' && 'mr-auto',
        align === 'right' && 'ml-0'
      )} />
    </div>
  )
}
