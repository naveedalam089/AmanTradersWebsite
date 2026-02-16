/**
 * WaveDivider Component
 * Reusable curved SVG divider for section transitions
 * 
 * Props:
 * - position: 'top' | 'bottom' - Where the wave appears
 * - variant: 'wave1' | 'wave2' | 'wave3' - Different wave styles
 * - flip: boolean - Flip the wave horizontally
 * - className: string - Additional CSS classes
 * 
 * TO CUSTOMIZE: Change the fill color using className (e.g., fill-background, fill-primary/10)
 */

interface WaveDividerProps {
  position?: 'top' | 'bottom';
  variant?: 'wave1' | 'wave2' | 'wave3';
  flip?: boolean;
  className?: string;
}

const WaveDivider = ({ 
  position = 'bottom', 
  variant = 'wave1', 
  flip = false,
  className = ''
}: WaveDividerProps) => {
  const waves = {
    wave1: (
      <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
    ),
    wave2: (
      <path d="M0,160L60,165.3C120,171,240,181,360,165.3C480,149,600,107,720,106.7C840,107,960,149,1080,154.7C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
    ),
    wave3: (
      <path d="M0,64L80,85.3C160,107,320,149,480,154.7C640,160,800,128,960,128C1120,128,1280,160,1360,176L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
    )
  };

  return (
    <div 
      className={`absolute left-0 right-0 w-full overflow-hidden leading-none ${
        position === 'top' ? 'top-0 rotate-180' : 'bottom-0'
      } ${className}`}
      style={{ lineHeight: 0 }}
    >
      <svg
        className={`relative block w-full h-[60px] md:h-[100px] ${flip ? 'scale-x-[-1]' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <g className="fill-current">
          {waves[variant]}
        </g>
      </svg>
    </div>
  );
};

export default WaveDivider;
