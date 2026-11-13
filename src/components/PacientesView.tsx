import React, { useState } from 'react';
import { Paciente } from '../lib/db';
import { NovoPacienteForm } from './NovoPacienteForm';
import {
  UserPlus,
  Search,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { DancingSalad } from './DancingSalad';

interface PacientesViewProps {
  nutricionistaId: string;
  pacientes: Paciente[];
  selectedPacienteId: string | null;
  onSelectPaciente: (id: string | null) => void;
  onRefresh: () => void;
}

export const PacientesView: React.FC<PacientesViewProps> = ({
  nutricionistaId,
  pacientes,
  selectedPacienteId,
  onSelectPaciente,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNovoPacienteMode, setIsNovoPacienteMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredPacientes = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.whatsapp?.includes(searchTerm)
  );

  const selectedPaciente = pacientes.find((p) => p.id === selectedPacienteId);

  // Manipulador de sucesso após salvar novo paciente
  const handleNovoPacienteSuccess = (novo: Paciente) => {
    setIsNovoPacienteMode(false);
    onRefresh();
    onSelectPaciente(novo.id);
    setSuccessMessage(`Paciente "${novo.nome}" cadastrado(a) com sucesso!`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  // 1. MODO FORMULÁRIO DE CADASTRO (Página Nova com as 3 Abas)
  if (isNovoPacienteMode) {
    return (
      <NovoPacienteForm
        nutricionistaId={nutricionistaId}
        onSuccess={handleNovoPacienteSuccess}
        onCancel={() => setIsNovoPacienteMode(false)}
      />
    );
  }

  // 2. MODO PERFIL DO PACIENTE
  if (selectedPaciente) {
    const alturaMetros = selectedPaciente.altura;
    const pesoNum = selectedPaciente.peso_inicial;
    let imcStr = '—';
    if (pesoNum && alturaMetros && alturaMetros > 0) {
      const h = alturaMetros > 3 ? alturaMetros / 100 : alturaMetros;
      imcStr = (pesoNum / (h * h)).toFixed(1);
    }

    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold animate-bounce">
            <div className="flex items-center gap-2">
              <span>🎉</span>
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        <button
          onClick={() => onSelectPaciente(null)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-amber-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista de Pacientes
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          {/* Topo do Perfil */}
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 font-black text-2xl flex items-center justify-center shadow-md">
                {selectedPaciente.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {selectedPaciente.nome}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                  {selectedPaciente.data_nascimento && (
                    <span>
                      Nascimento: {new Date(selectedPaciente.data_nascimento).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  {selectedPaciente.sexo && <span>• Sexo: {selectedPaciente.sexo}</span>}
                  <span>
                    • Cadastrado em {new Date(selectedPaciente.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3.5 py-1.5 bg-amber-400 text-slate-950 rounded-full font-black shadow-xs">
                Paciente Ativo
              </span>
            </div>
          </div>

          {/* Cards de Métricas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Peso Inicial
              </span>
              <span className="text-2xl font-black text-slate-900">
                {selectedPaciente.peso_inicial ? `${selectedPaciente.peso_inicial} kg` : '—'}
              </span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Altura
              </span>
              <span className="text-2xl font-black text-slate-900">
                {selectedPaciente.altura ? `${selectedPaciente.altura} m` : '—'}
              </span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                IMC Inicial
              </span>
              <span className="text-2xl font-black text-amber-600">
                {imcStr !== '—' ? `${imcStr} kg/m²` : '—'}
              </span>
            </div>
          </div>

          {/* Informações Pessoais & Contato */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              1. Contato e Identificação
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">WhatsApp / Telefone</span>
                  <span className="text-sm font-bold text-slate-800">
                    {selectedPaciente.whatsapp || 'Não informado'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Email</span>
                  <span className="text-sm font-bold text-slate-800 truncate block">
                    {selectedPaciente.email || 'Não informado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Objetivos & Histórico Clínico */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              2. Perfil Clínico e Objetivos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                  Objetivos Nutricionais
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPaciente.objetivos && selectedPaciente.objetivos.length > 0 ? (
                    selectedPaciente.objetivos.map((obj, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-amber-400/20 text-slate-900 border border-amber-400/40 rounded-lg text-xs font-bold"
                      >
                        {obj}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Nenhum selecionado</span>
                  )}
                </div>
                {selectedPaciente.objetivo_texto && (
                  <p className="text-xs text-slate-600 pt-1 italic">
                    "{selectedPaciente.objetivo_texto}"
                  </p>
                )}
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                  Nível de Atividade Física
                </span>
                <span className="text-sm font-bold text-slate-800 block">
                  {selectedPaciente.nivel_atividade || 'Não informado'}
                </span>
                {selectedPaciente.atividade_fisica && selectedPaciente.atividade_fisica_descricao && (
                  <p className="text-xs text-slate-600">
                    Atividades: {selectedPaciente.atividade_fisica_descricao}
                  </p>
                )}
              </div>
            </div>

            {/* Condições, Restrições e Alergias */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                  Patologias
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedPaciente.patologias && selectedPaciente.patologias.length > 0 ? (
                    selectedPaciente.patologias.map((p, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md font-semibold"
                      >
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Nenhuma</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                  Restrições
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedPaciente.restricoes_alimentares &&
                  selectedPaciente.restricoes_alimentares.length > 0 ? (
                    selectedPaciente.restricoes_alimentares.map((r, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-semibold"
                      >
                        {r}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Nenhuma</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                  Alergias
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedPaciente.alergias && selectedPaciente.alergias.length > 0 ? (
                    selectedPaciente.alergias.map((a, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-red-100 text-red-900 rounded-md font-semibold"
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Nenhuma</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hábitos e Rotina */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              3. Rotina e Hábitos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 font-semibold">Refeições/Dia</span>
                <span className="text-base font-bold text-slate-800">
                  {selectedPaciente.refeicoes_por_dia ? `${selectedPaciente.refeicoes_por_dia}x` : '—'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 font-semibold">Água Diária</span>
                <span className="text-base font-bold text-slate-800">
                  {selectedPaciente.litros_agua ? `${selectedPaciente.litros_agua} litros` : '—'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 font-semibold">Acorda</span>
                <span className="text-base font-bold text-slate-800">
                  {selectedPaciente.horario_acorda || '—'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 font-semibold">Dorme</span>
                <span className="text-base font-bold text-slate-800">
                  {selectedPaciente.horario_dorme || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {selectedPaciente.observacoes && (
            <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/60">
              <span className="text-xs font-bold text-amber-900 block mb-1 uppercase tracking-wider">
                Observações Clínicas
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedPaciente.observacoes}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. MODO LISTAGEM DE PACIENTES
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pacientes
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Gerenciamento completo de pacientes e prontuários
          </p>
        </div>

        {/* Botão Novo Paciente que abre o formulário completo em página nova */}
        <button
          onClick={() => setIsNovoPacienteMode(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-md shadow-amber-400/20 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Paciente</span>
        </button>
      </div>

      {/* Campo de Busca por Nome no topo da listagem */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar paciente por nome, email ou WhatsApp..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition shadow-xs text-slate-800"
        />
      </div>

      {/* Lista de Pacientes / Estado Vazio */}
      {filteredPacientes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <DancingSalad size={80} className="mb-4" />
          <h3 className="text-lg font-bold text-slate-800">
            {pacientes.length === 0
              ? 'Nenhum paciente cadastrado ainda'
              : 'Nenhum paciente encontrado para a busca'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            {pacientes.length === 0
              ? 'Comece agora cadastrando o seu primeiro paciente com todos os dados pessoais, clínicos e hábitos.'
              : 'Verifique se digitou o nome corretamente ou limpe o campo de busca.'}
          </p>
          <button
            onClick={() => setIsNovoPacienteMode(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black rounded-xl transition cursor-pointer shadow-md shadow-amber-400/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar paciente</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPacientes.map((p) => {
            // Objetivo exibido (seja array ou texto)
            const objetivoExibido =
              (p.objetivos && p.objetivos.length > 0 ? p.objetivos[0] : null) ||
              p.objetivo_texto ||
              'Objetivo não informado';

            return (
              <div
                key={p.id}
                onClick={() => onSelectPaciente(p.id)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400/60 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-black flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition">
                      {p.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition truncate">
                        {p.nome}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        Cadastrado em {new Date(p.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                    {/* Objetivo */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-400">Objetivo:</span>
                      <span className="font-bold text-slate-800 truncate">{objetivoExibido}</span>
                    </div>

                    {/* Data da última consulta */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-slate-500">
                        Última consulta:{' '}
                        <strong className="text-slate-800">
                          {p.ultima_consulta
                            ? new Date(p.ultima_consulta).toLocaleDateString('pt-BR')
                            : 'Ainda não consultou'}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-amber-600">
                  <span>Ver perfil completo</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
