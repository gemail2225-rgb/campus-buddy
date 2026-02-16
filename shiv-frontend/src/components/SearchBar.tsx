import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  showFilters?: boolean;
  filters?: {
    categories?: string[];
    statuses?: string[];
    dates?: string[];
  };
}

export const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onFilter,
  showFilters = true,
  filters 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterSelect = (filter: string) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter];
    
    setSelectedFilters(newFilters);
    
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    if (onFilter) {
      onFilter([]);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        {showFilters && (
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {selectedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0">
                    {selectedFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {filters?.categories && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Category
                  </DropdownMenuLabel>
                  {filters.categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => handleFilterSelect(category)}
                      className="flex items-center justify-between"
                    >
                      <span>{category}</span>
                      {selectedFilters.includes(category) && (
                        <Badge variant="default" className="h-4 w-4 rounded-full p-0">✓</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}

              {filters?.statuses && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Status
                    </DropdownMenuLabel>
                    {filters.statuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleFilterSelect(status)}
                        className="flex items-center justify-between"
                      >
                        <span>{status}</span>
                        {selectedFilters.includes(status) && (
                          <Badge variant="default" className="h-4 w-4 rounded-full p-0">✓</Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </>
              )}

              {filters?.dates && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Date
                    </DropdownMenuLabel>
                    {filters.dates.map((date) => (
                      <DropdownMenuItem
                        key={date}
                        onClick={() => handleFilterSelect(date)}
                        className="flex items-center justify-between"
                      >
                        <span>{date}</span>
                        {selectedFilters.includes(date) && (
                          <Badge variant="default" className="h-4 w-4 rounded-full p-0">✓</Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </>
              )}

              {selectedFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="text-red-600">
                    Clear all filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button onClick={handleSearch} className="bg-[#1E40AF] hover:bg-[#1E3A8A]">
          Search
        </Button>
      </div>

      {/* Active filters display */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <button onClick={() => handleFilterSelect(filter)}>
                <X className="h-3 w-3 ml-1 hover:text-destructive" />
              </button>
            </Badge>
          ))}
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;