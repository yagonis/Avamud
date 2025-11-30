import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { LogOut, User, Search, FileCheck, Bell, AlertCircle } from "lucide-react";

interface Member {
  id: string;
  name: string;
  month: string;
  year: string;
  status: "pendente" | "verificado" | "inadimplente";
  hasComprovante: boolean;
  comprovanteUrl?: string;
}

interface TesoureiroDashboardProps {
  userName: string;
  onLogout: () => void;
}

export function TesoureiroDashboard({ userName, onLogout }: TesoureiroDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Ana Silva",
      month: "FEV",
      year: "2024",
      status: "pendente",
      hasComprovante: true,
      comprovanteUrl: "https://via.placeholder.com/200x150/e0e0e0/666666?text=Comprovante",
    },
    {
      id: "2",
      name: "Bruno Mendes",
      month: "MAR",
      year: "2024",
      status: "pendente",
      hasComprovante: true,
      comprovanteUrl: "https://via.placeholder.com/200x150/e0e0e0/666666?text=Comprovante",
    },
    {
      id: "3",
      name: "Carla Lima",
      month: "ABR",
      year: "2024",
      status: "pendente",
      hasComprovante: true,
      comprovanteUrl: "https://via.placeholder.com/200x150/e0e0e0/666666?text=Comprovante",
    },
    {
      id: "4",
      name: "Daniel Costa",
      month: "JAN",
      year: "2025",
      status: "verificado",
      hasComprovante: true,
    },
    {
      id: "5",
      name: "Elena Souza",
      month: "DEZ",
      year: "2024",
      status: "inadimplente",
      hasComprovante: false,
    },
    {
      id: "6",
      name: "Fernando Alves",
      month: "NOV",
      year: "2024",
      status: "inadimplente",
      hasComprovante: false,
    },
  ]);

  const handleVerificarPagamento = (memberId: string) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId
          ? { ...member, status: "verificado" as const }
          : member
      )
    );
    alert("Pagamento verificado com sucesso!");
  };

  const handleNotificarMembro = (memberName: string) => {
    alert(`Notificação enviada para ${memberName}`);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Member["status"]) => {
    switch (status) {
      case "verificado":
        return <Badge className="bg-green-500">Verificado</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "inadimplente":
        return <Badge className="bg-red-500">Inadimplente</Badge>;
    }
  };

  const pendingCount = members.filter(m => m.status === "pendente").length;
  const inadimplenteCount = members.filter(m => m.status === "inadimplente").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-green-900">AVAMUD</h1>
                <p className="text-sm text-gray-600">{userName} (Tesoureiro)</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-gray-900 mb-4">Validação de Pagamentos</h2>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Aguardando Validação</p>
                    <p className="text-gray-900 mt-1">{pendingCount}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Inadimplentes</p>
                    <p className="text-gray-900 mt-1">{inadimplenteCount}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Membros</p>
                    <p className="text-gray-900 mt-1">{members.length}</p>
                  </div>
                  <User className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar membro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Mensalidade: {member.month}/{member.year}
                    </p>
                  </div>
                  {getStatusBadge(member.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comprovante Preview */}
                {member.hasComprovante && member.comprovanteUrl ? (
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-40">
                    <img
                      src={member.comprovanteUrl}
                      alt="Prévia Comprovante"
                      className="max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-40">
                    <p className="text-sm text-gray-500">Sem comprovante</p>
                  </div>
                )}

                {member.hasComprovante && (
                  <p className="text-sm text-center text-gray-600">Prévia Comprovante</p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {member.status === "pendente" && member.hasComprovante && (
                    <Button
                      onClick={() => handleVerificarPagamento(member.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <FileCheck className="w-4 h-4 mr-1" />
                      Verificar Pagamento
                    </Button>
                  )}
                  
                  {(member.status === "inadimplente" || member.status === "pendente") && (
                    <Button
                      onClick={() => handleNotificarMembro(member.name)}
                      variant="outline"
                      size="sm"
                      className={member.status === "pendente" ? "flex-1" : "w-full"}
                    >
                      <Bell className="w-4 h-4 mr-1" />
                      Notificar Membro
                    </Button>
                  )}

                  {member.status === "verificado" && (
                    <div className="w-full text-center py-2 bg-green-50 rounded text-sm text-green-700">
                      Pagamento Confirmado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum membro encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
}
