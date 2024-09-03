import type { NextRequest } from 'next/server';

import { sign } from 'src/utils/jwt';
import { STATUS, response } from 'src/utils/response';

import { _users, JWT_SECRET, JWT_EXPIRES_IN } from 'src/_mock/_auth';

// ----------------------------------------------------------------------

export const runtime = 'edge';

/**
 * This API is used for demo purpose only
 * You should use a real database
 * You should hash the password before saving to database
 * You should not save the password in the database
 * You should not expose the JWT_SECRET in the client side
 */

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = _users.find((_user) => _user.email === email);

    if (!user) {
      return response('There is no user corresponding to the email address.', STATUS.UNAUTHORIZED);
    }

    if (user?.password !== password) {
      return response('Wrong password', STATUS.UNAUTHORIZED);
    }

    const accessToken = await sign({ userId: user?.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return response({ user, accessToken }, 200);
  } catch (error) {
    console.error('[Auth - sign in]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

/**
 * Next updated version changes:
 * return response( { message: 'There is no user corresponding to the email address.' }, status.unauthorized );
 * return response({ message: 'Wrong password' }, status.unauthorized);
 * return response({ message: 'Internal server error' }, status.error);
 */
