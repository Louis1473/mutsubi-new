// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'Kiei',
  description: 'Next.js + Tailwind',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
