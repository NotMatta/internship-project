import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { SessionProvider } from "@/components/session-manager";

export const metadata = {
  title: "OTC Password Manager",
  description: " ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider defaultTheme="dark" attribute="class" enableSystem>
            <SessionProvider>
              {children}
            </SessionProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
