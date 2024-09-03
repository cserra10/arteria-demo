import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { CONFIG } from './config-global';

// ----------------------------------------------------------------------

const corsOptions = {
  'Access-Control-Allow-Methods': CONFIG.cors.methods.join(', '),
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function isOriginAllowed(origin: string): boolean {
  if (CONFIG.cors.origins.length > 0) {
    return CONFIG.cors.origins.includes(origin);
  }

  return true;
}

// ----------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = isOriginAllowed(origin);
  const isPreflight = request.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders = {
      ...corsOptions,
      ...(isAllowedOrigin && {
        'Access-Control-Allow-Origin': origin,
      }),
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const response = NextResponse.next();
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
