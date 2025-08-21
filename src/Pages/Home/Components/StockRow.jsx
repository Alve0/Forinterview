export default function StockRow({ stock, onRemove }) {
  const trendClass = (n) =>
    n > 0 ? "text-green-600" : n < 0 ? "textred-600" : "text-gray-700";
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-semibold">{stock.symbol}</td>
      <td className="p-3">${Number(stock.price || 0).toFixed(2)}</td>
      <td className={`p-3 ${trendClass(stock.change)}`}>
        {Number(stock.change || 0).toFixed(2)}
      </td>
      <td className={`p-3 ${trendClass(stock.percent)}`}>
        {Number(stock.percent || 0).toFixed(2)}%
      </td>
      <td className="p-3 text-right">
        <button
          onClick={() => onRemove(stock.symbol)}
          className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Remove 8
        </button>
      </td>
    </tr>
  );
}
