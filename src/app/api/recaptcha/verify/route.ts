import { NextResponse } from 'next/server';
import * as z from 'zod';
import { isRecaptchaConfigured, verifyRecaptchaToken } from '@/modules/recaptcha/server';

const VerifyBodySchema = z.object({
  token: z.string().min(1),
  action: z.string().min(1).optional(),
});

/**
 * Verifies a Google reCAPTCHA v3 token issued by the browser widget.
 * @param request JSON body with `token` and optional `action`.
 * @returns Verification outcome including score when available.
 */
export const POST = async (request: Request) => {
  if (!isRecaptchaConfigured()) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const parsed = VerifyBodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 422 });
  }

  const result = await verifyRecaptchaToken({
    token: parsed.data.token,
    expectedAction: parsed.data.action,
  });

  if (!result) {
    return NextResponse.json({ error: 'provider_unavailable' }, { status: 502 });
  }

  return NextResponse.json(result, { status: result.success ? 200 : 401 });
};
