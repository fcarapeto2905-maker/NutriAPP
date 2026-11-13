import React, { useEffect, useState, useCallback } from 'react';
import { authClient } from '../lib/auth-client';
import {
  getDashboardData,
  getPacientes,
  Paciente,
  PacienteSemRetorno,
} from '../lib/db';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Calendar,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DancingSalad } from './DancingSalad';
import { ScalePersonAnimation } from './ScalePersonAnimation';
import { PacientesView } from './PacientesView';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pacientes'>('dashboard');
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [consultasSemana, setConsultasSemana] = useState<number>(0);
  const [pacientesSemRetorno, setPacientesSemRetorno] = useState<PacienteSemRetorno[]>([]);
  const [pacientesList, setPacientesList] = useState<Paciente[]>([]);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [dashData, listaPacientes] = await Promise.all([
        getDashboardData(user.id),
        getPacientes(user.id),
      ]);

      setTotalPacientes(dashData.totalPacientes);
      setConsultasSemana(dashData.consultasSemana);
      setPacientesSemRetorno(dashData.pacientesSemRetorno);
      setPacientesList(listaPacientes);
    } catch (err) {
      console.error('Erro ao recarregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error('Erro ao sair:', err);
    } finally {
      onLogout();
    }
  };

  const handleGoToPaciente = (id: string) => {
    setSelectedPacienteId(id);
    setActiveTab('pacientes');
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col md:flex-row text-slate-800">
      {/* Menu Lateral Fixo - Azul Escuro Profundo (Slate-900) */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-xl z-20 border-r border-slate-800">
        <div>
          {/* Logo Nutri APP no topo com detalhes em Amarelo */}
          <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-800">
            <DancingSalad size={44} />
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">
                Nutri APP
              </span>
              <span className="text-[11px] text-amber-400 font-bold tracking-wider uppercase">
                CARAPETO Nutri&Health System
              </span>
            </div>
          </div>

          {/* Navegação */}
          <nav className="p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedPacienteId(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-amber-300'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('pacientes');
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'pacientes'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-amber-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>Pacientes</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${
                  activeTab === 'pacientes'
                    ? 'bg-slate-950 text-amber-400'
                    : 'bg-slate-800 text-amber-400 border border-slate-700'
                }`}
              >
                {totalPacientes}
              </span>
            </button>
          </nav>
        </div>

        {/* Perfil & Logout no rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
              {(user?.name || user?.email || 'N').charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="text-sm font-bold text-white block truncate">
                {user?.name || 'Nutricionista'}
              </span>
              <span className="text-xs text-slate-400 block truncate">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition border border-slate-700 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal com tema Cinza & Azul Escuro */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Barra superior */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Área Clínica</span>
            <span>/</span>
            <span className="font-bold text-slate-900 capitalize">{activeTab}</span>
          </div>

          <button
            onClick={loadData}
            title="Atualizar dados em tempo real"
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-amber-400/20 hover:border-amber-400/40 border border-slate-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </header>

        <div className="p-6 sm:p-8 flex-1">
          {activeTab === 'dashboard' ? (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Header do Dashboard */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Olá, {user?.name || 'Doutora'}! 👋
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Painel clínico conectado ao Neon Postgres com atualização em tempo real.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 text-white px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Neon Postgres Ativo</span>
                </div>
              </div>

              {/* Grid dos Cards Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 — Total de pacientes ativos com animação da balança ao lado */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        Card 1 — Pacientes Ativos
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl sm:text-5xl font-black text-slate-900">
                          {loading ? '...' : totalPacientes}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          pacientes cadastrados
                        </span>
                      </div>

                      {/* Animação com pessoa subindo e descendo na balança ao lado */}
                      <div className="flex flex-col items-center shrink-0 pr-1">
                        <ScalePersonAnimation size={76} />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span>Sob seus cuidados clínicos</span>
                    <button
                      onClick={() => setActiveTab('pacientes')}
                      className="text-amber-600 font-bold hover:text-amber-700 hover:underline cursor-pointer"
                    >
                      Gerenciar pacientes →
                    </button>
                  </p>
                </div>

                {/* Card 2 — Consultas da semana */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        Card 2 — Consultas da Semana
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900">
                        {loading ? '...' : consultasSemana}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        agendamentos / realizados
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Registradas para o ciclo da semana corrente</span>
                  </p>
                </div>
              </div>

              {/* Card 3 — Pacientes sem retorno */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Card 3 — Pacientes sem retorno
                      </h2>
                      <p className="text-xs text-slate-500">
                        Última consulta realizada há mais de 30 dias e sem próximo retorno agendado
                      </p>
                    </div>
                  </div>
                  {pacientesSemRetorno.length > 0 && (
                    <span className="text-xs px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-bold">
                      {pacientesSemRetorno.length} precisando de atenção
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="py-8 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-slate-900 rounded-full animate-spin" />
                    <span>Consultando histórico de retornos no banco...</span>
                  </div>
                ) : pacientesSemRetorno.length === 0 ? (
                  <div className="py-8 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-bold mb-2">
                      ✓
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Nenhum paciente sem retorno no momento
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Excelente trabalho! Todos os seus pacientes estão em dia ou com retornos futuros programados.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pacientesSemRetorno.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleGoToPaciente(item.id)}
                        className="py-3.5 px-4 rounded-2xl hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition">
                            {item.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition block">
                              {item.nome}
                            </span>
                            <span className="text-xs text-slate-500">
                              Última consulta em{' '}
                              {new Date(item.ultima_consulta).toLocaleDateString('pt-BR')} (
                              {item.dias_sem_consulta} dias atrás)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="hidden sm:inline-block text-xs font-bold text-slate-800 bg-amber-400/30 px-2.5 py-1 rounded-lg border border-amber-400/50">
                            Reagendar
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <PacientesView
              nutricionistaId={user.id}
              pacientes={pacientesList}
              selectedPacienteId={selectedPacienteId}
              onSelectPaciente={(id) => setSelectedPacienteId(id)}
              onRefresh={loadData}
            />
          )}
        </div>
      </main>
    </div>
  );
};
