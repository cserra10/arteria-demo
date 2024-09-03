import { CONFIG } from 'src/config-global';

import { SwitchView } from 'src/sections/_examples/mui/switch-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Switch | MUI - ${CONFIG.site.name}` };

export default function Page() {
  return <SwitchView />;
}
