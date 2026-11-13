import React, { useState, useMemo } from 'react';
import { createPaciente, Paciente } from '../lib/db';
import { CharacterIllustration, DoctorIllustration } from './Illustrations';
import { EmptyingPlateAnimation } from './EmptyingPlateAnimation';
import {
  User,
  Activity,
  Apple,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  Scale,
  Ruler,
} from 'lucide-react';

interface NovoPacienteFormProps {
  nutricionistaId: string;
  onSuccess: (novoPaciente: Paciente) => void;
  onCancel: () => void;
}

export const NovoPacienteForm: React.FC<NovoPacienteFormProps> = ({
  nutricionistaId,
  onSuccess,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'pessoal' | 'clinico' | 'habitos'>('pessoal');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ABA 1 — Pessoal
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // ABA 2 — Clínico
  const [pesoKg, setPesoKg] = useState('');
  const [alturaCm, setAlturaCm] = useState('');
  const [objetivosSelecionados, setObjetivosSelecionados] = useState<string[]>([]);
  const [objetivoTexto, setObjetivoTexto] = useState('');
  const [nivelAtividade, setNivelAtividade] = useState('');
  const [patologiasSelecionadas, setPatologiasSelecionadas] = useState<string[]>([]);
  const [outraPatologia, setOutraPatologia] = useState('');
  const [restricoesSelecionadas, setRestricoesSelecionadas] = useState<string[]>([]);
  const [outraRestricao, setOutraRestricao] = useState('');
  const [alergiasSelecionadas, setAlergiasSelecionadas] = useState<string[]>([]);
  const [outraAlergia, setOutraAlergia] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const [suplementos, setSuplementos] = useState('');

  // ABA 3 — Hábitos
  const [refeicoesDia, setRefeicoesDia] = useState('');
  const [horarioAcorda, setHorarioAcorda] = useState('');
  const [horarioDorme, setHorarioDorme] = useState('');
  const [litrosAgua, setLitrosAgua] = useState('');
  const [praticaAtividade, setPraticaAtividade] = useState<boolean | null>(null);
  const [atividadeDescricao, setAtividadeDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Idade calculada automaticamente
  const idade = useMemo(() => {
    if (!dataNascimento) return null;
    const birth = new Date(dataNascimento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  }, [dataNascimento]);

  // IMC Calculado automaticamente: Peso (kg) / (Altura em metros)^2
  const imcCalculado = useMemo(() => {
    const pesoNum = parseFloat(pesoKg);
    const alturaNum = parseFloat(alturaCm);
    if (!pesoNum || !alturaNum || alturaNum <= 0) return null;
    const alturaMetros = alturaNum > 3 ? alturaNum / 100 : alturaNum; // aceita cm ou m
    const imc = pesoNum / (alturaMetros * alturaMetros);
    return imc.toFixed(1);
  }, [pesoKg, alturaCm]);

  // Formatação de hora inteligente (ex: 6 -> 06:00, 630 -> 06:30, 23 -> 23:00)
  const formatHourString = (val: string): string => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return '';
    if (clean.length <= 2) {
      const h = parseInt(clean, 10);
      if (h >= 0 && h <= 23) {
        return `${clean.padStart(2, '0')}:00`;
      }
    } else if (clean.length === 3) {
      // 630 -> 06:30
      const h = clean.slice(0, 1).padStart(2, '0');
      const m = clean.slice(1, 3);
      return `${h}:${m}`;
    } else if (clean.length >= 4) {
      // 2230 -> 22:30
      const h = clean.slice(0, 2);
      const m = clean.slice(2, 4);
      return `${h}:${m}`;
    }
    return val;
  };

  // Helper para múltipla escolha com 'Nenhum'
  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    if (item === 'Nenhum') {
      if (list.includes('Nenhum')) {
        setList([]);
      } else {
        setList(['Nenhum']);
      }
      return;
    }

    const withoutNone = list.filter((i) => i !== 'Nenhum');
    if (withoutNone.includes(item)) {
      setList(withoutNone.filter((i) => i !== item));
    } else {
      setList([...withoutNone, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setActiveTab('pessoal');
      setError('O nome completo do paciente é obrigatório.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Processar arrays finais combinando opções + campo de texto adicional
      const finalPatologias = [...patologiasSelecionadas];
      if (outraPatologia.trim() && !finalPatologias.includes(outraPatologia.trim())) {
        finalPatologias.push(outraPatologia.trim());
      }

      const finalRestricoes = [...restricoesSelecionadas];
      if (outraRestricao.trim() && !finalRestricoes.includes(outraRestricao.trim())) {
        finalRestricoes.push(outraRestricao.trim());
      }

      const finalAlergias = [...alergiasSelecionadas];
      if (outraAlergia.trim() && !finalAlergias.includes(outraAlergia.trim())) {
        finalAlergias.push(outraAlergia.trim());
      }

      const alturaMetros = alturaCm ? (parseFloat(alturaCm) > 3 ? parseFloat(alturaCm) / 100 : parseFloat(alturaCm)) : null;

      const novo = await createPaciente({
        nutricionista_id: nutricionistaId,
        nome: nome.trim(),
        data_nascimento: dataNascimento || null,
        sexo: sexo || null,
        whatsapp: whatsapp.trim() || telefone.trim() || null,
        email: email.trim() || null,
        peso_inicial: pesoKg ? parseFloat(pesoKg) : null,
        altura: alturaMetros,
        objetivos: objetivosSelecionados.length > 0 ? objetivosSelecionados : null,
        objetivo_texto: objetivoTexto.trim() || null,
        nivel_atividade: nivelAtividade || null,
        patologias: finalPatologias.length > 0 ? finalPatologias : null,
        restricoes_alimentares: finalRestricoes.length > 0 ? finalRestricoes : null,
        alergias: finalAlergias.length > 0 ? finalAlergias : null,
        medicamentos: medicamentos.trim() || null,
        suplementos: suplementos.trim() || null,
        refeicoes_por_dia: refeicoesDia ? parseInt(refeicoesDia, 10) : null,
        horario_acorda: horarioAcorda || null,
        horario_dorme: horarioDorme || null,
        litros_agua: litrosAgua ? parseFloat(litrosAgua) : null,
        atividade_fisica: praticaAtividade,
        atividade_fisica_descricao: praticaAtividade ? atividadeDescricao.trim() : null,
        observacoes: observacoes.trim() || null,
      });

      onSuccess(novo);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro ao cadastrar paciente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Topo do Formulário */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-amber-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista
        </button>
        <span className="text-xs px-3 py-1 bg-amber-400/20 text-slate-900 border border-amber-400/40 rounded-full font-bold">
          Novo Cadastro Clínico
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cabeçalho do Card */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Cadastrar Paciente</h1>
            <p className="text-xs text-slate-400 mt-1">
              Preencha os dados do paciente. Apenas o nome completo é obrigatório.
            </p>
          </div>

          {/* Abas Superiores */}
          <div className="flex bg-slate-800 p-1.5 rounded-2xl gap-1 border border-slate-700 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('pessoal')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'pessoal'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. Pessoal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('clinico')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'clinico'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>2. Clínico</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('habitos')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'habitos'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>3. Hábitos</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* ========================================================= */}
          {/* ABA 1 — PESSOAL */}
          {/* ========================================================= */}
          {activeTab === 'pessoal' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <CharacterIllustration size={72} />
                  <div>
                    <h3 className="text-base font-black text-slate-900">Identificação Pessoal</h3>
                    <p className="text-xs text-slate-500">
                      Informações básicas e dados de contato do paciente
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Ana Clara dos Santos"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Data de Nascimento</label>
                    {idade !== null && (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        {idade} anos
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sexo</label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                  >
                    <option value="">Selecione...</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(11) 3333-3333"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="paciente@exemplo.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('clinico')}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Próximo: Clínico →
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ABA 2 — CLÍNICO */}
          {/* ========================================================= */}
          {activeTab === 'clinico' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <DoctorIllustration size={72} />
                  <div>
                    <h3 className="text-base font-black text-slate-900">Avaliação Clínica & Antropométrica</h3>
                    <p className="text-xs text-slate-500">
                      Medidas, cálculo de IMC automático e histórico de saúde
                    </p>
                  </div>
                </div>
              </div>

              {/* Medidas e IMC */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Peso Atual</label>
                  <div className="relative">
                    <Scale className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={pesoKg}
                      onChange={(e) => setPesoKg(e.target.value)}
                      placeholder="70.5"
                      className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                      kg
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Altura</label>
                  <div className="relative">
                    <Ruler className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      step="1"
                      value={alturaCm}
                      onChange={(e) => setAlturaCm(e.target.value)}
                      placeholder="175"
                      className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                      cm
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">IMC (Automático)</label>
                  <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">
                      {imcCalculado ? `${imcCalculado} kg/m²` : '—'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      {imcCalculado
                        ? parseFloat(imcCalculado) < 18.5
                          ? 'Abaixo'
                          : parseFloat(imcCalculado) < 25
                          ? 'Normal'
                          : parseFloat(imcCalculado) < 30
                          ? 'Sobrepeso'
                          : 'Obesidade'
                        : 'Preencha peso e altura'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Objetivos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Objetivo (Múltipla Escolha)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    'Emagrecer',
                    'Ganhar massa',
                    'Controlar diabetes',
                    'Saúde geral',
                    'Performance esportiva',
                    'Reeducação alimentar',
                  ].map((obj) => {
                    const sel = objetivosSelecionados.includes(obj);
                    return (
                      <button
                        key={obj}
                        type="button"
                        onClick={() =>
                          setObjetivosSelecionados((prev) =>
                            prev.includes(obj) ? prev.filter((i) => i !== obj) : [...prev, obj]
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          sel
                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sel ? '✓ ' : '+ '}
                        {obj}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={objetivoTexto}
                  onChange={(e) => setObjetivoTexto(e.target.value)}
                  placeholder="Informações complementares sobre o objetivo..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                />
              </div>

              {/* Nível de Atividade Física */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Nível de Atividade Física (Seleção Única)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    'Sedentário',
                    'Levemente ativo',
                    'Moderadamente ativo',
                    'Muito ativo',
                    'Extremamente ativo',
                  ].map((nivel) => {
                    const sel = nivelAtividade === nivel;
                    return (
                      <button
                        key={nivel}
                        type="button"
                        onClick={() => setNivelAtividade(nivel)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center transition cursor-pointer border ${
                          sel
                            ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {nivel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patologias */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Patologias ou Condições de Saúde
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    'Nenhum',
                    'Diabetes',
                    'Hipertensão',
                    'Hipotireoidismo',
                    'Hipertireoidismo',
                    'Síndrome do ovário policístico',
                    'Doença celíaca',
                    'Colesterol alto',
                  ].map((item) => {
                    const sel = patologiasSelecionadas.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          toggleSelection(patologiasSelecionadas, setPatologiasSelecionadas, item)
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          sel
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sel ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={outraPatologia}
                  onChange={(e) => setOutraPatologia(e.target.value)}
                  placeholder="Outra patologia ou condição adicional..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                />
              </div>

              {/* Restrições Alimentares */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Restrições Alimentares
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Nenhum', 'Lactose', 'Glúten', 'Açúcar', 'Carne vermelha', 'Frutos do mar'].map(
                    (item) => {
                      const sel = restricoesSelecionadas.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            toggleSelection(restricoesSelecionadas, setRestricoesSelecionadas, item)
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            sel
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}
                          {item}
                        </button>
                      );
                    }
                  )}
                </div>
                <input
                  type="text"
                  value={outraRestricao}
                  onChange={(e) => setOutraRestricao(e.target.value)}
                  placeholder="Outra restrição alimentar..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                />
              </div>

              {/* Alergias Alimentares */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Alergias Alimentares
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Nenhum', 'Amendoim', 'Leite', 'Ovo', 'Soja', 'Trigo', 'Frutos do mar'].map(
                    (item) => {
                      const sel = alergiasSelecionadas.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            toggleSelection(alergiasSelecionadas, setAlergiasSelecionadas, item)
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            sel
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}
                          {item}
                        </button>
                      );
                    }
                  )}
                </div>
                <input
                  type="text"
                  value={outraAlergia}
                  onChange={(e) => setOutraAlergia(e.target.value)}
                  placeholder="Outra alergia alimentar..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                />
              </div>

              {/* Medicamentos & Suplementos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Medicamentos Contínuos
                  </label>
                  <textarea
                    rows={2}
                    value={medicamentos}
                    onChange={(e) => setMedicamentos(e.target.value)}
                    placeholder="Ex: Puran T4 50mcg, Losartana..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Suplementos em Uso
                  </label>
                  <textarea
                    rows={2}
                    value={suplementos}
                    onChange={(e) => setSuplementos(e.target.value)}
                    placeholder="Ex: Creatina 5g, Vitamina D3, Whey Protein..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('pessoal')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  ← Voltar: Pessoal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('habitos')}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Próximo: Hábitos →
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ABA 3 — HÁBITOS */}
          {/* ========================================================= */}
          {activeTab === 'habitos' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Topo com prato de comida esvaziando no canto superior direito */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 relative overflow-hidden">
                <div>
                  <h3 className="text-base font-black text-slate-900">Rotina & Hábitos Alimentares</h3>
                  <p className="text-xs text-slate-500">
                    Horários, consumo hídrico, refeições diárias e atividades
                  </p>
                </div>

                {/* Animação do prato esvaziando no canto superior direito */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-[11px] font-bold text-slate-400">
                    Prato Esvaziando
                  </span>
                  <EmptyingPlateAnimation size={70} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantas refeições faz por dia?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={refeicoesDia}
                    onChange={(e) => setRefeicoesDia(e.target.value)}
                    placeholder="Ex: 4"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantidade de água por dia
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={litrosAgua}
                      onChange={(e) => setLitrosAgua(e.target.value)}
                      placeholder="2.5"
                      className="w-full px-4 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                      litros
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Horário que acorda (ex: 6 ou 630)
                  </label>
                  <input
                    type="text"
                    value={horarioAcorda}
                    onChange={(e) => setHorarioAcorda(e.target.value)}
                    onBlur={() => setHorarioAcorda(formatHourString(horarioAcorda))}
                    placeholder="Ex: 06:30"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Horário que dorme (ex: 23 ou 2230)
                  </label>
                  <input
                    type="text"
                    value={horarioDorme}
                    onChange={(e) => setHorarioDorme(e.target.value)}
                    onBlur={() => setHorarioDorme(formatHourString(horarioDorme))}
                    placeholder="Ex: 23:00"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                  />
                </div>
              </div>

              {/* Pratica Atividade Física */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Pratica atividade física?
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPraticaAtividade(true)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        praticaAtividade === true
                          ? 'bg-amber-400 text-slate-950 border-amber-500 font-extrabold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPraticaAtividade(false);
                        setAtividadeDescricao('');
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        praticaAtividade === false
                          ? 'bg-slate-900 text-white border-slate-900 font-extrabold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Não
                    </button>
                  </div>
                </div>

                {praticaAtividade === true && (
                  <div className="pt-2 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Qual atividade e frequência semanal?
                    </label>
                    <input
                      type="text"
                      value={atividadeDescricao}
                      onChange={(e) => setAtividadeDescricao(e.target.value)}
                      placeholder="Ex: Musculação 4x na semana e corrida aos sábados"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Observações Gerais */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observações Gerais
                </label>
                <textarea
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Informações comportamentais, preferências ou notas clínicas importantes..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-slate-900"
                />
              </div>

              {/* Botões Finais de Envio */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('clinico')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  ← Voltar: Clínico
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-70 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-400/20 transition cursor-pointer flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Salvar e Ver Perfil</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
