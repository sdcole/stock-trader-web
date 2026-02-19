import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const rowHeight = isMobile ? 44 : 48;

  useEffect(() => {
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
  }, []);

  const columns: GridColDef[] = [
    {
      field: "symbol",
      headerName: "SYMBOL",
      flex: 0.3,
      minWidth: 70,
      renderCell: (params) => (
        <span style={{ fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "companyDescription",
      headerName: "NAME",
      flex: 0.7,
      minWidth: 120,
      renderCell: (params) => (
        <span style={{ color: '#9E9E9E', fontSize: '0.8125rem' }}>
          {params.value}
        </span>
      ),
    },
  ];

  const filteredCompanies = companies.filter(
    (company) =>
      company.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
      company.companyDescription.toLowerCase().includes(searchText.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && filteredCompanies.length > 0) {
      const sym = filteredCompanies[0].symbol;
      setSelectedSymbol(sym);
      setSelectedRow(sym);
    }
  };

  return (
    <Paper sx={{
      width: 1,
      p: isMobile ? 1.5 : 2,
      boxSizing: 'border-box',
      height: isMobile ? 'calc(100vh - 80px)' : '100%',
      maxHeight: isMobile ? 'none' : 600,
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #2C2C2E',
      overflow: 'hidden',
    }}>
      <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1.5 }}>
        Watchlist
      </Typography>

      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        size="small"
        sx={{ mb: 1.5 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
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
          rowSelectionModel={selectedRow ? [selectedRow] : selectedSymbol ? [selectedSymbol] : []}
          rowHeight={rowHeight}
          columnHeaderHeight={36}
          hideFooterSelectedRowCount
          autoHeight={false}
          sx={{
            width: '100%',
            height: '100%',
            border: 'none',
            '--DataGrid-containerBackground': '#1C1C1E',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#1C1C1E',
              borderBottom: '1px solid #2C2C2E',
            },
            '& .MuiDataGrid-virtualScroller': {
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
            },
            '& .MuiDataGrid-scrollbar': {
              display: 'none',
            },
            '& .MuiDataGrid-main': {
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#9E9E9E',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
            '& .MuiDataGrid-cell': {
              fontSize: '0.8125rem',
              color: '#FFFFFF',
              borderBottom: '1px solid rgba(44,44,46,0.5)',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: 'rgba(0,200,5,0.08) !important',
              '&:hover': {
                backgroundColor: 'rgba(0,200,5,0.12) !important',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #2C2C2E',
            },
            '& .MuiDataGrid-sortIcon': { color: '#9E9E9E' },
            '& .MuiDataGrid-menuIconButton': { color: '#9E9E9E' },
            '& .MuiDataGrid-iconSeparator': { display: 'none' },
            '& .MuiTablePagination-root': { color: '#9E9E9E' },
            '& .MuiTablePagination-selectIcon': { color: '#9E9E9E' },
            '& .MuiTablePagination-displayedRows': { color: '#9E9E9E' },
          }}
        />
      </Box>
    </Paper>
  );
};

export default CompanyDataGrid;
