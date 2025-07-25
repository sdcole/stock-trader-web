import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";
import { CircularProgress, Button, Box, Typography, Paper } from "@mui/material";

// Define the structure of stock data
interface StockData {
    x: string;
    y: number;
}

// Define props for StockChart
interface StockChartProps {
    symbol: string;
    isMobile: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ symbol, isMobile }) => {
    const [data, setData] = useState<StockData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [timeFrame, setTimeFrame] = useState<string>("7d");
    const [chartLabel, setChartLabel] = useState<string>("");
    const [chartLineColor, setChartLineColor] = useState<string>("#48E5C2");

    // Theme and media query for responsiveness.
    const chartHeight = isMobile ? 300 : 300;

    useEffect(() => {
        fetchStockData(timeFrame);
    }, [timeFrame, symbol]);

    const fetchStockData = async (selectedTimeFrame: string) => {
        setLoading(true);
        try {
            setChartLabel(symbol);
            setError(null);
            setTimeFrame(selectedTimeFrame);

            const response = await axios.get<StockData[]>("https://trade.meshservice.work/api/trade/v1/line-graph", {
                params: { symbol, timeframe: selectedTimeFrame },
            });

            if (response.data && Array.isArray(response.data)) {
                const transformedData: StockData[] = response.data.map((bar: any) => ({
                    x: selectedTimeFrame === "1d" || selectedTimeFrame === "7d" || selectedTimeFrame === "1m" || selectedTimeFrame === "3m"
                        ? new Date(bar.timestamp).toLocaleString()
                        : new Date(bar.timestamp).toLocaleDateString(),
                    y: bar.vw as number,
                }));

                setData(transformedData);
                if (transformedData[0].y <= transformedData[transformedData.length-1].y) {
                    setChartLineColor("#48E5C2");
                }
                else {
                    setChartLineColor("#DA2C38");
                }
                console.log(transformedData);
            } else {
                setError("No data available for the specified symbol.");
            }
        } catch (err) {
            setError("Error fetching data. Check the symbol or try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
            <Paper sx={{ width: "100%", p: 3, borderRadius: 3 }}>
                <Typography variant="h5" color="primary" gutterBottom>
                    Stock Price Chart
                </Typography>

                {/* Time Frame Buttons */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    {["1d", "7d", "1m", "3m", "6m", "1y", "5y"].map((frame) => (
                        <Button
                            key={frame}
                            variant={timeFrame === frame ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => setTimeFrame(frame)}
                            sx={{ minWidth: 80 }}
                        >
                            {frame === "1d" ? "1 Day" :
                                frame === "7d" ? "7 Days" :
                                    frame === "1m" ? "1 Month" :
                                        frame === "3m" ? "3 Months" :
                                            frame === "6m" ? "6 Months" :
                                                frame === "1y" ? "1 Year": "5 Years"
                                                }
                        </Button>
                    ))}
                </Box>

                {/* Error Message */}
                {error && <Typography color="error">{error}</Typography>}

                {/* Loading Spinner */}
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <CircularProgress color="primary" />
                    </Box>
                )}

                {/* Line Chart */}
                {!loading && data.length > 0 && (
                    <Box sx={{ width: '100%', overflowX: 'hidden', display: 'block' }}>
                        <LineChart
                            xAxis={[{ data: data.map((d) => d.x), scaleType: "point" }]}
                            series={[{ data: data.map((d) => d.y), label: chartLabel, color: chartLineColor, showMark: false }]}
                            width={undefined}
                            height={chartHeight}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                )}
            </Paper>
    );
};

export default StockChart;
