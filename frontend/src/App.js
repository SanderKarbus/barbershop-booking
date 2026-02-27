import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BookingForm from './components/BookingForm';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#f50057' },
      background: { default: darkMode ? '#181c24' : '#f4f6fa' },
    },
    typography: {
      fontFamily: 'Roboto, Arial',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4, p: 3, bgcolor: darkMode ? 'background.default' : 'white', borderRadius: 2, boxShadow: 2, position: 'relative' }}>
          <IconButton
            onClick={() => setDarkMode(m => !m)}
            sx={{ position: 'absolute', top: 16, right: 16 }}
            color="primary"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontFamily: '"Pacifico", cursive',
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: { xs: 36, sm: 48, md: 56 },
              mb: 1
            }}
          >
            Dream Barber
          </Typography>
          {!adminMode && !adminToken && (
            <>
              <Typography
                variant="h5"
                align="center"
                sx={{ color: 'text.secondary', fontWeight: 500, mb: 2, mt: 0 }}
              >
                Broneeri aeg juuksurile
              </Typography>
              <BookingForm darkMode={darkMode} />
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
