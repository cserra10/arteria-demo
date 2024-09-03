import { STATUS, response, handleError } from 'src/utils/response';

import { _posts } from 'src/_mock/_blog';

// ----------------------------------------------------------------------

/** **************************************
 * Get list of posts
 *************************************** */
export async function GET() {
  try {
    const posts = _posts();

    return response({ posts }, STATUS.OK);
  } catch (error) {
    return handleError('Post - Get list', error);
  }
}
