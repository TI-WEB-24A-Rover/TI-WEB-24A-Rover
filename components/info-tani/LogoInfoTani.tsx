type LogoInfoTaniProps = {
  className?: string;
};

export default function LogoInfoTani({ className = "w-12 h-12 md:w-16 md:h-16" }: LogoInfoTaniProps) {
  return (
    <svg
      className={`${className} block shrink-0`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="62" height="62" rx="18" fill="transparent" />
      <path d="M13 46H22V22H13V46Z" fill="#0F766E" rx="2" />
      <path d="M24 46H31V30H24V46Z" fill="#94A3B8" />
      <path d="M33 46H40V18H33V46Z" fill="#FBBF24" />
      <path d="M42 46H51V36H42V46Z" fill="#0F766E" />
      <path d="M20 20C24 16 28 14 31 14" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <path d="M31 14V9" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 16C40 20 43 24 46 28" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <path d="M19 49H49" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
