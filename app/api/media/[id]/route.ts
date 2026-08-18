import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join('/tmp', 'jw_uploads');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id.includes('..')) {
      return new NextResponse('Invalid media ID', { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, id);

    if (!fs.existsSync(filePath)) {
      // Check public folder as fallback
      const publicPath = path.join(process.cwd(), 'public', id);
      const publicImgPath = path.join(process.cwd(), 'public', 'images', id);

      if (fs.existsSync(publicPath)) {
        const fileBuffer = fs.readFileSync(publicPath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': getContentType(id),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } else if (fs.existsSync(publicImgPath)) {
        const fileBuffer = fs.readFileSync(publicImgPath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': getContentType(id),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }

      return new NextResponse('Image not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': getContentType(id),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving media file:', error);
    return new NextResponse('Server error serving media file', { status: 500 });
  }
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}
