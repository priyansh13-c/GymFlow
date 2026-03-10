import React from 'react';

const Table = ({ children, className = '', ...props }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full" {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`bg-neutral-50 ${className}`} {...props}>
    {children}
  </thead>
);

const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-neutral-200 ${className}`} {...props}>
    {children}
  </tbody>
);

const TableRow = ({ children, className = '', hover = true, ...props }) => (
  <tr
    className={`${hover ? 'hover:bg-neutral-50 transition-colors duration-150' : ''} ${className}`}
    {...props}
  >
    {children}
  </tr>
);

const TableHead = ({ children, className = '', sortable = false, onSort, sortDirection, ...props }) => (
  <th
    className={`px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider ${sortable ? 'cursor-pointer select-none hover:text-neutral-700' : ''} ${className}`}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center space-x-1">
      <span>{children}</span>
      {sortable && sortDirection && (
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )}
    </div>
  </th>
);

const TableCell = ({ children, className = '', ...props }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-neutral-900 ${className}`} {...props}>
    {children}
  </td>
);

export default Table;
export { TableHeader, TableBody, TableRow, TableHead, TableCell };