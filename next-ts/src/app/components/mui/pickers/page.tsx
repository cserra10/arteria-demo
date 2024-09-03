import { CONFIG } from 'src/config-global';

import { PickerView } from 'src/sections/_examples/mui/picker-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Date picker | MUI - ${CONFIG.site.name}` };

export default function Page() {
  return <PickerView />;
}
