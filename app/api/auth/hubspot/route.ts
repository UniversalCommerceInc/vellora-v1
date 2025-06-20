// app/api/auth/hubspot/route.ts
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const SCOPES = ["oauth"];

const optionalScopes = [
  "crm.objects.contacts.read",
  "crm.objects.contacts.write",
  "crm.objects.deals.read",
  "crm.objects.deals.write",
];

export async function GET(request: Request) {
  const state = randomUUID();

  const clientId = `${process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID}`;
  if (!clientId) {
    return NextResponse.json({ error: "Client ID missing" }, { status: 500 });
  }

  // Include platform parameter in redirect URI
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/oauth/callback?platform=hubspot`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SCOPES.join(" "),
    optional_scope: optionalScopes.join(" "),
    state,
  });

  // Create a temporary page that sets localStorage and redirects
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Connecting to HubSpot...</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #ff7a00, #ff9500);
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
        }
        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #ff7a00;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        h2 { color: #333; margin-bottom: 10px; }
        p { color: #666; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>🔗 Connecting to HubSpot</h2>
        <p>Setting up your integration...</p>
        <div class="spinner"></div>
      </div>
      <script>
        // Store platform info in localStorage for the callback
        localStorage.setItem('hubspot_oauth_state', '${state}');
        localStorage.setItem('oauth_platform', 'hubspot');
        
        // Small delay for better UX, then redirect
        setTimeout(() => {
          window.location.href = 'https://app.hubspot.com/oauth/authorize?${params.toString()}';
        }, 1000);
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
