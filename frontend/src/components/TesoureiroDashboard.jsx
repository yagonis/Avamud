import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  LogOut,
  Shield,
  DollarSign,
  CreditCard,
  TrendingUp,
  Search,
  Plus,
  Download,
  Calendar,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { usePayments } from '../hooks/useApi';

export function TesoureiroDashboard({ userName, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("overview");
  
  // Hook para dados financeiros via API
  const { 
    payments, 
    paymentHistory, 
    loading: apiLoading, 
    error: apiError, 
    createPayment, 
    getFinancialStats, 
    getTransactionsForDashboard 
  } = usePayments();

  // Dados das transações vêm da API
  const transactions = getTransactionsForDashboard();
  
  // Dados mock de fallback caso a API não retorne dados
  const [fallbackTransactions] = useState([
    {
      id: "1",
      date: "2025-11-30",
      description: "Mensalidade - Ana Silva",
      amount: 50.00,
      type: "entrada",
      status: "confirmado",
    },
    {
      id: "2", 
      date: "2025-11-29",
      description: "Mensalidade - Bruno Mendes", 
      amount: 50.00,
      type: "entrada",
      status: "confirmado",
    },
    {
      id: "3",
      date: "2025-11-28", 
      description: "Material de escritório",
      amount: 120.50,
      type: "saida",
      status: "confirmado",
    },
    {
      id: "4",
      date: "2025-11-27",
      description: "Mensalidade - Carla Lima",
      amount: 50.00, 
      type: "entrada",
      status: "pendente",
    },
  ]);

  const menuItems = [
    {
      id: "overview",
      label: "Visão Geral",
      icon: TrendingUp,
    },
    {
      id: "transacoes", 
      label: "Transações",
      icon: CreditCard,
    },
    {
      id: "relatorios",
      label: "Relatórios",
      icon: Download,
    },
  ];

  // Cálculos financeiros - priorizar dados da API, fallback para mock
  const financialStats = getFinancialStats();
  const hasApiData = transactions.length > 0;
  
  const totalEntradas = hasApiData ? financialStats.totalEntradas : fallbackTransactions
    .filter(t => t.type === "entrada" && t.status === "confirmado")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalSaidas = hasApiData ? financialStats.totalSaidas : fallbackTransactions
    .filter(t => t.type === "saida" && t.status === "confirmado") 
    .reduce((sum, t) => sum + t.amount, 0);
    
  const saldoAtual = hasApiData ? financialStats.saldoAtual : totalEntradas - totalSaidas;
  
  const transacoesPendentes = hasApiData ? financialStats.transacoesPendentes : 
    fallbackTransactions.filter(t => t.status === "pendente").length;

  // Usar transações da API se disponíveis, senão usar dados mock
  const displayTransactions = hasApiData ? transactions : fallbackTransactions;

  return (
    <div className="flex h-screen bg-background">
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
              <p className="text-xs text-muted-foreground">Tesoureiro</p>
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
            <p className="text-xs text-muted-foreground">Tesoureiro</p>
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
          {/* Visão Geral */}
          {activeMenu === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard Financeiro</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Visão geral das finanças da associação
                </p>
              </div>

              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {saldoAtual.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +2.5% em relação ao mês passado
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {totalEntradas.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Este mês
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground rotate-180" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      R$ {totalSaidas.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Este mês
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {transacoesPendentes}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Transações pendentes
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Últimas Transações */}
              <Card>
                <CardHeader>
                  <CardTitle>Últimas Transações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Carregando transações...</span>
                      </div>
                    ) : apiError ? (
                      <div className="flex items-center justify-center py-4 text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Erro ao carregar dados: {apiError}</span>
                      </div>
                    ) : displayTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            transaction.status === "confirmado" 
                              ? "bg-green-500" 
                              : "bg-yellow-500"
                          }`} />
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            transaction.type === "entrada" 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {transaction.type === "entrada" ? "+" : "-"}R$ {transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transações */}
          {activeMenu === "transacoes" && (
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-4">Todas as Transações</h1>
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p>Seção de transações detalhadas em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Relatórios */}
          {activeMenu === "relatorios" && (
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-4">Relatórios</h1>
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Download className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p>Seção de relatórios em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TesoureiroDashboard;
