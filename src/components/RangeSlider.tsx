import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  showAllOption?: boolean;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
}

export const RangeSlider = ({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  formatValue = (v) => v.toLocaleString(),
  showAllOption = false,
  onSelectAll,
  isAllSelected = false,
}: RangeSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {showAllOption && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className={isAllSelected ? "bg-accent" : ""}
          >
            Todos
          </Button>
        )}
      </div>
      
      {!isAllSelected && (
        <>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{formatValue(value[0])}</span>
            <span>{formatValue(value[1])}</span>
          </div>
          
          <Slider
            value={value}
            onValueChange={onChange}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
        </>
      )}
    </div>
  );
};