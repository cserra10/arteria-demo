import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Admin Console
   */
  {
    subheader: 'Admin Console',
    items: [
      {
        title: 'Users Management',
        path: paths.dashboard.adminConsole.users.root,
        icon: <Iconify icon="hugeicons:user" />,
      },
      {
        title: 'Groups Management',
        path: paths.dashboard.adminConsole.groups.root,
        icon: <Iconify icon="hugeicons:user-group" />,
      },
    ],
  },
];
