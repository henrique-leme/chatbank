export interface EvaluationQuestion {
  id: number;
  dimension: string;
  question: string;
}

export const EVALUATION_QUESTIONS: EvaluationQuestion[] = [
  // Dimensao 1: Planejamento e Controle Financeiro
  { id: 1, dimension: "Planejamento e Controle Financeiro", question: "Você anota todas as entradas e saídas do seu negócio?" },
  { id: 2, dimension: "Planejamento e Controle Financeiro", question: "Você sabe dizer qual é o saldo de caixa do seu negócio hoje?" },
  { id: 3, dimension: "Planejamento e Controle Financeiro", question: "Você faz planejamento do dinheiro do negócio para os próximos meses?" },

  // Dimensao 2: Formacao de Preco e Margem de Lucro
  { id: 4, dimension: "Formação de Preço e Margem de Lucro", question: "Você sabe calcular quanto custa, de verdade, cada produto ou serviço que você vende?" },
  { id: 5, dimension: "Formação de Preço e Margem de Lucro", question: "Quando define seus preços, você leva em conta custos, despesas e impostos?" },
  { id: 6, dimension: "Formação de Preço e Margem de Lucro", question: "Você já calculou a margem de lucro de seus produtos/serviços?" },

  // Dimensao 3: Controle de Custos e Despesas
  { id: 7, dimension: "Controle de Custos e Despesas", question: "Você sabe quais são os principais custos fixos do seu negócio?" },
  { id: 8, dimension: "Controle de Custos e Despesas", question: "Você registra e acompanha os gastos pequenos do dia a dia (como água, energia, transporte)?" },
  { id: 9, dimension: "Controle de Custos e Despesas", question: "Você já tentou negociar melhores preços ou prazos com seus fornecedores?" },

  // Dimensao 4: Gestao do Endividamento e Credito
  { id: 10, dimension: "Gestão do Endividamento e Crédito", question: "Você já usou empréstimos ou financiamentos para o negócio?" },
  { id: 11, dimension: "Gestão do Endividamento e Crédito", question: "Antes de pegar crédito, você calcula se conseguirá pagar as parcelas sem comprometer o caixa?" },
  { id: 12, dimension: "Gestão do Endividamento e Crédito", question: "Você conhece o significado da taxa de juros ou do custo total do crédito (CET)?" },

  // Dimensao 5: Financas Pessoais x Empresariais
  { id: 13, dimension: "Finanças Pessoais x Empresariais", question: "Você mistura dinheiro do negócio com dinheiro pessoal?" },
  { id: 14, dimension: "Finanças Pessoais x Empresariais", question: "Você retira um valor fixo por mês do negócio para seu uso pessoal (pró-labore)?" },
  { id: 15, dimension: "Finanças Pessoais x Empresariais", question: "Você separa contas bancárias do negócio e pessoais?" },

  // Dimensao 6: Investimento e Reinvestimento no Negocio
  { id: 16, dimension: "Investimento e Reinvestimento no Negócio", question: "Você já reinvestiu parte do lucro do negócio em melhorias (ex.: equipamentos, marketing, treinamento)?" },
  { id: 17, dimension: "Investimento e Reinvestimento no Negócio", question: "Você analisa se esses investimentos trouxeram retorno?" },

  // Dimensao 7: Formalizacao e Conformidade
  { id: 18, dimension: "Formalização e Conformidade", question: "Seu negócio é formalizado (MEI, Simples Nacional, etc.)?" },
  { id: 19, dimension: "Formalização e Conformidade", question: "Você emite nota fiscal quando vende produtos ou serviços?" },
  { id: 20, dimension: "Formalização e Conformidade", question: "Você sabe quais são as obrigações de pagamento de impostos ou contribuições do seu negócio?" },
];

export const QUESTION_OPTIONS = ["Sim", "Não", "Não Sei"] as const;

// IDs das perguntas invertidas (onde "Não" é a resposta positiva)
export const INVERTED_QUESTION_IDS = [13];
