import './globals.css'
import { Inter } from 'next/font/google'
import{ Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Learnweb3dao PDF Chatbot',
  description: 'Langchain powered chatbot uses symantic search for more accurate results',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster/>
        {children}
      </body>
    </html>
  )
}
