import React, { memo } from "react";
import { Spinner } from "../";
import "./styles.css";

type ColumnType = {
	name: string;
	key: string | number;
	styles?: Record<string, string | number>;
	dataRef: string;
};

type Props<T> = {
	columns: ColumnType[];
	data: T[];
	headerStyles?: Record<string, string | number>;
	error?: string | null;
	isLoading?: boolean;
	renderHeaderColumn?: (column: ColumnType) => React.ReactNode;
	renderBodyColumn?: (
		item: T,
		column: ColumnType,
		data: string
	) => React.ReactNode;
	fallbackText?: string;
};

const ListView = <T,>({
	columns,
	data,
	headerStyles,
	error,
	isLoading,
	renderHeaderColumn,
	renderBodyColumn,
	fallbackText,
}: Props<T>) => {
	return (
		<div className="list-container">
			<div
				className="list-header-row"
				style={{ ...headerStyles, gridColumn: `span ${columns.length}` }}
			>
				{columns.map((column) => {
					return (
						<div
							key={`${Number(column.key) * Math.random()}`}
							style={column.styles}
							className="list-header-col"
						>
							{renderHeaderColumn ? renderHeaderColumn(column) : column.name}
						</div>
					);
				})}
			</div>

			{error && !isLoading && (
				<div
					className="error-container"
					style={{ gridColumn: `span ${columns.length}` }}
				>
					{error}
				</div>
			)}

			{isLoading && (
				<div
					className="spinner-container"
					style={{ gridColumn: `span ${columns.length}` }}
				>
					<Spinner />
				</div>
			)}

			{!isLoading && !error && (
				<>
					{data.length > 0 ? (
						data.map((item, index) => {
							return (
								<div
									key={index * Math.random()}
									className="list-body-row"
									style={{ gridColumn: `span ${columns.length}` }}
								>
									{columns.map((col) => {
										return (
											<div
												key={`${Number(col.key) * Math.random()}`}
												style={{ width: col.styles?.width }}
												className="list-body-col"
											>
												{renderBodyColumn
													? renderBodyColumn(
															item,
															col,
															(item as Record<string, string>)[col.dataRef]
													  )
													: (item as Record<string, string>)[col.dataRef]}
											</div>
										);
									})}
								</div>
							);
						})
					) : (
						<p
							className="empty-container"
							style={{ gridColumn: `span ${columns.length}` }}
						>
							{fallbackText || "No data"}
						</p>
					)}
				</>
			)}
		</div>
	);
};

export type { Props, ColumnType };
export default memo(ListView);
