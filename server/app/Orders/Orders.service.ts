import {plainToClass, ClassConstructor} from 'class-transformer';
import { autoInjectable } from "tsyringe";
import { FailureResponse, SuccessResponse } from "../utility/response";
import { OrderRepository } from "./Order.repository";
import { AppValidation } from '../utility/validation';
import { OrderUpdateInput, OrderCreateInput } from './models/Order.input';

@autoInjectable()
export class OrdersService {
  repository: OrderRepository;

  constructor(
    repository: OrderRepository
  ) {
    this.repository = repository;
  }

  async _handleValidate<T>(schema: ClassConstructor<T>, plain: object) {
    const input = plainToClass(schema, plain);

    const error = await AppValidation(input);

    if (error) {
      throw FailureResponse(409, error);
    }

    return input;
  }

  async getOrders(sorter: string) {
      const orders = await this.repository.getOrdersOperation(sorter);
      return SuccessResponse(orders);
  }

  async getOrderById(id: number) {
      const orders = await this.repository.getOrderByIdOperation(id);
      return SuccessResponse(orders);
  }

  async getOrdersStats(sorter: string) {
      const orders = await this.repository.getStats(sorter);
      return SuccessResponse(orders);
  }

  async createOrder(dto: OrderCreateInput) {
      const input = await this._handleValidate(OrderCreateInput, dto);

      const order = await this.repository.createOrderOperation(input);

      return SuccessResponse(order);
  }

  async updateOrder(dto: OrderUpdateInput) {
      const input = await this._handleValidate(OrderUpdateInput, dto);
  
      const order = await this.repository.updateOrderOperation(input);

      return SuccessResponse(order);
  }
}