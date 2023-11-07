import { Link } from "react-router-dom";
import { ColumnType, ListView } from "../ui";
import { useGetOrdersStatsQuery } from "../utils/api";
import { useState } from "react";

const columns: ColumnType[] = [
	{
		name: "Date",
		dataRef: "date",
		key: "0",
	},
	{
		name: "Approved",
		dataRef: "approved",
		key: "1",
	},
	{
		name: "Pending",
		dataRef: "pending",
		key: "2",
	},
	{
		name: "Cancelled",
		dataRef: "cancelled",
		key: "2",
	},
];

const Stats: React.FC = () => {
	const [sorter, setSorter] = useState("");
	const { data = [], isLoading, isError } = useGetOrdersStatsQuery(sorter);

	return (
		<>
			<div className="m-8 flex space-between">
				<Link className="button" to="/edit">
					Create new order
				</Link>
				<Link className="button" to="/">
					Orders
				</Link>
			</div>
			<ListView
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
				error={isError ? "Some error occured" : null}
				isLoading={isLoading}
				columns={columns}
				data={data}
			/>
		</>
	);
};

export default Stats;
