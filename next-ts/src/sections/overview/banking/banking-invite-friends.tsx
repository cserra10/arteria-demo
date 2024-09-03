import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import { useTheme } from '@mui/material/styles';

import { varAlpha, bgGradient } from 'src/theme/styles';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  title?: string;
  price?: string;
  imgUrl?: string;
  description?: string;
};

export function BankingInviteFriends({ price, title, imgUrl, description, sx, ...other }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.primary.dark}`,
        }),
        p: 5,
        borderRadius: 2,
        position: 'relative',
        color: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt="invite"
        src={imgUrl}
        sx={{
          top: 16,
          right: 16,
          zIndex: 9,
          width: 128,
          height: 128,
          position: 'absolute',
          ...sx,
        }}
      />

      <Box sx={{ whiteSpace: 'pre-line', typography: 'h6' }}>{title}</Box>
      <Box sx={{ typography: 'h2' }}>{price}</Box>

      <Box sx={{ mt: 2, mb: 3, typography: 'body2' }}>{description}</Box>

      <InputBase
        fullWidth
        placeholder="Email"
        endAdornment={
          <Button color="warning" variant="contained" size="small" sx={{ mr: 0.5 }}>
            Invite
          </Button>
        }
        inputProps={{
          id: 'input-email',
          sx: {
            color: 'common.white',
            '&::placeholder': { opacity: 0.48, color: 'inherit' },
          },
        }}
        sx={{
          pl: 1.5,
          height: 40,
          borderRadius: 1,
          bgcolor: varAlpha(theme.vars.palette.common.blackChannel, 0.12),
        }}
      />
    </Box>
  );
}
