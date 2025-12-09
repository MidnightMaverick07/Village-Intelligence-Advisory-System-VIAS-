// Simple chart components using CSS (no external library needed)

interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    maxValue?: number;
    showValues?: boolean;
}

export function BarChart({ data, maxValue, showValues = true }: BarChartProps) {
    const max = maxValue || Math.max(...data.map(d => d.value));

    return (
        <div className="space-y-3">
            {data.map((item, idx) => (
                <div key={idx}>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        {showValues && <span className="text-sm font-medium text-slate-800">{item.value}</span>}
                    </div>
                    <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${item.color || 'bg-paddy-green'}`}
                            style={{ width: `${(item.value / max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
    size?: number;
    showLegend?: boolean;
}

export function DonutChart({ data, size = 150, showLegend = true }: DonutChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulativePercent = 0;

    const segments = data.map(item => {
        const percent = (item.value / total) * 100;
        const startAngle = cumulativePercent * 3.6;
        cumulativePercent += percent;
        const endAngle = cumulativePercent * 3.6;
        return { ...item, percent, startAngle, endAngle };
    });

    // Generate conic-gradient string
    let gradientParts: string[] = [];
    let cumulative = 0;
    data.forEach(item => {
        const percent = (item.value / total) * 100;
        gradientParts.push(`${item.color} ${cumulative}% ${cumulative + percent}%`);
        cumulative += percent;
    });

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className="rounded-full relative"
                style={{
                    width: size,
                    height: size,
                    background: `conic-gradient(${gradientParts.join(', ')})`,
                }}
            >
                {/* Inner circle for donut effect */}
                <div
                    className="absolute bg-white dark:bg-slate-800 rounded-full"
                    style={{
                        width: size * 0.6,
                        height: size * 0.6,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-800">{total}</span>
                </div>
            </div>

            {showLegend && (
                <div className="flex flex-wrap justify-center gap-3">
                    {segments.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-slate-600">
                                {item.label} ({item.percent.toFixed(0)}%)
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

interface LineSparklineProps {
    data: number[];
    color?: string;
    height?: number;
}

export function LineSparkline({ data, color = '#22c55e', height = 40 }: LineSparklineProps) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, idx) => {
        const x = (idx / (data.length - 1)) * 100;
        const y = ((max - value) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="100%" height={height} className="overflow-visible">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Endpoint dot */}
            <circle
                cx={`${100}%`}
                cy={(max - data[data.length - 1]) / range * height}
                r="3"
                fill={color}
            />
        </svg>
    );
}

interface StatCardWithChartProps {
    title: string;
    value: string;
    subtitle?: string;
    trend?: number[];
    icon?: React.ReactNode;
    color?: string;
}

export function StatCardWithChart({ title, value, subtitle, trend, icon, color = '#22c55e' }: StatCardWithChartProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                    {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                </div>
                {icon && <div className="text-slate-400">{icon}</div>}
            </div>
            {trend && (
                <div className="mt-3">
                    <LineSparkline data={trend} color={color} height={30} />
                </div>
            )}
        </div>
    );
}
