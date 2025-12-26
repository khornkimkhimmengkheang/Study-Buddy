import { FilterStatus, SortOption } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SortAsc, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  taskCounts: Record<FilterStatus, number>;
  className?: string;
}

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "To Do" },
  { value: "doing", label: "Doing" },
  { value: "done", label: "Done" },
];

export function FilterBar({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  taskCounts,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter tabs and sort */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
        <div className="flex gap-1 p-1 bg-muted rounded-lg overflow-x-auto scrollbar-hide touch-scroll">
          {statusFilters.map(({ value, label }) => (
            <Button
              key={value}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 rounded-md transition-all",
                filter === value
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onFilterChange(value)}
            >
              {label}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1.5 h-5 min-w-[20px] px-1.5 text-xs",
                  filter === value && "bg-primary/10 text-primary"
                )}
              >
                {taskCounts[value]}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <SortAsc className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select
            value={sortBy}
            onValueChange={(v) => onSortChange(v as SortOption)}
          >
            <SelectTrigger className="w-[140px] h-8 flex-shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
