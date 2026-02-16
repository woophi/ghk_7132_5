export type StockItem = {
  ticker: string;
  price_today: number;
  lot: number;
  name: string;
  img: string;
};

export type GistResponse = {
  stocks: StockItem[];
  funds: StockItem[];
  bonds: StockItem[];
};
