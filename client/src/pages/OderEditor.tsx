import { useParams } from "react-router-dom";
import { useCallback } from "react";
import {
	useCreateOrderMutation,
	useGetOrderByIdQuery,
	useUpdateOrderMutation,
} from "../utils/api";
import { OrderForm } from "../entities";
import { IOrder } from "../../../shared";
import { Spinner } from "../ui";

const OrderEditor: React.FC = () => {
	const params = useParams();
	const [createOrder, { isLoading: isCreating, error: creatingError }] =
		useCreateOrderMutation();
	const [updateOrder, { isLoading: isUpdating, error: updatingError }] = useUpdateOrderMutation();
	const { data = [], isLoading } = useGetOrderByIdQuery(
		Number(params.orderId),
		{
			skip: !params.orderId,
		}
	);

	const handleCreateOrder = useCallback(
		(order: IOrder) => createOrder(order).unwrap(),
		[createOrder]
	);

	const handleUpdateOrder = useCallback(
		(order: IOrder) => updateOrder({ ...order, id: params.orderId }).unwrap(),
		[updateOrder, params.orderId]
	);

	const order: IOrder = (data as IOrder[])[0];
	const isEditing = params.orderId && typeof order !== "undefined";
	const isSubmitting = isCreating || isUpdating;
  const error = (creatingError as {error: string})?.error || (updatingError as {error: string})?.error

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<OrderForm
					isSubmitting={isSubmitting}
					onSubmit={isEditing ? handleUpdateOrder : handleCreateOrder}
					status={order?.status}
					name={order?.name}
					phone={order?.phone}
					address={order?.address}
          error={error}
				/>
			)}
		</>
	);
};

export default OrderEditor;
