import { Client } from 'pg';

export interface IDBService<T> {
  connect: () => Promise<void>;
  client: T;
}

export class PGService implements IDBService<Client> {
  _client: Client;

  constructor() {
    this._client = new Client({
      host: '127.0.0.1',
      user: 'admin',
      password: 'password',
      database: 'novapay-order-service',
      port: 5432
    });
  }

  get client() {
    return this._client;
  }

  connect() {
    return this._client.connect();
  }
}