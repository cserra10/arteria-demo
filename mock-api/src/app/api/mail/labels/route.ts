import { STATUS, response, handleError } from 'src/utils/response';

import { _labels } from 'src/_mock/_mail';

// ----------------------------------------------------------------------

/** **************************************
 * Get labels
 *************************************** */
export async function GET() {
  try {
    return response({ labels: _labels() }, STATUS.OK);
  } catch (error) {
    return handleError('Mail - Get labels', error);
  }
}
