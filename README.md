# stock-trader-web
Web Application to show current stock data.

## Data
Comes from background applications that are constantly pulling market data and loading it into a PostgreSQL database.

## Data Flow
Web app <--> App API <--> DB API <--> DB

## Change Log
- 1.3.0 Chart fixes, watchlist fix, and AI confirmation dialog (2026-02-18)
    - Fixed chart not rendering minute-level data on short timeframes (1D, 1W, 1M, 3M) — x-axis labels now include the time component so each candle gets a unique position.
    - Added dynamic y-axis scaling so small price movements are visually apparent rather than appearing as a flat line.
    - Fixed watchlist top row being clipped by the column header — switched to the proper `columnHeaderHeight` prop.
    - Added a confirmation dialog when clicking AI insight buttons warning that the model may not be loaded into memory.
- 1.2.0 Added AskAI and implemented UI bugfixes
    - Added Ask AI component and integrated with AI backend.
    - Made UI components work better with mobile.
- 1.1.1 Added Button for 5 Year Chart
    - Added additional button for the 5 year stock lookup.
- 1.1.0 Bug Fixes and minor updates
    - Updated some of the formatting to be more user friendly. Works much better on mobile now.
    - Changed Timing now minute-by-minute, hour-by-hour, day-by-day will show. Did this so that data would render in a timely manner.
    - Modified table structure making it more uniform by removing all usage of "ticker" and replacing it with "symbol"
- 1.0.0 Initial Release
    - Release with simple app usage.
    - Shows a bunch of current stock prices.

