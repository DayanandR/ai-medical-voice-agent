import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/db';
import { usersTable } from '@/config/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await db.select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const subscription = user[0] || {
      subscriptionPlan: 'free',
      subscriptionStatus: 'active',
      credits: 5
    };

    return NextResponse.json({ subscription });

  } catch (error) {
    console.error('User subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
