import Script from "next/script";
import { LiveSupportProvider } from "./AllContext/ChatContext";
import { UsersProvider } from "./AllContext/UsersContext";
import "./globals.css";

export const metadata = {
  title: "Movee Tech",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Facebook Meta Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)n=f.fbq;
            n.push=n.queue=[];
            n.loaded=!0;
            n.version='2.0';
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '2214789792589157');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>

      <body>
        {/* Facebook Pixel NoScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2214789792589157&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <UsersProvider>
          <LiveSupportProvider>
            {children}
          </LiveSupportProvider>
        </UsersProvider>
      </body>
    </html>
  );
}