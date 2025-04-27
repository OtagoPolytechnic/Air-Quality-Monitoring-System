const TableHeaders = ({ headers, onSort, sortConfig }) => {
  return (
    <thead>
      <tr className="text-xs text-gray-700 uppercase bg-gray-100">
        {headers.map((header, index) => (
          <th
            key={index}
            scope="col"
            className="py-3 px-1 sm:text-clip cursor-pointer"
            onClick={() => onSort(header.key)}
          >
            {header.label}
            <span className="ml-1">
              <span
                className={`text-green-500 ${sortConfig.key === header.key && sortConfig.direction === 'asc' ? '' : 'opacity-50'}`}
              >
                ▲
              </span>
              <span
                className={`text-red-500 ${sortConfig.key === header.key && sortConfig.direction === 'desc' ? '' : 'opacity-50'}`}
              >
                ▼
              </span>
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeaders;
