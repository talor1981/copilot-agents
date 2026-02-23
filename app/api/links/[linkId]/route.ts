import { NextRequest, NextResponse } from 'next/server';
import { deleteLinkAction, updateLinkAction } from '@/app/dashboard/actions';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ linkId: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { linkId } = await context.params;
    const body = await request.json();
    
    console.log('PUT request for linkId:', linkId, 'body:', body);
    
    const result = await updateLinkAction({
      linkId,
      shortCode: body.shortCode,
      originalUrl: body.originalUrl,
    });
    
    console.log('Update result:', result);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 200 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update link' },
      { status: 200 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ linkId: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { linkId } = await context.params;
    
    console.log('DELETE request for linkId:', linkId);
    
    const result = await deleteLinkAction({ linkId });
    
    console.log('Delete result:', result);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 200 } // Return 200 even for logical errors per RTK Query pattern
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete link' },
      { status: 200 } // Return 200 even for errors per RTK Query pattern
    );
  }
}

// Reject all other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
