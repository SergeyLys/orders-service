import { IsInt, IsString, Length, Matches, ValidateIf } from "class-validator";
import { IOrder, OrderStatus } from "./Order.interface";

export class OrderCreateInput implements Omit<IOrder, 'id'> {
  @ValidateIf(o => o.status === 'approved')
  @IsString()
  @Length(1)
  name: string;

  @ValidateIf(o => o.status === 'approved')
  @IsString()
  @Length(7, 13)
  phone: string;

  @ValidateIf(o => o.status === 'approved')
  @IsString()
  @Length(1)
  address: string;

  @IsString()
  @Matches(/(approved|cancelled|pending)/)
  status: OrderStatus;
}

export class OrderUpdateInput implements Partial<IOrder> {
  @IsInt()
  id: number;

  @ValidateIf(o => o.status === 'approved')
  @IsString()
  @Length(1)
  name: string;

  @ValidateIf(o => o.status === 'approved')
  @IsString()
  @Length(7, 13)
  phone: string;

  @ValidateIf(o => o.status === 'approved')
  @IsString()
  @Length(1)
  address: string;

  @IsString()
  @Matches(/(approved|cancelled|pending)/)
  status: OrderStatus;
}