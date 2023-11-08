import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import { ListView, ColumnType, Pagination } from "../ui";
import { useGetOrdersQuery } from "../utils/api";
import { IOrder } from "../../../shared";
import debounce from "../utils/debounce";

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
const pageSizeOptions = [
	{ id: 10, value: "10" },
	{ id: 20, value: "20" },
	{ id: 100, value: "100" },
];

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_CURRENT_PAGE = 1;

const Orders: React.FC = () => {
	const [pagination, setPagination] = useState({
		offset: 0,
		currentPage: DEFAULT_CURRENT_PAGE,
		pageSize: DEFAULT_PAGE_SIZE,
	});
	const [sorter, setSorter] = useState("");
	const {
		data = { rows: [], total: 0 },
		isError,
		isLoading,
	} = useGetOrdersQuery({
		sorter,
		limit: pagination.pageSize.toString(),
		offset: pagination.offset.toString(),
	});

	const handleChangePage = useCallback(
		debounce((page: number, pageSize: number) => {
			setPagination(() => ({
				offset: (page - 1) * pageSize,
				currentPage: page,
				pageSize,
			}));
		}, 500),
		[]
	);

	return (
		<>
			<div className="m-8 flex space-between wrap">
				<div className="flex align-center">
					<Link className="button m-8" to="/edit">
						Create new order
					</Link>

					<Link className="button" to="/stats">
						Statistics
					</Link>
				</div>

				<Pagination
					total={data.total}
					defaultPageSize={DEFAULT_PAGE_SIZE}
					current={pagination.currentPage}
					onChange={handleChangePage}
				>
					<Pagination.PageSizeSelector
						styles={{ marginRight: 15, minWidth: 60 }}
						pageSizeOptions={pageSizeOptions}
					/>
					<Pagination.Arrow direction="left" />
					<Pagination.Current />
					<Pagination.Arrow direction="right" />
				</Pagination>
			</div>
			<ListView
				columns={columns}
				data={data.rows}
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
