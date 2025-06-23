import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      d="M4.5 3L12 21L19.5 3"
      strokeWidth="2.5"
      fill="currentColor"
      opacity="0.3"
    />
    <path d="M8 12l2.5 4L13 12h-5z" fill="currentColor" />
    <path d="M12 3v10l-2 3" stroke="hsl(var(--sidebar-background))" />
    <path
      d="M10.5 9l3 6 -4 -3 2.5 -6 -3 4"
      strokeWidth="1.5"
      stroke="hsl(var(--sidebar-primary))"
    />
  </svg>
);
