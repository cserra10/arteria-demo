import { CONFIG } from 'src/config-global';

import { TabsView } from 'src/sections/_examples/mui/tabs-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Tabs | MUI - ${CONFIG.site.name}` };

export default function Page() {
  return <TabsView />;
}
