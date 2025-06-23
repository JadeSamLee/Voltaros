import type { SVGProps } from "react";

export const GkeIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 12l4.95 4.95-4.95 4.95-4.95-4.95L12 12z" fill="#4285F4" />
    <path
      d="M12 2.1l-4.95 4.95 4.95 4.95 4.95-4.95L12 2.1z"
      transform="rotate(45 12 7.05)"
      fill="#0F9D58"
    />
    <path
      d="M2.1 12l4.95-4.95 4.95 4.95-4.95 4.95L2.1 12z"
      transform="rotate(-45 7.05 12)"
      fill="#F4B400"
    />
  </svg>
);

export const CloudRunIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 2l-8 4 8 4 8-4-8-4z" fill="#4285F4" />
    <path d="M4 10l8 4 8-4" stroke="#4285F4" strokeWidth="1" />
    <path d="M4 10v6l8 4 8-4v-6" fill="#4285F4" opacity="0.6" />
  </svg>
);

export const BigQueryIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle cx="12" cy="12" r="10" fill="#4285F4" />
    <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2.5" />
    <path d="M15 3.5a9 9 0 0 0-9 2.5" stroke="#fff" strokeWidth="1.5" />
  </svg>
);

export const VertexAiIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#4285F4" />
    <path d="M2 17l10 5 10-5" stroke="#4285F4" strokeWidth="1"/>
    <path d="M2 12l10 5 10-5" stroke="#4285F4" strokeWidth="1" opacity="0.6"/>
  </svg>
);
