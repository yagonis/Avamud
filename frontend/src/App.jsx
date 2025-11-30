// Use the example image asset from the `exemplo_figma` folder so the visual matches the example
import image_a719d7cf6dbcef716d4ba410543dd2f3ec13f11b from '../exemplo_figma/assets/a719d7cf6dbcef716d4ba410543dd2f3ec13f11b.png';
import { useState } from "react";
import { LoginCard } from "./components/LoginCard";
import { InfoDropdown } from "./components/InfoDropdown";
import { MembroDashboard } from "./components/MembroDashboard";
import { TesoureiroDashboard } from "./components/TesoureiroDashboard";
import { AdministradorDashboard } from "./components/AdministradorDashboard";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Users, Store, TrendingUp } from "lucide-react";

export default function App() {
  console.log('frontend: App render')
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState("");

  const handleLogin = (userType, name) => {
    setCurrentUser(userType);
    setUserName(name);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserName("");
  };

  // Render dashboard based on user type
  if (currentUser === "administrador") {
    return <AdministradorDashboard userName={userName} onLogout={handleLogout} />;
  }

  if (currentUser === "membro") {
    return <MembroDashboard userName={userName} onLogout={handleLogout} />;
  }

  if (currentUser === "tesoureiro") {
    return <TesoureiroDashboard userName={userName} onLogout={handleLogout} />;
  }

  // Login page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-blue-900">AVAMUD</h1>
              <p className="text-sm text-gray-600">Associação de Vendedores Ambulantes de Diamantina</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          
          {/* About Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-blue-900 mb-4">Bem-vindo ao AVAMUD</h2>
              <p className="text-gray-700 mb-6">
                A Associação de Vendedores Ambulantes de Diamantina é uma organização dedicada a representar, 
                apoiar e fortalecer os vendedores ambulantes da nossa cidade histórica.
              </p>
              
              {/* Welcome Image */}
              <div className="rounded-lg overflow-hidden shadow-lg mb-6">
                <ImageWithFallback 
                  src={image_a719d7cf6dbcef716d4ba410543dd2f3ec13f11b}
                  alt="Bem-vindo ao AVAMUD"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="lg:sticky lg:top-8">
            <LoginCard onLogin={handleLogin} />
          </div>
        </div>
      </main>

      {/* Info Dropdown - Near Footer */}
      <div className="container mx-auto px-4 pb-12">
        <InfoDropdown />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm">© 2025 AVAMUD - Associação de Vendedores Ambulantes de Diamantina</p>
            <p className="text-sm text-gray-400 mt-1">Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
