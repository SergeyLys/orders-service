import 'reflect-metadata';
import express, { Request, Response } from "express";
import cors from 'cors';
import { container } from "tsyringe";
import { OrdersService } from "./Orders/Orders.service";

const ordersService = container.resolve(OrdersService);

export async function startServer() {
  const app = express();
  const port = 5174;

  app.use(express.json());
  app.use(cors());

  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const orders = await ordersService.getOrders(req.query.sortBy as string);
      res.json(orders);
    } catch(error) {
      res.status(error.statusCode).send(error.body);
    }
  });

  app.get("/api/orders/stats", async (req: Request, res: Response) => {
    try {
      const orders = await ordersService.getOrdersStats(req.query.sortBy as string);
      res.json(orders);
    } catch(error) {
      res.status(error.statusCode).send(error.body);
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const orders = await ordersService.getOrderById(Number(req.params.id));
      res.json(orders);
    } catch(error) {
      res.status(error.statusCode).send(error.body);
    }
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const order = await ordersService.createOrder(req.body);
      res.json(order);
    } catch(error) {
      res.status(error.statusCode).send(error.body);
    }
  });

  app.patch("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const input = {...req.body, id: Number(req.params.id)};
      const order = await ordersService.updateOrder(input);
      res.json(order);
    } catch(error) {
      res.status(error.statusCode).send(error.body);
    }
  });

  app.listen(port, () => {
    console.log(`api listening on port ${port}`);
  });

}