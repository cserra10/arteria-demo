import type { NextRequest } from 'next/server';

import { STATUS, response, handleError } from 'src/utils/response';

// ----------------------------------------------------------------------

export const runtime = 'edge';

const _products = [...Array(100)].map((_, index) => ({
  id: `id-${index + 1}`,
  name: `product-${index + 1}`,
}));

/** **************************************
 * Get list of products
 *************************************** */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Extract and validate query parameters
  let page = parseInt(searchParams.get('page') || '0', 10);
  let perPage = parseInt(searchParams.get('perPage') || '10', 10);

  // Set default values if parameters are invalid
  page = Number.isNaN(page) || page < 1 ? 1 : page;
  perPage = Number.isNaN(perPage) || perPage < 1 ? 10 : perPage;

  try {
    const _startIndex = (page - 1) * perPage;
    const _endIndex = _startIndex + perPage;

    const products = _products.slice(_startIndex, _endIndex);
    const totalPages = Math.ceil(_products.length / perPage);

    response({ products, totalPages }, STATUS.OK);
  } catch (error) {
    return handleError('Pagination - Get details', error);
  }
}
