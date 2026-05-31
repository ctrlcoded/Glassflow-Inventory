export default function GlassInput({ label, id, error, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`glass-input ${error ? 'border-red-300 focus:ring-red-200' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
}
