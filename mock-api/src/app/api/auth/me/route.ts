import { headers } from 'next/headers';

import { verify } from 'src/utils/jwt';
import { STATUS, response } from 'src/utils/response';

import { _users, JWT_SECRET } from 'src/_mock/_auth';

// ----------------------------------------------------------------------

export const runtime = 'edge';

/**
 * This API is used for demo purpose only
 * You should use a real database
 * You should hash the password before saving to database
 * You should not save the password in the database
 * You should not expose the JWT_SECRET in the client side
 */

export async function GET() {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    const data = await verify(accessToken, JWT_SECRET);

    const user = _users.find((_user) => _user.id === data.userId);

    if (!user) {
      return response('Invalid authorization token', STATUS.UNAUTHORIZED);
    }

    return response({ user }, 200);
  } catch (error) {
    console.error('[Auth - me]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

/**
 * Next updated version changes:
 * return response({ message: 'Authorization token missing or invalid' }, STATUS.UNAUTHORIZED);
 * return response({ message: 'Invalid authorization token' }, STATUS.UNAUTHORIZED);
 * return response({ message: 'Internal server error' }, status.error);
 */
