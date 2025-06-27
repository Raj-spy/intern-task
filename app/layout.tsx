import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Visible Ratio',
  description: 'Design Tech Studio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
