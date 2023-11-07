import { PGService } from "./DBService";
import { registry } from "tsyringe";
import { FailureResponse } from "./response";

@registry([
  {token: typeof PGService, useToken: PGService}
])
export abstract class BasePGRepository {
  dbService: PGService;

  constructor(dbService: PGService) {
    this.dbService = dbService;

    this.initClient();
    this.initTable();
  }

  protected abstract initTable(): void;

  protected async initClient() {
    await this.dbService.client.connect();
  }

  protected async runQuery(queryString: string, values: unknown[] = []) {
    const dbClient = this.dbService.client;

    try {
      const result = await dbClient.query(queryString, values);
      return result;
    } catch(error) {
      throw FailureResponse(500, error);
    }
  }
}