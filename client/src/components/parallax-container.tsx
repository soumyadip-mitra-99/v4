import { useEffect, useRef } from "react";

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxContainer({ children, speed = 0.5, className = "" }: ParallaxContainerProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * speed;
      element.style.transform = `translateY(${parallax}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={elementRef} className={`parallax-element ${className}`}>
      {children}
    </div>
  );
}

interface ParallaxElementProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
}

export function ParallaxElement({ children, speed = 0.3, direction = 'up', className = "" }: ParallaxElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -speed;
            const yPos = direction === 'up' ? rate : -rate;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
          };

          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [speed, direction]);

  return (
    <div ref={elementRef} className={`parallax-element ${className}`}>
      {children}
    </div>
  );
}