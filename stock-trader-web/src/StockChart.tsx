import React, { useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";
import { TextField, Button, Box, Typography } from "@mui/material";

const StockChart = () => {
    const [ticker, setTicker] = useState("AAPL");
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [timeFrame, setTimeFrame] = useState("1d");
    const [chartLabel, setChartLabel] = useState("");
    const currentDate = new Date();

// Subtract one month
    currentDate.setMonth(currentDate.getMonth() - 1);

// Convert the date to ISO 8601 format (e.g., "2025-01-01T00:00:00Z")
    const startTime = currentDate.toISOString();
    const fetchStockData = async (selectedTimeFrame: string) => {
        try {
            setChartLabel(ticker);
            setError(null);
            setTimeFrame(selectedTimeFrame); // Update time frame
            const response = await axios.get(
                `http://localhost:5120/v1/line-graph`, {
                    params: {
                      ticker: ticker,
                      timeframe: selectedTimeFrame
                    }
                }
            );
            console.log(response);
            // Check if the response contains data
            if (response.data && Array.isArray(response.data)) {
                // Transform the data for the chart
                const transformedData = response.data.map(bar => ({
                    x: new Date(bar.timestamp).toLocaleDateString(), // Format the timestamp to a readable time string
                    y: bar.vw // Use the close price for the y-axis value
                }));

                // Update the chart data state
                setData(transformedData);
            } else {
                setError("No data available for the specified ticker.");
            }
        } catch (err) {
            setError("Error fetching data. Check the ticker or try again.");
            console.error(err); // Log the error for debugging purposes
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", mt: 4 }}>
            <Typography variant="h5" gutterBottom>Stock Price Chart</Typography>

            {/* Input Field and Button */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
                <TextField
                    label="Enter Ticker"
                    variant="outlined"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                />
                <Button variant="contained" onClick={() => fetchStockData(timeFrame)}>Fetch Data</Button>
            </Box>

            {/* Time Frame Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
                {["1d", "7d", "1m", "3m", "6m", "1y"].map((frame) => (
                    <Button
                        key={frame}
                        variant={timeFrame === frame ? "contained" : "outlined"}
                        onClick={() => fetchStockData(frame)}
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
                    series={[{ data: data.map(d => d.y), label: chartLabel }]}
                    width={600}
                    height={300}
                />
            )}
        </Box>
    );
};

export default StockChart;
