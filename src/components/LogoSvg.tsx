export default function LogoSvg({ width = 36, height = 36, className = '' }: { width?: number, height?: number, className?: string }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="-4 -4 108 108" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Droplet */}
      <path 
        d="M50 10 C50 10 20 45 20 70 C20 86.5 33.5 100 50 100 C66.5 100 80 86.5 80 70 C80 45 50 10 50 10 Z" 
        stroke="url(#paint0_linear)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Inner Spark/Star */}
      <path
        d="M50 35 C50 55 45 60 30 60 C45 60 50 65 50 85 C50 65 55 60 70 60 C55 60 50 55 50 35 Z"
        fill="url(#paint1_linear)"
      />
      
      <defs>
        <linearGradient id="paint0_linear" x1="20" y1="10" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F8EF7" />
          <stop offset="1" stopColor="#7C5CFC" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="30" y1="35" x2="70" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="1" stopColor="#4F8EF7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
