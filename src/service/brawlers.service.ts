import {IBrawlerDayResponse} from "@/interfaces/IBrawler";

export class BrawlersService {

  async getTodayBrawler(): Promise<IBrawlerDayResponse> {
    try {
      const response = await fetch(`${process.env.API_URL}/brawlers/today`);

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar o brawler do dia:', error);
      throw error;
    }
  }
}

export default new BrawlersService();