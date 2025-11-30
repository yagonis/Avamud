import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  LogOut,
  Shield,
  Users,
  DollarSign,
  UserCog,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Membro {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  status: "ativo" | "inativo";
}

interface AdministradorDashboardProps {
  userName: string;
  onLogout: () => void;
}

type MenuItem = "membros" | "financeiro" | "funcionarios";

export function AdministradorDashboard({
  userName,
  onLogout,
}: AdministradorDashboardProps) {
  const [activeMenu, setActiveMenu] = useState<MenuItem>("membros");
  const [membros, setMembros] = useState<Membro[]>([
    {
      id: "1",
      nome: "Ana Silva",
      cpf: "123.456.789-00",
      email: "ana@email.com",
      telefone: "(38) 99999-1111",
      endereco: "Rua das Flores, 123",
      status: "ativo",
    },
    {
      id: "2",
      nome: "Bruno Mendes",
      cpf: "987.654.321-00",
      email: "bruno@email.com",
      telefone: "(38) 99999-2222",
      endereco: "Av. Principal, 456",
      status: "ativo",
    },
    {
      id: "3",
      nome: "Carla Lima",
      cpf: "456.789.123-00",
      email: "carla@email.com",
      telefone: "(38) 99999-3333",
      endereco: "Praça Central, 789",
      status: "inativo",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null);
  const [formData, setFormData] = useState<Omit<Membro, "id">>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    status: "ativo",
  });

  const handleAddMembro = () => {
    setEditingMembro(null);
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      endereco: "",
      status: "ativo",
    });
    setIsDialogOpen(true);
  };

  const handleEditMembro = (membro: Membro) => {
    setEditingMembro(membro);
    setFormData({
      nome: membro.nome,
      cpf: membro.cpf,
      email: membro.email,
      telefone: membro.telefone,
      endereco: membro.endereco,
      status: membro.status,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMembro = (id: string) => {
    if (confirm("Tem certeza que deseja remover este membro?")) {
      setMembros(membros.filter((c) => c.id !== id));
    }
  };

  const handleSaveMembro = () => {
    if (!formData.nome || !formData.cpf || !formData.email) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (editingMembro) {
      // Editar membro existente
      setMembros(
        membros.map((c) =>
          c.id === editingMembro.id ? { ...formData, id: c.id } : c
        )
      );
    } else {
      // Adicionar novo membro
      const newMembro: Membro = {
        ...formData,
        id: Date.now().toString(),
      };
      setMembros([...membros, newMembro]);
    }

    setIsDialogOpen(false);
    setEditingMembro(null);
  };

  const filteredMembros = membros.filter(
    (membro) =>
      membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membro.cpf.includes(searchTerm) ||
      membro.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuItems = [
    {
      id: "membros" as MenuItem,
      label: "Gerenciar Membros",
      icon: Users,
    },
    {
      id: "financeiro" as MenuItem,
      label: "Financeiro",
      icon: DollarSign,
    },
    {
      id: "funcionarios" as MenuItem,
      label: "Funcionários",
      icon: UserCog,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-gray-900">AVAMUD</h2>
              <p className="text-xs text-gray-600">Administrador</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-2">
            <p className="text-sm text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <Button onClick={onLogout} variant="outline" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Gerenciar Membros */}
          {activeMenu === "membros" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-gray-900">Gerenciar Membros</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Adicione, edite ou remova membros do sistema
                  </p>
                </div>
                <Button onClick={handleAddMembro} className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Membro
                </Button>
              </div>

              {/* Search Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar por nome, CPF ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Members Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Membros Cadastrados ({filteredMembros.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Endereço</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembros.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-8 text-gray-500"
                            >
                              Nenhum membro encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMembros.map((membro) => (
                            <TableRow key={membro.id}>
                              <TableCell>{membro.nome}</TableCell>
                              <TableCell>{membro.cpf}</TableCell>
                              <TableCell>{membro.email}</TableCell>
                              <TableCell>{membro.telefone}</TableCell>
                              <TableCell>{membro.endereco}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                                    membro.status === "ativo"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {membro.status === "ativo"
                                    ? "Ativo"
                                    : "Inativo"}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    onClick={() => handleEditMembro(membro)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Edit className="w-4 h-4 text-blue-600" />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleDeleteMembro(membro.id)
                                    }
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Financeiro */}
          {activeMenu === "financeiro" && (
            <div>
              <h1 className="text-gray-900 mb-4">Financeiro</h1>
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Seção em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Funcionários */}
          {activeMenu === "funcionarios" && (
            <div>
              <h1 className="text-gray-900 mb-4">Funcionários</h1>
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <UserCog className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Seção em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Membro Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMembro ? "Editar Membro" : "Adicionar Membro"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do membro abaixo
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Digite o nome"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: e.target.value })
                }
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: e.target.value })
                }
                placeholder="Rua, número, bairro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "ativo" | "inativo",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveMembro} className="bg-red-600 hover:bg-red-700">
              {editingMembro ? "Salvar Alterações" : "Adicionar Membro"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
