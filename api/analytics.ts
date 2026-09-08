import { BetaAnalyticsDataClient } from '@google-analytics/data';

const json = (res: any, status: number, body: unknown) => {
  res.status(status).json(body);
};

const getEnv = (name: string) => process.env[name] || '';

const cleanPrivateKey = (value: string) =>
  value.trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');

const isAdminSession = async (req: any) => {
  const authorization = req.headers.authorization || '';
  const accessToken = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';
  const supabaseUrl = getEnv('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

  if (!accessToken || !supabaseUrl || !supabaseAnonKey) return false;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.ok;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    if (!(await isAdminSession(req))) {
      return json(res, 401, { error: 'Admin authentication required' });
    }

    const propertyId = getEnv('GA4_PROPERTY_ID');
    const requestedDays = Number(req.query?.days || 30);
    const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
    const startDate = `${days}daysAgo`;
    const encodedServiceAccount = getEnv('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64');
    let clientEmail = getEnv('GOOGLE_CLIENT_EMAIL');
    let privateKey = getEnv('GOOGLE_PRIVATE_KEY');

    if (encodedServiceAccount) {
      const serviceAccount = JSON.parse(
        Buffer.from(encodedServiceAccount, 'base64').toString('utf8'),
      );
      clientEmail = serviceAccount.client_email || clientEmail;
      privateKey = serviceAccount.private_key || privateKey;
    }

    privateKey = cleanPrivateKey(privateKey);

    if (!propertyId || !clientEmail || !privateKey) {
      return json(res, 503, {
        error: 'Variables GA4 manquantes sur Vercel',
        missing: [
          !propertyId && 'GA4_PROPERTY_ID',
          !clientEmail && !encodedServiceAccount && 'GOOGLE_CLIENT_EMAIL',
          !privateKey && !encodedServiceAccount && 'GOOGLE_PRIVATE_KEY',
          !encodedServiceAccount && !getEnv('GOOGLE_CLIENT_EMAIL') && !getEnv('GOOGLE_PRIVATE_KEY') && 'GOOGLE_SERVICE_ACCOUNT_JSON_BASE64',
        ].filter(Boolean),
      });
    }

    const analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    const [summaryResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    });

    const [dailyResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const summary = summaryResponse.rows?.[0]?.metricValues || [];
    const daily = (dailyResponse.rows || []).map((row) => ({
      date: row.dimensionValues?.[0]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
      sessions: Number(row.metricValues?.[1]?.value || 0),
      pageViews: Number(row.metricValues?.[2]?.value || 0),
    }));

    return json(res, 200, {
      period: `${days} derniers jours`,
      activeUsers: Number(summary[0]?.value || 0),
      sessions: Number(summary[1]?.value || 0),
      pageViews: Number(summary[2]?.value || 0),
      daily,
    });
  } catch (error: any) {
    console.error('Google Analytics API error:', error);
    return json(res, 500, {
      error: 'Google Analytics refuse la requête. Vérifiez le rôle Lecteur du compte de service et l’ID de propriété GA4.',
      details: error?.message || 'Unknown error',
    });
  }
}
