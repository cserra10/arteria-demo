import { CONFIG } from 'src/config-global';

import { UserListView } from './user-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Users | Admin Console | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <UserListView />;
}
