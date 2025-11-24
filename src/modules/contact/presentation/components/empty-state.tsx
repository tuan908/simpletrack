
export function EmptyState() {
  return (
    <div className="w-full bg-white border border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center text-center gap-4">
      <svg
        width="96"
        height="96"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-300"
      >
        <rect
          x="3"
          y="7"
          width="18"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <path
          d="M8 11h.01M12 11h.01M16 11h.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </svg>

      <div className="max-w-xs">
        <h3 className="text-lg font-semibold text-gray-900">No contacts yet</h3>
        <p className="text-sm text-gray-500 mt-2">
          Add your first contact to get started.
        </p>
      </div>
    </div>
  );
}
