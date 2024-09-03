import type { NextRequest } from 'next/server';

import { STATUS, response, handleError } from 'src/utils/response';

import { _products } from 'src/_mock/_product';

// ----------------------------------------------------------------------

export const runtime = 'edge';

/** **************************************
 * Get search products
 *************************************** */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get('query');

    const products = _products();

    if (query) {
      const cleanQuery = query.toLowerCase().trim();
      const results = products.filter((product) => product.name.toLowerCase().includes(cleanQuery));

      return response({ results }, STATUS.OK);
    }
    return response({ results: [] }, STATUS.OK);
  } catch (error) {
    return handleError('Product - Get search', error);
  }
}
