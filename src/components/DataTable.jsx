function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 p-4">
      <table className="min-w-full text-left text-sm text-slate-300">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="border-b border-slate-800 px-3 py-2 font-medium text-slate-400">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-slate-800 last:border-0">
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-3">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
