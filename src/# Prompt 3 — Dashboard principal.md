# Prompt 3 — Dashboard principal

Agora vamos criar o dashboard principal do sistema. Essa é a primeira tela que a nutricionista vê após fazer login.

## Layout
- Inserir uma imagem de personagem exibindo músculo forte
- Cores: Branco, azul, amarelo e cinza
- Menu lateral fixo com as opções: Tela Inicial, Dashboard, Pacientes
- Área principal com os cards de informação
- Quando usuário for "teste@teste.com", exibir um card com o nome dos nutricionistas disponíveis

## Cards de informação
O dashboard deve exibir 3 cards principais:

### Card 1 — Total de pacientes ativos
- Exibe o número total de pacientes cadastrados pela nutricionista logada
- Inserir uma imagem com um personagem gordo subindo na balança e descendo magro


### Card 2 — Consultas da semana
- Exibe o número de consultas registradas na semana atual
- Inserir uma animação de uma agenda virando as páginas

### Card 3 — Pacientes sem retorno
- Exibe uma lista com o nome dos pacientes cuja última consulta foi há mais de 30 dias e que não possuem próximo retorno agendado
- Cada nome da lista deve ser clicável e redirecionar para o perfil do paciente

## Regras importantes
- Todos os dados devem ser carregados do Neon em tempo real
- Exibir apenas dados da nutricionista logada
- Se não houver pacientes sem retorno, exibir a mensagem "Nenhum paciente sem retorno no momento"
- Quando usuário for "teste@teste.com", exibir um card denominado "Nutricionistas Disponíveis" e uma lista com o nome e login dos  nutricionistas cadastrados

## Design
- Seguir o mesmo padrão visual da tela de autenticação
- Inserir a saladinha dançando
- Cards com visual limpo, moderno e profissional
- Cores: Fundo tela principal branco, azul, amarelo e cinza
- Menu lateral fixo com logotipo "CARAPETO Nutri&Health App" no topo