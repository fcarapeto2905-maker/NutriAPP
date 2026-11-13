import { createAuthClient } from '@neondatabase/auth';

const fallbackAuthUrl = 'https://ep-floral-lake-b6rpjjed.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth';
const rawAuthUrl = import.meta.env.VITE_NEON_AUTH_URL || fallbackAuthUrl;

// Garantir que a baseURL use estritamente sem barras residuais no final
const baseURL = rawAuthUrl.replace(/\/+$/, '');

export const authClient = createAuthClient(baseURL);
