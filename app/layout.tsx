import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const font = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prizm",
  description: "Transform colors across formats, craft beautiful color schemes, extract palettes from images, check accessibility, and simulate colour blindness.",
  openGraph: {
    title: "Prizm",
    description: "Transform colors across formats, craft beautiful color schemes, extract palettes from images, check accessibility, and simulate colour blindness.",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prizm",
    description: "Transform colors across formats, craft beautiful color schemes, extract palettes from images, check accessibility, and simulate colour blindness.",
    images: ["/opengraph-image.png"],
  },
  keywords: [
    "color",
    "codes",
    "css",
    "colors",
    "color codes",
    "color code converter",
    "color code",

    "palette generator",
    "scheme generator",
    "swatch generator",
    "color palette generator",
    "color scheme generator",
    "color swatch generator",
    "color palette",

    "open source",
    "open source color converter",
    "open source color codes",
    "open source color code converter",

    "hex converter",
    "rgb converter",
    "hsl converter",
    "oklch converter",
    "rgba converter",
    "hsla converter",
    "oklch converter",

    // RGB combinations
    "rgb to hex",
    "rgb to hsl",
    "rgb to oklch",
    "rgba to hex",
    "rgba to hsl",
    "rgba to oklch",
    // HSL combinations
    "hsl to hex",
    "hsl to rgb",
    "hsl to oklch",
    "hsla to hex",
    "hsla to rgb",
    "hsla to oklch",
    // OKLCH combinations
    "oklch to hex",
    "oklch to rgb",
    "oklch to hsl",
    // HEX combinations
    "hex to rgb",
    "hex to rgba",
    "hex to hsl",
    "hex to hsla",
    "hex to oklch",

    "hex to css",
    "hex to tailwind",
    "hex to css variables",
    "hex to css custom properties",
    "hex to css variables",

    // CSS/Tailwind combinations
    "rgb to css",
    "rgb to tailwind",
    "rgb to css variables",
    "rgba to css",
    "rgba to tailwind",
    "rgba to css variables",

    "hsl to css",
    "hsl to tailwind",
    "hsl to css variables",
    "hsla to css",
    "hsla to tailwind",
    "hsla to css variables",

    "oklch to css",
    "oklch to tailwind",
    "oklch to css variables",

    "hex to css",
    "hex to tailwind",
    "hex to css variables",

    // Common variations
    "color to css",
    "color to tailwind",
    "color to css variables",
    "color to custom properties",
    "tailwind color converter",
    "css color converter",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} min-h-dvh flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-left" />
        </ThemeProvider>
        
        {/* Footer */}
        <footer className="flex justify-center items-center py-6 mt-auto">
          <div className="text-center">
            <p className="text-xs md:text-sm text-muted-foreground/70 font-light tracking-wide">
              built by{" "}
              <a
                href="https://github.com/0xgordian"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 hover:underline"
              >
                0xgordian
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
