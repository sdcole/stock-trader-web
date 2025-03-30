import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";
import { CircularProgress, Button, Box, Typography, Paper, Container } from "@mui/material";

// Define the structure of stock data
interface StockData {
    x: string;
    y: number;
}

// Define props for StockChart
interface StockChartProps {
    ticker: string;
    isMobile: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ ticker, isMobile }) => {
    const [data, setData] = useState<StockData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [timeFrame, setTimeFrame] = useState<string>("1d");
    const [chartLabel, setChartLabel] = useState<string>("");
    const [chartLineColor] = useState<string>("#48E5C2");

    // Theme and media query for responsiveness.
    const chartWidth = isMobile ? 350 : 600
    const chartHeight = isMobile ? 200 : 300;

    useEffect(() => {
        fetchStockData(timeFrame);
    }, [timeFrame, ticker]);

    const fetchStockData = async (selectedTimeFrame: string) => {
        setLoading(true);
        try {
            setChartLabel(ticker);
            setError(null);
            setTimeFrame(selectedTimeFrame);

            const response = await axios.get<StockData[]>("https://trade.meshservice.work/api/trade/v1/line-graph", {
                params: { ticker, timeframe: selectedTimeFrame },
            });

            if (response.data && Array.isArray(response.data)) {
                const transformedData: StockData[] = response.data.map((bar: any) => ({
                    x: selectedTimeFrame === "1d" || selectedTimeFrame === "7d" || selectedTimeFrame === "1m" || selectedTimeFrame === "3m"
                        ? new Date(bar.timestamp).toLocaleString()
                        : new Date(bar.timestamp).toLocaleDateString(),
                    y: bar.vw as number,
                }));

                setData(transformedData);
                console.log(transformedData);
            } else {
                setError("No data available for the specified ticker.");
            }
        } catch (err) {
            setError("Error fetching data. Check the ticker or try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ width: "100%", p: 3, borderRadius: 3 }}>
                <Typography variant="h5" color="primary" gutterBottom>
                    Stock Price Chart
                </Typography>

                {/* Time Frame Buttons */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    {["1d", "7d", "1m", "3m", "6m", "1y"].map((frame) => (
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
                                            frame === "6m" ? "6 Months" : "1 Year"}
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
                    <Box sx={{ width: "100%", overflowX: "none", display: "flex", justifyContent: "center" }}>
                        <LineChart
                            xAxis={[{ data: data.map((d) => d.x), scaleType: "point" }]}
                            series={[{ data: data.map((d) => d.y), label: chartLabel, color: chartLineColor, showMark: false }]}
                            width={chartWidth}
                            height={chartHeight}
                        />
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default StockChart;
