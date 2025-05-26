import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    background: {
      default: '#222222',
      paper: '#28272D'
    },
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b',
    }
  },
  typography: {
    fontFamily: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif'
  }
});

export default theme;