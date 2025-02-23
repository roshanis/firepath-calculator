
export function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 sm:p-4 border rounded-lg shadow-lg text-xs sm:text-sm max-w-[200px] sm:max-w-none">
        <p className="font-semibold text-gray-900 mb-1">Age: {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-xs sm:text-sm truncate">
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}
