import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Paper, TextField } from "@mui/material";
import axios from "axios";

const CompanyDataGrid = ({ setSelectedTicker }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [searchText, setSearchText] = useState(""); // Search input state

  useEffect(() => {
    axios
      .get("http://localhost:5119/v1/companies")
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: "ticker", headerName: "Ticker", width: 150 },
    { field: "companyDescription", headerName: "Company Name", width: 300 },
    { field: "sector", headerName: "Sector", width: 200 },
  ];

  // Filter companies based on search text
  const filteredCompanies = companies.filter(
    (company) =>
      company.ticker.toLowerCase().includes(searchText.toLowerCase()) ||
      company.companyDescription.toLowerCase().includes(searchText.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle Enter key to select first matching row
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && filteredCompanies.length > 0) {
      setSelectedTicker(filteredCompanies[0].ticker);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          NYSE Companies
        </Typography>

        {/* Search Input */}
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress} // Listen for Enter key
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <DataGrid
            rows={filteredCompanies}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 20]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row.ticker}
            onRowClick={(params) => setSelectedTicker(params.row.ticker)}
            sx={{
              "& .MuiDataGrid-sortIcon": {
              color: "#48E5C2", // Sorting icon
            },
            "& .MuiDataGrid-menuIconButton": {
              color: "#48E5C2", // Column menu (3-dot icon)
            },
            "& .MuiDataGrid-filterIcon": {
              color: "#48E5C2", // Filter icon
            },
            "& .MuiDataGrid-iconSeparator": {
              color: "#48E5C2", // Separator line
            },
            "& .MuiPaginationItem-root": {
              color: "#48E5C2", // Pagination buttons
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#48E5C2", // Column header background
            },
            "& .MuiTablePagination-select": {
            color: "#48E5C2", // Text color of the dropdown
          },
          "& .MuiTablePagination-selectIcon": {
            color: "#48E5C2", // Icon color of the dropdown
          },
          "& .MuiTablePagination-displayedRows": {
            color: "#48E5C2", // Color of the displayed rows text
          },
            }}
          />
        </div>
      </Paper>
    </Container>
  );
};

export default CompanyDataGrid;
