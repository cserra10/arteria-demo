import { STATUS, response, handleError } from 'src/utils/response';

import { _products } from 'src/_mock/_product';

// ----------------------------------------------------------------------

/** **************************************
 * Get list of products
 *************************************** */
export async function GET() {
  try {
    const products = _products();

    return response({ products }, STATUS.OK);
  } catch (error) {
    return handleError('Product - Get list', error);
  }
}
