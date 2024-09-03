import { STATUS, response, handleError } from 'src/utils/response';

import { _navItems } from 'src/_mock/_navbar';

// ----------------------------------------------------------------------

/** **************************************
 * Get list of nav items
 *************************************** */
export async function GET() {
  try {
    return response({ navItems: _navItems }, STATUS.OK);
  } catch (error) {
    return handleError('Nav - Get list', error);
  }
}
