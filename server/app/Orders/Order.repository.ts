import { autoInjectable } from "tsyringe";
import { BasePGRepository } from "../utility/BaseRepository";
import { OrderUpdateInput, OrderCreateInput } from "./models/Order.input";

@autoInjectable()
export class OrderRepository extends BasePGRepository {
  async initTable() {
    const result = await this.runQuery(`
      SELECT to_regclass('public.orders');
    `);

    if (result.rows[0].to_regclass === null) {
      await this.runQuery(`
        DROP TABLE IF EXISTS orders;
        
        CREATE TABLE "orders" (
          "id" bigserial PRIMARY KEY,
          "name" varchar NOT NULL,
          "address" varchar NOT NULL,
          "phone" varchar NOT NULL,
          "status" varchar NOT NULL,
          "created_at" timestamptz NOT NULL DEFAULT (now()),
          "updated_at" timestamptz NOT NULL DEFAULT (now())
        );

        CREATE INDEX ON "orders" ("status");
      `);
    }
  }

  async getOrdersOperation(sorter?: string, limit?: string, offset?: string): Promise<any> {
    const query = `
      SELECT id, name, phone, address, status, created_at
      FROM orders
      ${sorter ? `ORDER BY ${sorter} DESC` : ''}
      ${limit ? `LIMIT ${limit}` : ''}
      ${offset ? `OFFSET ${offset}` : ''};
    `;

    const totalQuery = `
      SELECT COUNT(id) AS total
      FROM orders;
    `;

    const [{rows}, {rows: count}] = await Promise.all([
      this.runQuery(query), 
      this.runQuery(totalQuery)
    ]);

    return {total: count[0].total, rows};
  }

  async getOrderByIdOperation(id: number) {
    const query = `
      SELECT id, name, phone, address, status
      FROM orders
      WHERE id=$1;
    `;

    const result = await this.runQuery(query, [id]);

    return result.rows;
  }

  async getStats(sorter: string) {
    const query = `
      SELECT
        DATE(updated_at) AS "date",
        CONCAT(
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END),
          ' (',
          ROUND((SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) * 100.0 / COUNT(id)), 2),
          '%)'
        ) AS "approved",
        CONCAT(
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END),
          ' (',
          ROUND((SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) * 100.0 / COUNT(id)), 2),
          '%)'
        ) AS "pending",
        CONCAT(
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END),
          ' (',
          ROUND((SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) * 100.0 / COUNT(id)), 2),
          '%)'
        ) AS "cancelled"
      FROM orders
      GROUP BY "date"
      ORDER BY ${sorter ? `${sorter} DESC` : "date"};
    `;

    const result = await this.runQuery(query);

    return result.rows;
  }

  async createOrderOperation({ name, phone, address, status }: OrderCreateInput) {
    const query = `
      INSERT INTO orders(name, phone, address, status)
      VALUES($1,$2,$3,$4)
      RETURNING id, name, phone, address, status
    `;
    
    const values = [name, phone, address, status];

    const result = await this.runQuery(query, values);

    if (result.rowCount > 0) {
      return result.rows[0];
    }
  }

  async updateOrderOperation({id, name, phone, address, status}: OrderUpdateInput) {
    const query = `
      UPDATE orders
      SET name=$2, phone=$3, address=$4, status=$5, updated_at=now()
      WHERE id=$1
      RETURNING id, name, phone, address, status;
    `;
    
    const values = [id, name, phone, address, status];

    const result = await this.runQuery(query, values);

    if (result.rowCount > 0) {
      return result.rows[0];
    }
  }
}