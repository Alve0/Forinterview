export default function Loader() {
  return (
    <div className="flex justify-center items-center py-6 gap-2">
      <div
        className="w-6 h-6 border-4 border-blue-500 border-t-transparent
rounded-full animate-spin"
      />
      <span className="text-blue-600">Loading…</span>
    </div>
  );
}
