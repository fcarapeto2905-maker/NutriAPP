import { neon } from '@neondatabase/serverless';

const fallbackDbUrl = 'postgresql://neondb_owner:npg_rBfIblhOGR20@ep-floral-lake-b6rpjjed-pooler.c-2.sa-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const databaseUrl = import.meta.env.VITE_DATABASE_URL || fallbackDbUrl;

export const sql = databaseUrl ? neon(databaseUrl) : null;

export interface Paciente {
  id: string;
  nutricionista_id: string;
  nome: string;
  data_nascimento?: string | null;
  sexo?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  peso_inicial?: number | null;
  altura?: number | null;
  objetivos?: string[] | null;
  objetivo_texto?: string | null;
  nivel_atividade?: string | null;
  patologias?: string[] | null;
  restricoes_alimentares?: string[] | null;
  alergias?: string[] | null;
  medicamentos?: string | null;
  suplementos?: string | null;
  refeicoes_por_dia?: number | null;
  horario_acorda?: string | null;
  horario_dorme?: string | null;
  litros_agua?: number | null;
  atividade_fisica?: boolean | null;
  atividade_fisica_descricao?: string | null;
  observacoes?: string | null;
  created_at: string;
  // Campos calculados/agregados
  ultima_consulta?: string | null;
}

export interface Consulta {
  id: string;
  paciente_id: string;
  data_consulta: string;
  peso?: number | null;
  cintura?: number | null;
  quadril?: number | null;
  percentual_gordura?: number | null;
  observacoes?: string | null;
  proximo_retorno?: string | null;
  created_at: string;
}

export interface PacienteSemRetorno {
  id: string;
  nome: string;
  whatsapp?: string | null;
  ultima_consulta: string;
  dias_sem_consulta: number;
}

export async function syncNutricionista(id: string, nome: string, email: string) {
  if (!sql) return;
  try {
    await sql`
      INSERT INTO public.nutricionistas (id, nome, email, created_at)
      VALUES (${id}, ${nome}, ${email}, NOW())
      ON CONFLICT (id) DO UPDATE
      SET nome = EXCLUDED.nome,
          email = EXCLUDED.email;
    `;
  } catch (error) {
    console.error('Erro ao sincronizar nutricionista no banco:', error);
  }
}

export async function getDashboardData(nutricionistaId: string) {
  if (!sql) {
    return {
      totalPacientes: 0,
      consultasSemana: 0,
      pacientesSemRetorno: [] as PacienteSemRetorno[],
    };
  }

  try {
    const pacientesCountRes = await sql`
      SELECT COUNT(*)::int AS total
      FROM public.pacientes
      WHERE nutricionista_id = ${nutricionistaId};
    `;
    const totalPacientes = pacientesCountRes[0]?.total ?? 0;

    const consultasSemanaRes = await sql`
      SELECT COUNT(*)::int AS total
      FROM public.consultas c
      JOIN public.pacientes p ON c.paciente_id = p.id
      WHERE p.nutricionista_id = ${nutricionistaId}
        AND c.data_consulta >= date_trunc('week', CURRENT_DATE)
        AND c.data_consulta < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days';
    `;
    const consultasSemana = consultasSemanaRes[0]?.total ?? 0;

    const semRetornoRes = await sql`
      WITH ultimas_consultas AS (
        SELECT 
          c.paciente_id,
          MAX(c.data_consulta) AS ultima_data,
          MAX(c.proximo_retorno) AS prox_retorno
        FROM public.consultas c
        JOIN public.pacientes p ON c.paciente_id = p.id
        WHERE p.nutricionista_id = ${nutricionistaId}
        GROUP BY c.paciente_id
      )
      SELECT 
        p.id,
        p.nome,
        p.whatsapp,
        uc.ultima_data AS ultima_consulta,
        (CURRENT_DATE - uc.ultima_data)::int AS dias_sem_consulta
      FROM ultimas_consultas uc
      JOIN public.pacientes p ON uc.paciente_id = p.id
      WHERE uc.ultima_data < CURRENT_DATE - INTERVAL '30 days'
        AND (uc.prox_retorno IS NULL OR uc.prox_retorno < CURRENT_DATE)
      ORDER BY dias_sem_consulta DESC;
    `;

    const pacientesSemRetorno: PacienteSemRetorno[] = semRetornoRes.map((r: any) => ({
      id: r.id,
      nome: r.nome,
      whatsapp: r.whatsapp,
      ultima_consulta: r.ultima_consulta,
      dias_sem_consulta: Number(r.dias_sem_consulta),
    }));

    return {
      totalPacientes,
      consultasSemana,
      pacientesSemRetorno,
    };
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard no Neon:', error);
    return {
      totalPacientes: 0,
      consultasSemana: 0,
      pacientesSemRetorno: [] as PacienteSemRetorno[],
    };
  }
}

export async function getPacientes(nutricionistaId: string): Promise<Paciente[]> {
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT 
        p.*,
        (
          SELECT MAX(c.data_consulta)
          FROM public.consultas c
          WHERE c.paciente_id = p.id
        ) AS ultima_consulta
      FROM public.pacientes p
      WHERE p.nutricionista_id = ${nutricionistaId}
      ORDER BY p.nome ASC;
    `;
    return rows as unknown as Paciente[];
  } catch (err) {
    console.error('Erro ao listar pacientes:', err);
    return [];
  }
}

export async function getPacienteById(id: string): Promise<Paciente | null> {
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT 
        p.*,
        (
          SELECT MAX(c.data_consulta)
          FROM public.consultas c
          WHERE c.paciente_id = p.id
        ) AS ultima_consulta
      FROM public.pacientes p
      WHERE p.id = ${id}
      LIMIT 1;
    `;
    return (rows[0] as unknown as Paciente) || null;
  } catch (err) {
    console.error('Erro ao buscar paciente por id:', err);
    return null;
  }
}

export async function createPaciente(paciente: {
  nutricionista_id: string;
  nome: string;
  data_nascimento?: string | null;
  sexo?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  peso_inicial?: number | null;
  altura?: number | null;
  objetivos?: string[] | null;
  objetivo_texto?: string | null;
  nivel_atividade?: string | null;
  patologias?: string[] | null;
  restricoes_alimentares?: string[] | null;
  alergias?: string[] | null;
  medicamentos?: string | null;
  suplementos?: string | null;
  refeicoes_por_dia?: number | null;
  horario_acorda?: string | null;
  horario_dorme?: string | null;
  litros_agua?: number | null;
  atividade_fisica?: boolean | null;
  atividade_fisica_descricao?: string | null;
  observacoes?: string | null;
}): Promise<Paciente> {
  if (!sql) throw new Error('Sem conexão com banco de dados.');
  
  const rows = await sql`
    INSERT INTO public.pacientes (
      nutricionista_id,
      nome,
      data_nascimento,
      sexo,
      whatsapp,
      email,
      peso_inicial,
      altura,
      objetivos,
      objetivo_texto,
      nivel_atividade,
      patologias,
      restricoes_alimentares,
      alergias,
      medicamentos,
      suplementos,
      refeicoes_por_dia,
      horario_acorda,
      horario_dorme,
      litros_agua,
      atividade_fisica,
      atividade_fisica_descricao,
      observacoes
    ) VALUES (
      ${paciente.nutricionista_id},
      ${paciente.nome},
      ${paciente.data_nascimento ? paciente.data_nascimento : null},
      ${paciente.sexo || null},
      ${paciente.whatsapp || null},
      ${paciente.email || null},
      ${paciente.peso_inicial != null ? paciente.peso_inicial : null},
      ${paciente.altura != null ? paciente.altura : null},
      ${paciente.objetivos && paciente.objetivos.length > 0 ? paciente.objetivos : null},
      ${paciente.objetivo_texto || null},
      ${paciente.nivel_atividade || null},
      ${paciente.patologias && paciente.patologias.length > 0 ? paciente.patologias : null},
      ${paciente.restricoes_alimentares && paciente.restricoes_alimentares.length > 0 ? paciente.restricoes_alimentares : null},
      ${paciente.alergias && paciente.alergias.length > 0 ? paciente.alergias : null},
      ${paciente.medicamentos || null},
      ${paciente.suplementos || null},
      ${paciente.refeicoes_por_dia != null ? paciente.refeicoes_por_dia : null},
      ${paciente.horario_acorda || null},
      ${paciente.horario_dorme || null},
      ${paciente.litros_agua != null ? paciente.litros_agua : null},
      ${paciente.atividade_fisica != null ? paciente.atividade_fisica : null},
      ${paciente.atividade_fisica_descricao || null},
      ${paciente.observacoes || null}
    )
    RETURNING *;
  `;
  return rows[0] as unknown as Paciente;
}
