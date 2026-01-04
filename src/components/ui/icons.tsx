
import React from "react";

export function BagIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect height="10" rx="2" stroke="currentColor" strokeLinecap="round" strokeWidth="2" width="12" x="6" y="8"></rect>
            <path d="M9 7V7C9 5.34315 10.3431 4 12 4V4C13.6569 4 15 5.34315 15 7V7" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
        </svg>
    );
}
