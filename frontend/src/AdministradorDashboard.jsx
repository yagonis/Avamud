import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select } from "./components/ui/select";
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
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useUsers } from './hooks/useApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

export function AdministradorDashboard({ userName, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("membros");
  
  // Hook para gerenciar usuários via API
  const { users: allUsers, loading: apiLoading, error: apiError, createUser, updateUser, deleteUser } = useUsers();

  // Filtrar usuários por papel
  const membros = allUsers.filter(user => {
    const papel = user.login?.toLowerCase();
    const isMembro = papel === 'membro' || (!papel || (papel !== 'admin' && papel !== 'tesoureiro'));
    console.log(`User: ${user.nome} | Login: ${user.login} | É membro? ${isMembro}`);
    return isMembro;
  });

  const funcionarios = allUsers.filter(user => {
    const papel = user.login?.toLowerCase();
    const isFuncionario = papel === 'admin' || papel === 'tesoureiro';
    console.log(`User: ${user.nome} | Login: ${user.login} | É funcionário? ${isFuncionario}`);
    return isFuncionario;
  });
  
  console.log('Total allUsers:', allUsers.length);
  console.log('Total membros:', membros.length);
  console.log('Total funcionários:', funcionarios.length);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [editingMembro, setEditingMembro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    status: "ativo",
  });
  const [errors, setErrors] = useState({});

  // Função para validar CPF
  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  };

  // Função para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para formatar CPF
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Função para formatar telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // Função para mostrar notificação
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Função para validar formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEditMembro = (membro) => {
    setEditingMembro(membro);
    setFormData({
      nome: membro.nome,
      cpf: membro.cpf,
      email: membro.email,
      telefone: membro.telefone,
      endereco: membro.endereco,
      status: membro.status,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDeleteMembro = (membro) => {
    setMemberToDelete(membro);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    
    setLoading(true);
    try {
      await deleteUser(memberToDelete.id);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
      showNotification("Membro removido com sucesso!", "success");
    } catch (error) {
      showNotification(`Erro ao remover membro: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMembro = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (editingMembro) {
        // Editar membro existente
        await updateUser(editingMembro.id, formData);
        showNotification("Membro atualizado com sucesso!", "success");
      } else {
        // Adicionar novo membro
        await createUser(formData);
        showNotification("Membro adicionado com sucesso!", "success");
      }

      setIsDialogOpen(false);
      setEditingMembro(null);
    } catch (error) {
      showNotification(`Erro ao salvar membro: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredMembros = membros.filter(
    (membro) =>
      membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membro.cpf.includes(searchTerm) ||
      membro.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFuncionarios = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.cpf.includes(searchTerm) ||
      funcionario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuItems = [
    {
      id: "membros",
      label: "Gerenciar Membros",
      icon: Users,
    },
    {
      id: "financeiro",
      label: "Financeiro",
      icon: DollarSign,
    },
    {
      id: "funcionarios",
      label: "Funcionários",
      icon: UserCog,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg bg-card border">
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className="text-sm">{notification.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-card shadow-lg flex flex-col border-r">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">AVAMUD</h2>
              <p className="text-xs text-muted-foreground">Administrador</p>
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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <Button onClick={onLogout} variant="outline" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">
          {/* Gerenciar Membros */}
          {activeMenu === "membros" && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Gerenciar Membros</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adicione, edite ou remova membros do sistema
                  </p>
                </div>
                <Button onClick={handleAddMembro} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Membro
                </Button>
              </div>

              {/* Search Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                          <TableHead className="hidden md:table-cell">CPF</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                          <TableHead className="hidden xl:table-cell">Endereço</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiLoading ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-8"
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Carregando membros...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : apiError ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-8 text-red-600"
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Erro ao carregar membros: {apiError}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredMembros.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Nenhum membro encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMembros.map((membro) => (
                            <TableRow key={membro.id}>
                              <TableCell className="font-medium">{membro.nome}</TableCell>
                              <TableCell className="hidden md:table-cell">{membro.cpf}</TableCell>
                              <TableCell>{membro.email}</TableCell>
                              <TableCell className="hidden lg:table-cell">{membro.telefone}</TableCell>
                              <TableCell className="hidden xl:table-cell">{membro.endereco}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    onClick={() => handleEditMembro(membro)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Edit className="w-4 h-4 text-blue-600" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteMembro(membro)}
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
              <h1 className="text-2xl font-bold text-foreground mb-4">Financeiro</h1>
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p>Seção em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Funcionários */}
          {activeMenu === "funcionarios" && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Administradores e Tesoureiros do sistema
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

              {/* Funcionários Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Funcionários Cadastrados ({filteredFuncionarios.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Papel</TableHead>
                          <TableHead className="hidden md:table-cell">CPF</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                          <TableHead>Login</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiLoading ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8"
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Carregando funcionários...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : apiError ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-red-600"
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Erro ao carregar funcionários: {apiError}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredFuncionarios.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              Nenhum funcionário encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredFuncionarios.map((funcionario) => (
                            <TableRow key={funcionario.id}>
                              <TableCell className="font-medium">{funcionario.nome}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    funcionario.login?.toLowerCase() === "admin"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {funcionario.login?.toLowerCase() === "admin"
                                    ? "Administrador"
                                    : "Tesoureiro"}
                                </span>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{funcionario.cpf}</TableCell>
                              <TableCell>{funcionario.email}</TableCell>
                              <TableCell className="hidden lg:table-cell">{funcionario.telefone}</TableCell>
                              <TableCell>{funcionario.login}</TableCell>
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
              Preencha as informações do membro abaixo. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => {
                  setFormData({ ...formData, nome: e.target.value });
                  if (errors.nome) setErrors({ ...errors, nome: null });
                }}
                placeholder="Digite o nome completo"
                className={errors.nome ? "border-red-500" : ""}
              />
              {errors.nome && (
                <p className="text-xs text-red-600">{errors.nome}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  setFormData({ ...formData, cpf: formatted });
                  if (errors.cpf) setErrors({ ...errors, cpf: null });
                }}
                placeholder="000.000.000-00"
                maxLength={14}
                className={errors.cpf ? "border-red-500" : ""}
              />
              {errors.cpf && (
                <p className="text-xs text-red-600">{errors.cpf}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                placeholder="email@exemplo.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setFormData({ ...formData, telefone: formatted });
                }}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
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
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveMembro} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Salvando..." : editingMembro ? "Salvar Alterações" : "Adicionar Membro"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o membro <strong>{memberToDelete?.nome}</strong>? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelete}
              variant="destructive"
            >
              Sim, Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
