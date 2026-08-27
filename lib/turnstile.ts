/**
 * Cloudflare Turnstile Server-Side Validation Helper
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<{ success: boolean; errorCodes?: string[] }> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // In development/test mode or if secret key is dummy/missing, gracefully bypass
  if (!secretKey || secretKey.includes('your-turnstile-secret-key') || secretKey === 'dummy') {
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await res.json();
    return {
      success: !!data.success,
      errorCodes: data['error-codes'],
    };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, errorCodes: ['internal_error'] };
  }
}
