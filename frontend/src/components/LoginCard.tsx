import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LogIn, Shield, User, Wallet } from "lucide-react";

type UserType = "administrador" | "membro" | "tesoureiro" | "";

interface LoginCardProps {
  onLogin: (userType: UserType, userName: string) => void;
}

export function LoginCard({ onLogin }: LoginCardProps) {
  const [userType, setUserType] = useState<UserType>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) {
      alert("Selecione o tipo de usuário");
      return;
    }
    
    // Simulação de login - extrair nome do email
    const userName = email.split("@")[0] || "Usuário";
    
    // Redirecionar para o dashboard correspondente
    onLogin(userType as "administrador" | "membro" | "tesoureiro", userName);
  };

  const getUserIcon = () => {
    switch (userType) {
      case "administrador":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "tesoureiro":
        return <Wallet className="w-5 h-5 text-green-600" />;
      case "membro":
        return <User className="w-5 h-5 text-blue-600" />;
      default:
        return <LogIn className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCardColor = () => {
    switch (userType) {
      case "administrador":
        return "border-red-200 bg-red-50/30";
      case "tesoureiro":
        return "border-green-200 bg-green-50/30";
      case "membro":
        return "border-blue-200 bg-blue-50/30";
      default:
        return "border-gray-200";
    }
  };

  return (
    <Card className={`shadow-lg transition-all duration-300 ${getCardColor()}`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          {getUserIcon()}
          <CardTitle>Acesso ao Sistema</CardTitle>
        </div>
        <CardDescription>
          Entre com suas credenciais para acessar o sistema AVAMUD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* User Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuário</Label>
            <Select value={userType} onValueChange={(value) => setUserType(value as UserType)}>
              <SelectTrigger id="userType">
                <SelectValue placeholder="Selecione o tipo de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="membro">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Membro / Associado</span>
                  </div>
                </SelectItem>
                <SelectItem value="tesoureiro">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span>Tesoureiro</span>
                  </div>
                </SelectItem>
                <SelectItem value="administrador">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span>Administrador</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email ou CPF</Label>
            <Input
              id="email"
              type="text"
              placeholder="Digite seu email ou CPF"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={!userType}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Entrar no Sistema
          </Button>

          {/* Additional Links */}
          <div className="text-center space-y-2 pt-2">
            <a href="#" className="text-sm text-blue-600 hover:underline block">
              Esqueci minha senha
            </a>
            <a href="#" className="text-sm text-gray-600 hover:underline block">
              Solicitar cadastro como associado
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}