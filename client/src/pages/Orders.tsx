import { Link } from "react-router-dom";
import { ListView, ColumnType } from "../ui";
import { useGetOrdersQuery } from "../utils/api";
import { IOrder } from "../../../shared";
import { useState } from "react";

const columns: ColumnType[] = [
	{
		name: "ID",
		dataRef: "id",
		key: "0",
	},
	{
		name: "Date",
		dataRef: "created_at",
		key: "5",
	},
	{
		name: "Name",
		dataRef: "name",
		key: "1",
	},
	{
		name: "Phone",
		dataRef: "phone",
		key: "2",
	},
	{
		name: "Status",
		dataRef: "status",
		key: "3",
	},
	{
		name: "",
		dataRef: "action-edit",
		key: "4",
	},
];

const Orders: React.FC = () => {
	const [sorter, setSorter] = useState("");
	const { data = [], isError, isLoading } = useGetOrdersQuery(sorter);

	return (
		<>
			<div className="m-8 flex space-between">
				<Link className="button" to="/edit">
					Create new order
				</Link>
				<Link className="button" to="/stats">
					Statistics
				</Link>
			</div>
			<ListView
				columns={columns}
				data={data}
				error={isError ? "Some error occured" : null}
				isLoading={isLoading}
				fallbackText="No orders yet"
				renderHeaderColumn={(column) => {
					if (column.dataRef === "action-edit") {
						return null;
					}
					return (
						<p
							onClick={() => setSorter(column.dataRef)}
							key={column.key}
							style={{ cursor: "pointer", textDecoration: "underline" }}
						>
							{column.name}
						</p>
					);
				}}
				renderBodyColumn={(item, column, data) => {
					if (column.dataRef === "action-edit") {
						return <Link to={`/edit/${(item as IOrder).id}`}>Edit</Link>;
					}
					return <p>{data}</p>;
				}}
			/>
		</>
	);
};

export default Orders;
