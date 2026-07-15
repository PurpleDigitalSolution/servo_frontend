import React, {  useState } from "react";

// type NestedKeyOf<T> = {
//   [K in keyof T]: T[K] extends object
//     ? K | `${K & string}.${NestedKeyOf<T[K]>}`
//     : K;
// }[keyof T];
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends Record<string, any>
    ? T[K] extends Array<any>
      ? K
      : K | `${K}.${NestedKeyOf<T[K]>}`
    : K;
}[keyof T & string];


interface SearchProps<T> {
  rawData: T[];
  onSearch: (searchTerm: string) => void;
  debounceDelay?: number;
  showClearButton?: boolean;
  minChars?: number;
  caseSensitive?: boolean;
  searchFields: (keyof T | NestedKeyOf<T> | string)[];
}
// function getNestedValue<T>(obj: T, path: string): any {
//   if (!path) return obj;

//   if (path.includes(".")) {
//     const keys = path.split(".");
//     let result: any = obj;
//     for (const key of keys) {
//       if (result === null || result === undefined) return undefined;
//       result = result[key];
//     }
//     return result;
//   }
// }

interface Filter {
  page: string;
  limit: string;
}

const Search = <T,>({ onSearch }: SearchProps<T>) => {
  const [filter, setFilter] = useState<Filter>({
    page: "",
    limit: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const onFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };
//   const getFieldValue = useCallback(
//   (item: T, field: string): string => {
//     try {
//       const value = getNestedValue(item, field);
//       if (value === null || value === undefined) return "";
//       let stringValue = String(value);
//       if(!caseSensitive) {
//         stringValue = stringValue.toLowerCase();
//       }
//       return stringValue;
//     } catch (error) {
//       console.error(`Error occurred while fetching field value for field: ${field}`, error);
//       return "";
//     }
//   },[caseSensitive]
// )

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center w-full">
      {/* Search Input */}
      <div className="w-full sm:w-64 md:w-80">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg placeholder:text-text-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        {/* Page Filter */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label
            htmlFor="page-filter"
            className="text-xs font-medium text-text-secondary uppercase tracking-wider"
          >
            Page
          </label>
          <select
            id="page-filter"
            name="page"
            value={filter.page}
            onChange={onFilterChange}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-w-[120px]"
          >
            <option value="">All Pages</option>
            <option value="page1">Page 1</option>
            <option value="page2">Page 2</option>
          </select>
        </div>

        {/* Limit Filter */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label
            htmlFor="limit-filter"
            className="text-xs font-medium text-text-secondary uppercase tracking-wider"
          >
            Limit
          </label>
          <select
            id="limit-filter"
            name="limit"
            value={filter.limit}
            onChange={onFilterChange}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-w-[100px]"
          >
            <option value="">Display</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Search;


