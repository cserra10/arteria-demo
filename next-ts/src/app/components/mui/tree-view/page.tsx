import { CONFIG } from 'src/config-global';

import { TreeView } from 'src/sections/_examples/mui/tree-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Tree view | MUI - ${CONFIG.site.name}` };

export default function Page() {
  return <TreeView />;
}
