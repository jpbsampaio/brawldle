export interface IBrawler {
  id: string;
  name: string;
  rarity: string;
  role: string;
  gender: string;
  releaseYear: number;
  imageUrl: string;
}

export interface IBrawlerDayResponse {
  id: string;
  date: string;
  brawlerId: string;
  active: boolean;
  brawler: IBrawler;
}