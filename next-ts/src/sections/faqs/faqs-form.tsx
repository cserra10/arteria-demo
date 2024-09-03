import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function FaqsForm() {
  return (
    <div>
      <Typography variant="h4">{`Haven't found the right help?`}</Typography>

      <Box gap={3} display="flex" flexDirection="column" sx={{ my: 5 }}>
        <TextField fullWidth label="Name" />
        <TextField fullWidth label="Email" />
        <TextField fullWidth label="Subject" />
        <TextField fullWidth label="Enter your message here." multiline rows={4} />
      </Box>

      <Button size="large" variant="contained">
        Submit
      </Button>
    </div>
  );
}
