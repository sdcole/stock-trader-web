# stock-trader-web
Web Application to show current stock data.

## Data
Comes from background applications that are constantly pulling market data and loading it into a PostgreSQL database.

## Data Flow
Web app <--> App API <--> DB API <--> DB

## Change Log
- 1.1.0 Bug Fixes and minor updates
    - Updated some of the formatting to be more user friendly. Works much better on mobile now.
    - Changed Timing now minute-by-minute, hour-by-hour, day-by-day will show. Did this so that data would render in a timely manner.
    - Modified table structure making it more uniform by removing all usage of "ticker" and replacing it with "symbol"
- 1.0.0 Initial Release
    - Release with simple app usage.
    - Shows a bunch of current stock prices.

