import {
  Box,
  Paper,
  ButtonBase,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const isString = (value) => {
  return typeof value === 'string' || value instanceof String;
}

function PaperButton({ link, icon, text, sx }) {
  const theme = useTheme();

  const hoverStyles = link
    ? {
        '&:hover': {
          bgcolor: theme.palette.action.hover,
        },
        cursor: 'pointer',
      }
    : {};

  const image = (
    isString(icon) ? (
      <img
        src={icon}
        alt={text || icon.split('/').pop()}
        style={{ height: '100%', objectFit: 'contain' }}
        loading="lazy"
      />
    ) : (
      icon
    )
  );

  const paper = (
    <Paper
      sx={{
        height: '2rem',
        width: 'auto',
        bgcolor: theme.palette.background.paper,
        p: '4px 8px',
        borderRadius: 2,
        display: 'flex',
        gap: 0.75,
        alignItems: 'center',
        fontFamily: theme.typography.fontFamily,
        fontSize: '1rem',
        ...hoverStyles,
        ...sx
      }}
    >
      {icon && image}
      {text}
    </Paper>
  );

  return link ? (
    <ButtonBase
      href={isString(link) && link}
      onClick={!isString(link) && link}
      target="_blank"
    >
      {paper}
    </ButtonBase>
  ) : (
    <Box>
      {paper}
    </Box>
  );
}

export default PaperButton;