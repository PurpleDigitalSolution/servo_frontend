import React, { useCallback, useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

// type NestedKeyOf<T> = {
//   [K in Extract<keyof T, string>]: T[K] extends object
//     ? K | `${K}.${NestedKeyOf<T[K]>}`
//     : K;
// }[Extract<keyof T, string>];

function getNestedValue<T>(obj: T, path: string): unknown {
  if (!path) return obj;

  if (path.includes(".")) {
    const keys = path.split(".");
    let result: unknown = obj;
    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== "object") return undefined;
      result = (result as Record<string, unknown>)[key];
    }
    return result;
  }

  return obj[path as keyof T] as unknown;
}

interface SearchInputProps<T> {
  // Data to search through
  data?: T[];
  onFilteredData?: (filteredData: T[]) => void;
  searchFields?: (keyof T | string)[];
  placeholder?: string;
  className?: string;
  caseSensitive?: boolean;
  debounceDelay?: number;
  showClearButton?: boolean;
  minChars?: number;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
}

const SearchInput = <T extends Record<string, string | number | boolean | null | undefined>>({
  data = [],
  onFilteredData,
  searchFields = [],
  placeholder = "Search...",
  className = "",
  caseSensitive = false,
  debounceDelay = 300,
  showClearButton = true,
  minChars = 1,
  searchTerm: externalSearchTerm,
  onSearchTermChange,
}: SearchInputProps<T>) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);

  // Use external search term if provided, otherwise use internal
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;

  // Get field value from item
  const getFieldValue = useCallback(
    (item: T, field: string): string => {
      try {
        const value = getNestedValue(item, field);
        if (value === null || value === undefined) return "";

        let stringValue = String(value);
        if (!caseSensitive) {
          stringValue = stringValue.toLowerCase();
        }
        return stringValue;
      } catch (error) {
        console.warn(`Error accessing field ${field}:`, error);
        return "";
      }
    },
    [caseSensitive]
  );

  // Perform search
  const performSearch = useCallback(
    (term: string) => {
      if (!data || data.length === 0) {
        if (onFilteredData) onFilteredData([]);
        return;
      }

      // If search term is empty or less than minChars, return all data
      if (!term || term.length < minChars) {
        if (onFilteredData) onFilteredData(data);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const searchTermLower = caseSensitive ? term : term.toLowerCase();

      const filtered = data.filter((item) => {
        // If no search fields specified, search all top-level string properties
        const fieldsToSearch = searchFields.length > 0
          ? searchFields
          : Object.keys(item).filter(key => typeof item[key] === 'string' || typeof item[key] === 'number');

        return fieldsToSearch.some((field) => {
          const value = getFieldValue(item, field as string);
          if (!value) return false;

          if (caseSensitive) {
            return value.includes(term);
          } else {
            return value.toLowerCase().includes(searchTermLower);
          }
        });
      });

      if(filtered.length === 0){
        // search database
        
      }

      if (onFilteredData) onFilteredData(filtered);
      setIsSearching(false);
    },
    [data, searchFields, minChars, caseSensitive, onFilteredData, getFieldValue]
  );

  // Handle search term changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;

    if (onSearchTermChange) {
      onSearchTermChange(newTerm);
    } else {
      setInternalSearchTerm(newTerm);
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounce
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newTerm);
    }, debounceDelay);
  };

  // Clear search
  const clearSearch = () => {
    if (onSearchTermChange) {
      onSearchTermChange("");
    } else {
      setInternalSearchTerm("");
    }
    performSearch("");
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Perform search when external search term changes
  useEffect(() => {
    setTimeout(()=>{
      if (externalSearchTerm !== undefined) {
      performSearch(externalSearchTerm);
    }
    })
  }, [externalSearchTerm, performSearch]);

  return (
    <div className={`flex-1 relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
        size={16}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        aria-label={placeholder}
        className="w-full pl-9 pr-10 py-1.5 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder-text-secondary"
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {showClearButton && searchTerm.length > 0 && !isSearching && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;