import { AuthProvider } from '../context/AuthContext';
import './globals.css'; 
import Navbar from '../components/Navbar';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider><Navbar/>{children}</AuthProvider>
      </body>
    </html>
  );
}

