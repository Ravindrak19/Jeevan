import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join('/tmp', 'jw_uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureUploadDir();

    const contentType = req.headers.get('content-type') || '';

    let filename = '';
    let buffer: Buffer;

    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { dataUrl, name } = body;

      if (!dataUrl || !dataUrl.includes('base64,')) {
        return NextResponse.json(
          { success: false, message: 'Invalid image dataUrl provided' },
          { status: 400 }
        );
      }

      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json(
          { success: false, message: 'Could not parse base64 image data' },
          { status: 400 }
        );
      }

      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const base64Data = matches[2];
      buffer = Buffer.from(base64Data, 'base64');
      const safeName = (name || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
      filename = `${safeName}_${Date.now()}.${ext}`;
    } else {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, message: 'No file uploaded' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      const ext = path.extname(file.name) || '.jpg';
      const safeName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      filename = `${safeName}_${Date.now()}${ext}`;
    }

    const filePath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/api/media/${filename}`;

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully!',
      url: publicUrl,
    });
  } catch (error: any) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
