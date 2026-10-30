import { NextRequest, NextResponse } from 'next/server';
import { waitlistSchema } from '@/lib/validations';
import { submitWaitlist, checkRateLimit } from '@/lib/data/waitlist';

export async function POST(request: NextRequest) {
  try {
    // 1. IP / Rate Limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous-client';

    if (!checkRateLimit(ip, 6, 60000)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many submissions. Please wait a minute and try again.',
        },
        { status: 429 }
      );
    }

    // 2. Body parsing
    const body = await request.json();

    // 3. Zod validation
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Invalid input';
      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, product_id } = parsed.data;

    // 4. Persistence & duplicate check
    const result = await submitWaitlist(product_id, email);

    if (result.duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 409 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while processing waitlist',
      },
      { status: 500 }
    );
  }
}
