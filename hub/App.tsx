import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';

import { GlobalHeader } from '@hub/components/GlobalHeader';
import { MinimalHeader } from '@hub/components/GlobalHeader/MinimalHeader';
import { RootProvider } from '@hub/providers/Root';

const GoogleTag = React.memo(
  function GoogleTag() {
    return (
      <React.Fragment>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TG90SK6TGB"
        />
        <Script id="gta-hub">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TG90SK6TGB');
        `}</Script>
      </React.Fragment>
    );
  },
  () => true,
);

const Twitter = React.memo(
  function Twitter() {
    return (
      <Script id="twitter">{`window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
          t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
          t._e.push(f);
        };

        return t;
      }(document, "script", "twitter-wjs"));`}</Script>
    );
  },
  () => true,
);

interface Props {
  children?: React.ReactNode;
  minimal?: boolean;
}

export function App(props: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode =
    router.pathname.startsWith('/realm/[id]/governance') ||
    router.pathname.startsWith('/realm/[id]/config');

  useEffect(() => {
    // Only force dark mode for specific routes, otherwise respect theme
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <RootProvider>
      <Head>
        {isDarkMode && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                html {
                  background-color: ${
                    theme === 'Light' ? '#ffffff' : '#171717'
                  };
                }
              `,
            }}
          />
        )}

        <style>{`
          body {
            background-color: #F5F5F5;
            letter-spacing: normal !important;
          }
        `}</style>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <GoogleTag />
      <Twitter />
      {props.minimal ? (
        <MinimalHeader className="fixed h-14 top-0 left-0 right-0 z-30" />
      ) : (
        <GlobalHeader className="fixed h-14 top-0 left-0 right-0 z-30" />
      )}
      {props.children}
    </RootProvider>
  );
}
