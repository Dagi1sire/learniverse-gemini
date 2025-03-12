import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
interface EnhancedSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  variant?: 'default' | 'primary' | 'secondary';
  thickness?: 'thin' | 'default' | 'thick';
  showMarks?: boolean;
  marks?: number[];
}
const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, EnhancedSliderProps>(({
  className,
  variant = 'default',
  thickness = 'default',
  showMarks = false,
  marks,
  ...props
}, ref) => {
  // Generate marks if showMarks is true and marks are not provided
  const generatedMarks = React.useMemo(() => {
    if (!showMarks) return [];
    if (marks) return marks;
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const step = props.step ?? 1;
    const markCount = Math.floor((max - min) / step) + 1;
    const markArray = [];
    for (let i = 0; i < markCount; i++) {
      markArray.push(min + i * step);
    }
    return markArray;
  }, [showMarks, marks, props.min, props.max, props.step]);

  // Get the color classes based on the variant
  const getColorClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary-foreground';
      default:
        return 'bg-primary';
    }
  };

  // Get the thickness classes
  const getTrackThicknessClasses = () => {
    switch (thickness) {
      case 'thin':
        return 'h-1.5';
      case 'thick':
        return 'h-3';
      default:
        return 'h-2';
    }
  };
  const getThumbSizeClasses = () => {
    switch (thickness) {
      case 'thin':
        return 'h-4 w-4';
      case 'thick':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };
  return <div className="relative">
      <SliderPrimitive.Root ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
        <SliderPrimitive.Track className={cn("relative w-full grow overflow-hidden rounded-full bg-secondary", getTrackThicknessClasses())}>
          <SliderPrimitive.Range className={cn("absolute h-full", getColorClasses())} />
        </SliderPrimitive.Track>
        {props.value?.map((_, index) => {})}
      </SliderPrimitive.Root>
      
      {/* Optional Marks */}
      {showMarks && <div className="relative w-full mt-1 flex justify-between px-[10px]">
          {generatedMarks.map((mark, i) => <div key={i} className="flex flex-col items-center">
              <div className={cn("w-0.5 h-1 bg-muted-foreground mb-1", mark === props.value?.[0] && "bg-primary h-2")} />
              <span className="text-[10px] text-muted-foreground">
                {mark}
              </span>
            </div>)}
        </div>}
    </div>;
});
Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider };