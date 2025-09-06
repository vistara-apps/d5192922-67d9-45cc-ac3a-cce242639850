import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Frame metadata for Farcaster
export async function GET() {
  const frameMetadata = {
    version: "next",
    imageUrl: `${config.app.url}/api/frames/image`,
    button: {
      title: "Open PeerLink",
      action: {
        type: "launch_frame",
        name: "PeerLink",
        url: config.app.url,
        splashImageUrl: `${config.app.url}/splash.png`,
        splashBackgroundColor: "#f0f9ff",
      },
    },
  };

  return NextResponse.json(frameMetadata);
}

// Handle frame interactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, trustedData } = body;

    // Validate frame signature (in production, verify with Farcaster Hub)
    if (!trustedData?.messageBytes) {
      return NextResponse.json(
        { error: 'Invalid frame data' },
        { status: 400 }
      );
    }

    const buttonIndex = untrustedData?.buttonIndex || 1;
    const fid = untrustedData?.fid;
    const inputText = untrustedData?.inputText;

    // Handle different button actions
    switch (buttonIndex) {
      case 1: // Find Tutor
        return handleFindTutor(fid, inputText);
      case 2: // Browse Resources
        return handleBrowseResources(fid);
      case 3: // List Resource
        return handleListResource(fid);
      case 4: // View Sessions
        return handleViewSessions(fid);
      default:
        return handleDefault();
    }
  } catch (error) {
    console.error('Error handling frame interaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Frame action handlers
async function handleFindTutor(fid: number, subject?: string) {
  const imageUrl = `${config.app.url}/api/frames/image/find-tutor?subject=${encodeURIComponent(subject || '')}`;
  
  return NextResponse.json({
    version: "next",
    imageUrl,
    buttons: [
      {
        title: "Search Tutors",
        action: {
          type: "launch_frame",
          name: "Find Tutors",
          url: `${config.app.url}/tutors?subject=${encodeURIComponent(subject || '')}`,
        },
      },
      {
        title: "Back to Home",
        action: {
          type: "post",
          target: `${config.app.url}/api/frames`,
        },
      },
    ],
    input: {
      text: "Enter subject (e.g., Calculus, React)",
    },
  });
}

async function handleBrowseResources(fid: number) {
  const imageUrl = `${config.app.url}/api/frames/image/browse-resources`;
  
  return NextResponse.json({
    version: "next",
    imageUrl,
    buttons: [
      {
        title: "View All Resources",
        action: {
          type: "launch_frame",
          name: "Browse Resources",
          url: `${config.app.url}/resources`,
        },
      },
      {
        title: "Upload Resource",
        action: {
          type: "launch_frame",
          name: "Upload Resource",
          url: `${config.app.url}/resources/upload`,
        },
      },
      {
        title: "Back to Home",
        action: {
          type: "post",
          target: `${config.app.url}/api/frames`,
        },
      },
    ],
  });
}

async function handleListResource(fid: number) {
  const imageUrl = `${config.app.url}/api/frames/image/list-resource`;
  
  return NextResponse.json({
    version: "next",
    imageUrl,
    buttons: [
      {
        title: "Upload Resource",
        action: {
          type: "launch_frame",
          name: "Upload Resource",
          url: `${config.app.url}/resources/upload`,
        },
      },
      {
        title: "My Resources",
        action: {
          type: "launch_frame",
          name: "My Resources",
          url: `${config.app.url}/profile/resources`,
        },
      },
      {
        title: "Back to Home",
        action: {
          type: "post",
          target: `${config.app.url}/api/frames`,
        },
      },
    ],
  });
}

async function handleViewSessions(fid: number) {
  const imageUrl = `${config.app.url}/api/frames/image/view-sessions`;
  
  return NextResponse.json({
    version: "next",
    imageUrl,
    buttons: [
      {
        title: "My Sessions",
        action: {
          type: "launch_frame",
          name: "My Sessions",
          url: `${config.app.url}/sessions`,
        },
      },
      {
        title: "Schedule Session",
        action: {
          type: "launch_frame",
          name: "Schedule Session",
          url: `${config.app.url}/sessions/schedule`,
        },
      },
      {
        title: "Back to Home",
        action: {
          type: "post",
          target: `${config.app.url}/api/frames`,
        },
      },
    ],
  });
}

async function handleDefault() {
  const imageUrl = `${config.app.url}/api/frames/image/home`;
  
  return NextResponse.json({
    version: "next",
    imageUrl,
    buttons: [
      {
        title: "🎓 Find Tutor",
        action: {
          type: "post",
          target: `${config.app.url}/api/frames`,
        },
      },
      {
        title: "📚 Browse Resources",
        action: {
          type: "post",
          target: `${config.app.url}/api/frames`,
        },
      },
      {
        title: "📝 List Resource",
        action: {
          type: "post",
          target: `${config.app.url}/api/frames`,
        },
      },
      {
        title: "📅 View Sessions",
        action: {
          type: "post",
          target: `${config.app.url}/api/frames`,
        },
      },
    ],
  });
}
