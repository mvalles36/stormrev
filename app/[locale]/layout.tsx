import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { createTranslator, NextIntlClientProvider } from "next-intl";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

async function getLocales(locale: string) {
  try {
    return (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const messages = await getLocales(locale);

  const t = createTranslator({ locale, messages });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: t("RootLayout.title"),
    description: t("RootLayout.description"),
    openGraph: {
      images: [
        {
          url: "/images/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: t("RootLayout.title"),
        },
      ],
    },
    twitter: {
      cardType: "summary_large_image",
      image: "/images/opengraph-image.png",
      width: 1200,
      height: 630,
      alt: t("RootLayout.title"),
    },
  };
}

export default async function RootLayout(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  const messages = await getLocales(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
        />
        <meta property="og:url" content="https://www.stormrev" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="StormRev" />
        <meta
          property="og:description"
          content="StormRev is a roofing sales development platform designed by roofing sales people for roofing sales people to get more meetings for more commissions in record breakiig time.."
        />
        <meta property="og:image" content="https://stormrev.com/api/v1/og" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="stormrev.com" />
        <meta property="twitter:url" content="https://www.stormrev.com" />
        <meta name="twitter:title" content="StormRev" />
        <meta
          name="twitter:description"
          content="NextCRM is an open source CRM build on top of NextJS. Technology stack: NextJS with Typescrtipt, MongoDB, TailwindCSS, React, Prisma, shadCN, resend.com, react.email and more."
        />
        <meta name="twitter:image" content="https://nextcrm.io/api/og" />
      </head>
      <body className={inter.className + " min-h-screen"}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
