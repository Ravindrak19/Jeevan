import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { webhookUrl, eventType, timestamp, details } = body;

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Google Sheets Webhook URL is missing or invalid.' },
        { status: 400 }
      );
    }

    const trimmedUrl = webhookUrl.trim();

    // Check if user entered a direct docs.google.com spreadsheet link instead of Apps Script Web App URL
    if (trimmedUrl.includes('docs.google.com/spreadsheets')) {
      return NextResponse.json({
        success: false,
        errorType: 'DIRECT_SHEET_URL',
        message:
          'Aapne direct Google Sheet URL (docs.google.com) dala hai. Google Sheet me auto-data add karne ke liye Extensions -> Apps Script ka Web App URL (script.google.com) chahiye hota hai.',
      });
    }

    // Flatten payload so all fields are available at top level as well as inside details
    const payload = {
      eventType: eventType || 'Appointment Booked',
      timestamp: timestamp || new Date().toISOString().slice(0, 16).replace('T', ' '),
      ...(details || {}),
      details: details || {},
    };

    // Post to Google Apps Script Web App
    const response = await fetch(trimmedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const responseText = await response.text();

    return NextResponse.json({
      success: true,
      message: 'Data successfully dispatched to Google Sheet Apps Script!',
      appsScriptResponse: responseText.slice(0, 200),
    });
  } catch (error: any) {
    console.error('Error in /api/sync-sheet:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Server failed to connect to Google Sheet Webhook',
      },
      { status: 500 }
    );
  }
}
