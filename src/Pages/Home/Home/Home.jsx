import { useEffect, useMemo, useState } from "react";
import StockTable from "../components/StockTable";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

// Replace with your live Finnhub API key
const API_KEY = "d2jfuf9r01qqoajb3v60d2jfuf9r01qqoajb3v6g";

// Default watchlist
const DEFAULT_STOCKS = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];

export default function Home() {
  const [symbols, setSymbols] = useState(DEFAULT_STOCKS);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("symbol"); // 'symbol' | 'price' | 'change' | 'percent'
  const [sortDir, setSortDir] = useState("asc"); // 'asc' | 'desc'

  useEffect(() => {
    const fetchData = async () => {
      if (!symbols.length) return;
      setLoading(true);
      setError("");

      try {
        const results = await Promise.all(
          symbols.map(async (symbol) => {
            const res = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
            );
            if (!res.ok) throw new Error("Network error");
            const json = await res.json();

            return {
              symbol,
              price: Number(json.c ?? 0),
              change: Number(json.d ?? 0),
              percent: Number(json.dp ?? 0),
            };
          })
        );

        setData(results);
      } catch (err) {
        setError(err?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbols]);

  // Filter + Sort
  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    const base = q ? data.filter((d) => d.symbol.includes(q)) : data;
    const sorted = [...base].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (typeof av === "string") av = av.toUpperCase();
      if (typeof bv === "string") bv = bv.toUpperCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, query, sortKey, sortDir]);

  // Add symbol
  const onAddSymbol = (e) => {
    e.preventDefault();
    const value = query.trim().toUpperCase();
    if (!value) return;
    if (symbols.includes(value)) return;
    setSymbols((prev) => [...prev, value]);
    setQuery("");
  };

  // Remove symbol
  const onRemove = (sym) => {
    setSymbols((prev) => prev.filter((s) => s !== sym));
    setData((prev) => prev.filter((d) => d.symbol !== sym));
  };

  // Sorting handler
  const onSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">📈 Stock Dashboard</h1>
          <p className="text-gray-600">
            Live quotes via Finnhub. Add tickers, search, sort.
          </p>
        </div>

        <form className="flex items-center gap-2" onSubmit={onAddSymbol}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or add symbol (e.g., NVDA)"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring w-56"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </header>

      {/* Loading/Error */}
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {/* Stock Table */}
      {!loading && !error && (
        <StockTable
          stocks={filtered}
          onSort={onSort}
          sortKey={sortKey}
          sortDir={sortDir}
          onRemove={onRemove}
        />
      )}

      <footer className="text-xs text-gray-500 text-center pt-2">
        Data by{" "}
        <a
          className="underline"
          href="https://finnhub.io/"
          target="_blank"
          rel="noreferrer"
        >
          Finnhub
        </a>{" "}
        · Demo app for assignment
      </footer>
    </div>
  );
}
