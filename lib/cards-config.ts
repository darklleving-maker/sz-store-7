export interface CardLevel {
  id: string;
  name: string;
  priceCents: number;
  priceLabel: string;
  bestSeller: boolean;
  description: string;
  color: string;
}

export const CARD_LEVELS: CardLevel[] = [
  { id: "classic",  name: "CLASSIC",  priceCents: 2500,  priceLabel: "R$ 25,00",  bestSeller: false, description: "Acesso padrão para iniciantes", color: "#9CA3AF" },
  { id: "platinum", name: "PLATINUM", priceCents: 3000,  priceLabel: "R$ 30,00",  bestSeller: false, description: "Nível intermediário com mais rotas", color: "#A5F3FC" },
  { id: "gold",     name: "GOLD",     priceCents: 3500,  priceLabel: "R$ 35,00",  bestSeller: true,  description: "O mais procurado. Alta compatibilidade.", color: "#FBBF24" },
  { id: "amex",     name: "AMEX",     priceCents: 4000,  priceLabel: "R$ 40,00",  bestSeller: false, description: "Rede premium. Aceito em plataformas top.", color: "#10B981" },
  { id: "infinite", name: "INFINITE", priceCents: 4500,  priceLabel: "R$ 45,00",  bestSeller: true,  description: "Topo de linha. Máxima compatibilidade.", color: "#8B5CF6" },
  { id: "black",    name: "BLACK",    priceCents: 9000,  priceLabel: "R$ 90,00",  bestSeller: false, description: "Exclusividade total. Limite elevado.", color: "#EF4444" },
  { id: "b2b",      name: "B2B",      priceCents: 8500,  priceLabel: "R$ 85,00",  bestSeller: false, description: "Linha corporativa. Alto desempenho.", color: "#3B82F6" },
  { id: "business", name: "BUSINESS", priceCents: 14000, priceLabel: "R$ 140,00", bestSeller: true,  description: "Máximo nível. Todos os métodos liberados.", color: "#E63946" },
];

export function getCardLevel(id: string): CardLevel | undefined {
  return CARD_LEVELS.find((c) => c.id === id);
}
