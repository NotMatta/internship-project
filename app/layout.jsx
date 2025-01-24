import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import QueryProvider from "@/components/providers/query-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { PathProvider } from "@/components/providers/path-provider";

export const metadata = {
  title: "OTC Password Manager",
  description: " ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster/>
        <QueryProvider>
          <ThemeProvider defaultTheme="light" attribute="class" enableSystem>
            <SessionProvider>
              <PathProvider>
                {children}
              </PathProvider>
            </SessionProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
