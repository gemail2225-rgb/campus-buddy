import { useState } from "react";
import { Calendar, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'date' | 'select';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  onApplyFilters: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
  className?: string;
}

export const AdvancedFilters = ({
  filters,
  onApplyFilters,
  onClearFilters,
  className
}: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleFilterChange = (filterId: string, value: string | number | boolean | Date) => {
    if (value instanceof Date) {
      value = value.toISOString().split('T')[0];
    }
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
  };

  const handleClear = () => {
    setSelectedFilters({});
    setDateRange({});
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    return Object.keys(selectedFilters).length;
  };

  const renderFilterInput = (filter: FilterOption) => {
    switch (filter.type) {
      case 'checkbox':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFilters[filter.id]?.includes(option.value)}
                  onChange={(e) => {
                    const current = selectedFilters[filter.id] || [];
                    const newValue = e.target.checked
                      ? [...current, option.value]
                      : current.filter((v: string) => v !== option.value);
                    handleFilterChange(filter.id, newValue);
                  }}
                  className="rounded border-gray-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={filter.id}
                  value={option.value}
                  checked={selectedFilters[filter.id] === option.value}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="text-[#1E40AF] focus:ring-[#1E40AF]"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-4">
            <Slider
              min={filter.min || 0}
              max={filter.max || 100}
              step={filter.step || 1}
              value={[selectedFilters[filter.id] || filter.min || 0]}
              onValueChange={(value) => handleFilterChange(filter.id, value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filter.min || 0}</span>
              <span className="font-medium text-[#1E40AF]">
                {selectedFilters[filter.id] || filter.min || 0}
              </span>
              <span>{filter.max || 100}</span>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedFilters[filter.id] && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedFilters[filter.id] ? (
                    format(selectedFilters[filter.id], "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedFilters[filter.id]}
                  onSelect={(date) => handleFilterChange(filter.id, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'select':
        return (
          <Select
            value={selectedFilters[filter.id]}
            onValueChange={(value) => handleFilterChange(filter.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("border rounded-lg bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Advanced Filters</h3>
          {getActiveFilterCount() > 0 && (
            <Badge variant="default" className="bg-[#1E40AF]">
              {getActiveFilterCount()} active
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 border-t">
          <div className="space-y-6">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-3">
                <label className="text-sm font-medium">{filter.label}</label>
                {renderFilterInput(filter)}
              </div>
            ))}

            {/* Date Range Picker (Special case) */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>
            <Button onClick={handleApply} className="bg-[#1E40AF] hover:bg-[#1E3A8A]">
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;