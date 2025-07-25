import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Paper, TextField, Box } from "@mui/material";
import axios from "axios";

interface Company {
  symbol: string;
  companyDescription: string;
  sector: string;
}

interface Props {
  setSelectedSymbol: (symbol: string) => void;
  isMobile: boolean;
  selectedSymbol?: string;
}

const CompanyDataGrid: React.FC<Props> = ({ setSelectedSymbol, isMobile, selectedSymbol }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [searchText, setSearchText] = useState<string>(""); // Search input state
  const [selectedRow, setSelectedRow] = useState<string | null>(null); // Selected row for highlighting
  const [rowHeight, setRowHeight] = useState<number>(50);

  useEffect(() => {
    // Adjust row height based on mobile screen size
    if (isMobile) {
      setRowHeight(25); // Smaller height for mobile
    } else {
      setRowHeight(50); // Default height for desktop
    }

    axios
      .get("https://trade.meshservice.work/api/trade/v1/data-grid")
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setLoading(false);
      });
  }, [isMobile]); // Re-run effect when isMobile changes

  const columns = [
    { field: "symbol", headerName: "Symbol", width: 75 },
    { field: "companyDescription", headerName: "Company Name", width: 200 },
  ];

  // Filter companies based on search text
  const filteredCompanies = companies.filter(
    (company) =>
      company.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
      company.companyDescription.toLowerCase().includes(searchText.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle Enter key to select and highlight the first matching row
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && filteredCompanies.length > 0) {
      const selectedSymbol = filteredCompanies[0].symbol;
      setSelectedSymbol(selectedSymbol);
      setSelectedRow(selectedSymbol);
    }
  };

  return (
    <Paper sx={{ width: 1, p: isMobile ? 1 : 2, borderRadius: 3, boxSizing: 'border-box', maxHeight: isMobile ? 350 : 500, height: '100%', display: 'flex', flexDirection: 'column' }}>
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

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <DataGrid
              rows={filteredCompanies}
              columns={columns}
              loading={loading}
              pageSizeOptions={[]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              getRowId={(row) => row.symbol}
              onRowClick={(params) => {
                setSelectedSymbol(params.row.symbol);
                setSelectedRow(params.row.symbol);
              }}
            rowSelectionModel={selectedRow ? [selectedRow] : selectedSymbol ? [selectedSymbol] : []} // Highlight selected row
              rowHeight={rowHeight} // Apply dynamic row height
              hideFooterSelectedRowCount
              autoHeight={false}
              sx={{
                width: '100%',
                height: '100%',
                "& .MuiDataGrid-footerContainer": {
                  width: '100%',
                  minWidth: 0,
                  overflowX: 'hidden',
                },
                "& .MuiDataGrid-sortIcon": { color: "#48E5C2" },
                "& .MuiDataGrid-menuIconButton": { color: "#48E5C2" },
                "& .MuiDataGrid-filterIcon": { color: "#48E5C2" },
                "& .MuiDataGrid-iconSeparator": { color: "#48E5C2" },
                "& .MuiPaginationItem-root": { color: "#48E5C2" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "#48E5C2" },
                "& .MuiTablePagination-select": { color: "#48E5C2" },
                "& .MuiTablePagination-selectIcon": { color: "#48E5C2" },
                "& .MuiTablePagination-displayedRows": { color: "#48E5C2" },
                "& .Mui-selected": {
                  backgroundColor: "#DA2C38 !important", // Highlight selected row
                  color: "white",
                },
              }}
          />
        </Box>
      </Paper>
  );
};

export default CompanyDataGrid;
