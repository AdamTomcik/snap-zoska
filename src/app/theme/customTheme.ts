import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',  // Set red as the primary color for the button
    },
    secondary: {
      main: '#ff5722', // Optional: secondary color for other components
    },
  },
  components: {
    // Customize the MUI Button component globally
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#f44336', // Set the background color to red
          color: 'white',  // Text color inside the button
          '&:hover': {
            backgroundColor: '#d32f2f', // Darker red on hover
          },
          borderRadius: '8px', // Optional: rounded button corners
          padding: '10px 20px', // Optional: button padding
          fontWeight: 'bold', // Optional: make the button text bold
        },
      },
    },
  },
});

export default theme;
