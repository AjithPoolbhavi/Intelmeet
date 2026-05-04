export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' };
  const iconSizes = { sm: 28, md: 34, lg: 48 };
  return (
    <div className="flex items-center gap-2.5">
      <svg width={iconSizes[size]} height={iconSizes[size]} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
        <path d="M10 15C10 13.3431 11.3431 12 13 12H22C23.6569 12 25 13.3431 25 15V25C25 26.6569 23.6569 28 22 28H13C11.3431 28 10 26.6569 10 25V15Z" fill="white" fillOpacity="0.9"/>
        <path d="M26 17.5L31 14V26L26 22.5V17.5Z" fill="white" fillOpacity="0.7"/>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#6366f1"/>
            <stop offset="100%" stopColor="#4338ca"/>
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-bold tracking-tight text-white ${sizes[size]}`}>
        Intell<span className="text-brand-400">Meet</span>
      </span>
    </div>
  );
}
