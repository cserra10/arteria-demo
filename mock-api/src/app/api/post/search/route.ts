import type { NextRequest } from 'next/server';

import { STATUS, response, handleError } from 'src/utils/response';

import { _posts } from 'src/_mock/_blog';

// ----------------------------------------------------------------------

export const runtime = 'edge';

/** **************************************
 * Get search results
 *************************************** */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get('query');

    const posts = _posts();

    if (query) {
      const cleanQuery = query?.toLowerCase().trim() ?? '';
      const results = posts.filter((post) => post.title.toLowerCase().includes(cleanQuery));

      return response({ results }, STATUS.OK);
    }

    return response({ results: [] }, STATUS.OK);
  } catch (error) {
    return handleError('Post - Get search', error);
  }
}
