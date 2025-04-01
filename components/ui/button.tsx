import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    fullWidth = false,
    asChild = false,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? "span" : "button";
    const buttonClasses = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      {
        "bg-primary text-primary-foreground hover:bg-primary-hover": variant === 'primary',
        "bg-secondary text-secondary-foreground hover:bg-muted": variant === 'secondary',
        "border border-input bg-transparent hover:bg-secondary": variant === 'outline',
        "bg-transparent hover:bg-secondary": variant === 'ghost',
        "bg-red-600 text-white hover:bg-red-700": variant === 'danger',
        "py-1 px-3 text-sm": size === 'sm',
        "py-2 px-4 text-base": size === 'md',
        "py-3 px-6 text-lg": size === 'lg',
        "w-full": fullWidth,
      },
      className
    );

    // Remove asChild from props to avoid passing it to the DOM element
    const { asChild: _, ...restProps } = props;
    
    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        disabled={!asChild ? (disabled || isLoading) : undefined}
        {...restProps}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button }; 