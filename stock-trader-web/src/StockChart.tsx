import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";
import { CircularProgress, Chip, Box, Typography } from "@mui/material";

interface StockData {
    x: string;
    y: number;
}

interface StockChartProps {
    symbol: string;
    isMobile: boolean;
}

const timeFrameLabels: Record<string, { short: string; long: string }> = {
    "1d": { short: "1D", long: "Today" },
    "7d": { short: "1W", long: "Past Week" },
    "1m": { short: "1M", long: "Past Month" },
    "3m": { short: "3M", long: "Past 3 Months" },
    "6m": { short: "6M", long: "Past 6 Months" },
    "1y": { short: "1Y", long: "Past Year" },
    "5y": { short: "5Y", long: "Past 5 Years" },
};

const StockChart: React.FC<StockChartProps> = ({ symbol, isMobile }) => {
    const [data, setData] = useState<StockData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [timeFrame, setTimeFrame] = useState<string>("7d");
    const [chartLineColor, setChartLineColor] = useState<string>("#00C805");
    const [chartWidth, setChartWidth] = useState<number>(0);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const chartHeight = isMobile ? 280 : 450;

    // Derived price data
    const currentPrice = data.length > 0 ? data[data.length - 1].y : 0;
    const startPrice = data.length > 0 ? data[0].y : 0;
    const yValues = data.map(d => d.y);
    const yMin = data.length > 0 ? Math.min(...yValues) : 0;
    const yMax = data.length > 0 ? Math.max(...yValues) : 0;
    const yRange = yMax - yMin;
    const yPadding = yRange > 0 ? yRange * 0.1 : yMax * 0.001;
    const yAxisMin = yMin - yPadding;
    const yAxisMax = yMax + yPadding;
    const priceChange = currentPrice - startPrice;
    const percentChange = startPrice !== 0 ? (priceChange / startPrice) * 100 : 0;
    const isPositive = priceChange >= 0;

    useEffect(() => {
        const el = chartContainerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width;
            if (width) setChartWidth(Math.floor(width));
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Abort any in-flight request before starting a new one
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        fetchStockData(timeFrame, controller.signal);

        return () => controller.abort();
    }, [timeFrame, symbol]);

    const fetchStockData = async (selectedTimeFrame: string, signal: AbortSignal) => {
        setLoading(true);
        try {
            setError(null);

            const response = await axios.get<StockData[]>("https://trade.meshservice.work/api/trade/v1/line-graph", {
                params: { symbol, timeframe: selectedTimeFrame },
                signal,
            });

            if (response.data && Array.isArray(response.data)) {
                const transformedData: StockData[] = response.data.map((bar: any) => {
                    const date = new Date(bar.timestamp);
                    let label: string;
                    if (selectedTimeFrame === "1d") {
                        // Minute data — label by time so each minute is a unique x position
                        label = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                    } else if (selectedTimeFrame === "7d") {
                        // Minute data spanning multiple days — include date + time for uniqueness
                        label = date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    } else if (selectedTimeFrame === "1m") {
                        label = date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    } else if (selectedTimeFrame === "3m") {
                        label = date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    } else {
                        label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' });
                    }
                    return { x: label, y: bar.vw as number };
                });

                setData(transformedData);
                setChartLineColor(
                    transformedData[0].y <= transformedData[transformedData.length - 1].y
                        ? "#00C805"
                        : "#FF5252"
                );
            } else {
                setError("No data available for the specified symbol.");
            }
        } catch (err) {
            if (axios.isCancel(err)) return; // Request was superseded, ignore silently
            setError("Error fetching data. Check the symbol or try again.");
            console.error(err);
        } finally {
            if (!signal.aborted) setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", p: isMobile ? 1.5 : 3, boxSizing: 'border-box' }}>
            {/* Hero Price Display */}
            <Box sx={{ textAlign: 'left', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#9E9E9E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {symbol}
                </Typography>
                {data.length > 0 && (
                    <>
                        <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, my: 0.5 }}>
                            ${currentPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: isPositive ? '#00C805' : '#FF5252' }}>
                            {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%)
                            <Box component="span" sx={{ color: '#9E9E9E', ml: 1, fontSize: '0.8125rem' }}>
                                {timeFrameLabels[timeFrame].long}
                            </Box>
                        </Typography>
                    </>
                )}
            </Box>

            {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}

            {/* Chart area */}
            <Box ref={chartContainerRef} sx={{ width: '100%', mx: -1 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: chartHeight }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : data.length > 0 && chartWidth > 0 ? (
                    <LineChart
                        xAxis={[{
                            data: data.map((d) => d.x),
                            scaleType: "point",
                        }]}
                        yAxis={[{ min: yAxisMin, max: yAxisMax }]}
                        leftAxis={null}
                        bottomAxis={null}
                        series={[{
                            data: data.map((d) => d.y),
                            color: chartLineColor,
                            showMark: false,
                            area: true,
                            curve: "catmullRom",
                        }]}
                        grid={{ vertical: false, horizontal: false }}
                        width={chartWidth + 16}
                        height={chartHeight}
                        margin={{ top: 10, right: 0, bottom: 10, left: 0 }}
                        slotProps={{ legend: { hidden: true } }}
                        sx={{
                            '& .MuiAreaElement-root': {
                                fill: chartLineColor,
                                opacity: 0.08,
                            },
                            '& .MuiChartsAxis-root': {
                                display: 'none',
                            },
                        }}
                    />
                ) : null}
            </Box>

            {/* Time Frame Pills */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 0.5, mt: 1.5, pl: 1 }}>
                {Object.keys(timeFrameLabels).map((frame) => (
                    <Chip
                        key={frame}
                        label={timeFrameLabels[frame].short}
                        size="small"
                        onClick={() => setTimeFrame(frame)}
                        sx={{
                            borderRadius: '16px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            px: 0.5,
                            bgcolor: timeFrame === frame ? 'rgba(0,200,5,0.15)' : 'transparent',
                            color: timeFrame === frame ? '#00C805' : '#9E9E9E',
                            border: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: timeFrame === frame ? 'rgba(0,200,5,0.2)' : 'rgba(255,255,255,0.05)',
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default StockChart;
