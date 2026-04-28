type RequestWithCf = Request & {
  cf?: {
    country?: string;
  };
};

const REGION_POLICY_COOKIE_NAME = 'ch_region_policy';
const REGION_POLICY_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const STRICT_REGION_POLICY = 'strict';
const STRICT_COUNTRIES = new Set([
  'AT',
  'BE',
  'BG',
  'CH',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GB',
  'GR',
  'HR',
  'HU',
  'IE',
  'IS',
  'IT',
  'LI',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
]);

function readCookie(rawCookieHeader = '', name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = rawCookieHeader.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function resolveRegionPolicy(country: string | undefined) {
  const normalizedCountry = String(country || '').trim().toUpperCase();
  if (!normalizedCountry || normalizedCountry === 'T1' || STRICT_COUNTRIES.has(normalizedCountry)) {
    return STRICT_REGION_POLICY;
  }
  return 'standard';
}

function buildSetCookieHeader(policy: string) {
  return `${REGION_POLICY_COOKIE_NAME}=${policy}; Path=/; Max-Age=${REGION_POLICY_COOKIE_MAX_AGE}; SameSite=Lax; Secure; HttpOnly`;
}

export const onRequest = async (context: { request: RequestWithCf; next: () => Promise<Response> }) => {
  const response = await context.next();
  const request = context.request as RequestWithCf;
  const policy = resolveRegionPolicy(request.cf?.country);
  const currentCookie = readCookie(request.headers.get('cookie') || '', REGION_POLICY_COOKIE_NAME);

  if (currentCookie === policy) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.append('Set-Cookie', buildSetCookieHeader(policy));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
