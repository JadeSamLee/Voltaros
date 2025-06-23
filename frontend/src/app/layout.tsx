import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import { ClientLayout } from '@/components/ClientLayout'
import { AppProvider } from '@/context/AppContext'
import { ThemeProvider } from '@/components/ThemeToggle'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'VOLTAROS - Chaos Engineering',
  description: 'AI-Powered Chaos Engineering Platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen w-full')}>
        <AppProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="bubbles">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bubble"></div>
              ))}
            </div>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
