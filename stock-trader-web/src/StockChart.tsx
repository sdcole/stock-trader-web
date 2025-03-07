import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const StockChart = ({ticker}) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [timeFrame, setTimeFrame] = useState("1d");
    const [chartLabel, setChartLabel] = useState("");
    const [chartLineColor, setChartLineColor] = useState("#48E5C2");
    useEffect(() => {
        fetchStockData(timeFrame);
    }, [timeFrame, ticker]);

    const fetchStockData = async (selectedTimeFrame) => {
        try {
            setChartLabel(ticker);
            setError(null);
            setTimeFrame(selectedTimeFrame);
            const response = await axios.get("http://localhost:5120/v1/line-graph", {
                params: { ticker, timeframe: selectedTimeFrame }
            });

            if (response.data && Array.isArray(response.data)) {
                const transformedData = response.data.map(bar => ({
                    x: new Date(bar.timestamp).toLocaleDateString(),
                    y: bar.vw
                }));
                setData(transformedData);
            } else {
                setError("No data available for the specified ticker.");
            }
        } catch (err) {
            setError("Error fetching data. Check the ticker or try again.");
            console.error(err);
        }
    };

    return (
        <Paper sx={{ maxWidth: 650, mx: "auto", mt: 4, p: 3, borderRadius: 3, backgroundColor: "background.paper" }}>
            <Typography variant="h5" color="primary" gutterBottom>
                Stock Price Chart
            </Typography>

            

            {/* Time Frame Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
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

            {/* Line Chart */}
            {data.length > 0 && (
                <LineChart
                    xAxis={[{ data: data.map(d => d.x), scaleType: "point" }]}
                    series={[{ data: data.map(d => d.y), label: chartLabel, color: chartLineColor, showMark: false }]}
                    width={600}
                    height={300}
                    
                />
            )}
        </Paper>
    );
};

export default StockChart;
