import type { Metadata } from "next";
import "./globals.css";

const origin = "https://steve-personal-org.github.io";
const title = "给最可爱的你｜我们的约会企划";
const description = "选一个喜欢的约会，把这个周末交给心动和期待。";

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: title,
    template: "%s｜我们的约会企划",
  },
  description,
  keywords: ["约会邀请", "约会选择", "情侣", "周末约会"],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    url: origin,
    title,
    description,
    siteName: "我们的约会企划",
    locale: "zh_CN",
    images: [
      {
        url: `${origin}/og.png`,
        width: 1733,
        height: 907,
        alt: "亲爱的，这次约会听你的。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${origin}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
