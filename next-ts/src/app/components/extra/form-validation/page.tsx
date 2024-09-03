import { CONFIG } from 'src/config-global';

import { FormValidationView } from 'src/sections/_examples/extra/form-validation-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Form validation | Components - ${CONFIG.site.name}` };

export default function Page() {
  return <FormValidationView />;
}
