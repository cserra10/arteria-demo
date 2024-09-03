import type { NextRequest } from 'next/server';

import { STATUS, response, handleError } from 'src/utils/response';

import { _products } from 'src/_mock/_product';

// ----------------------------------------------------------------------

export const runtime = 'edge';

/** **************************************
 * Get product details
 *************************************** */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const productId = searchParams.get('productId');

    const products = _products();

    const product = products.find((_product) => _product.id === productId);

    if (!product) {
      return response({ message: 'Product not found!' }, STATUS.NOT_FOUND);
    }

    return response({ product }, STATUS.OK);
  } catch (error) {
    return handleError('Product - Get details', error);
  }
}
