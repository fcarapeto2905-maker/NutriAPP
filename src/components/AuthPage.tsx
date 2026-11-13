import React, { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { syncNutricionista } from '../lib/db';
import { Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { DancingSalad } from './DancingSalad';

interface AuthPageProps {
  onSuccess: (user: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Por favor, informe um email válido.');
      return;
    }

    if (password.length < 9) {
      setError('A senha deve conter no mínimo 9 caracteres.');
      return;
    }

    if (!isLogin) {
      if (!nome.trim()) {
        setError('Por favor, informe seu nome completo.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas digitadas não coincidem.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: authError } = await authClient.signIn.email({
          email: cleanEmail,
          password: password,
        });

        if (authError) {
          setError(authError.message || 'Credenciais inválidas. Verifique seu email e senha.');
          setLoading(false);
          return;
        }

        if (data?.user) {
          onSuccess(data.user);
        }
      } else {
        const { data, error: authError } = await authClient.signUp.email({
          email: cleanEmail,
          password: password,
          name: nome.trim(),
        });

        if (authError) {
          setError(authError.message || 'Erro ao criar conta. Tente novamente.');
          setLoading(false);
          return;
        }

        if (data?.user) {
          await syncNutricionista(data.user.id, nome.trim(), cleanEmail);
          onSuccess(data.user);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Ocorreu um erro inesperado ao conectar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Topo / Saladinha Dançando e Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <DancingSalad size={110} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">CARAPETO Nutri&Health System</h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mt-1.5">
            <span>★</span>
            <span>Gestão Nutricional Integrada</span>
          </div>
        </div>

        {/* Card do Formulário (Cinza moderno / Slate) */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-950/60 border border-slate-700/80 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              {isLogin ? 'Acessar sua conta' : 'Criar nova conta'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isLogin
                ? 'Insira suas credenciais para gerenciar seus pacientes'
                : 'Preencha os campos abaixo para iniciar seu cadastro'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/40 rounded-2xl flex items-start gap-2.5 text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Dra. Mariana Silva"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Profissional
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nutri@exemplo.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 disabled:opacity-70 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-400/20 transition cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Entrar no Sistema' : 'Criar minha conta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle de Modo */}
          <div className="mt-6 pt-5 border-t border-slate-700 text-center">
            {isLogin ? (
              <p className="text-xs text-slate-400">
                Não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError(null);
                  }}
                  className="font-semibold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                >
                  Cadastre-se
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Já tem conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError(null);
                  }}
                  className="font-semibold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                >
                  Faça login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Rodapé Seguro */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Ambiente Seguro com Criptografia Neon</span>
        </div>
      </div>
    </div>
  );
};
