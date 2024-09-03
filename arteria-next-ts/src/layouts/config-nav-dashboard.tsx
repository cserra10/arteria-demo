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
        path: paths.dashboard.adminConsole.users,
        icon: <Iconify icon="hugeicons:user" />,
      },
      {
        title: 'Groups Management',
        path: paths.dashboard.adminConsole.groups,
        icon: <Iconify icon="hugeicons:user-group" />,
      },
    ],
  },
];
