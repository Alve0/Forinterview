import StockRow from "./StockRow";
export default function StockTable({
  stocks,
  onSort,
  sortKey,
  sortDir,
  onRemove,
}) {
  const Th = ({ label, k }) => (
    <th
      className="p-3 text-left cursor-pointer select-none"
      onClick={() => onSort(k)}
      title="Click to sort"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {sortKey === k && <span>{sortDir === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );
  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            7
            <Th label="Symbol" k="symbol" />
            <Th label="Price" k="price" />
            <Th label="Change" k="change" />
            <Th label="Change %" k="percent" />
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No results
              </td>
            </tr>
          ) : (
            stocks.map((stock) => (
              <StockRow key={stock.symbol} stock={stock} onRemove={onRemove} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
