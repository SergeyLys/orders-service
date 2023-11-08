import React, { memo, useCallback, useEffect, useState } from "react";
import PageSizeSelector, { PageSizeOption } from "./PageSizeSelector";
import Arrow from "./Arrow";
import Current from "./Current";
import "./styles.css";

type Props = {
	total: number;
	defaultPageSize: number;
	current: number;
	onChange: (currentPage: number, pageSize: number) => void;
	children?: React.ReactElement | React.ReactElement[];
};

type PaginationComposition = {
	Arrow: typeof Arrow;
	Current: typeof Current;
	PageSizeSelector: typeof PageSizeSelector;
};

const Pagination: React.FC<Props> = ({
	total,
	current,
	defaultPageSize,
	onChange,
	children,
}) => {
	const [pageSize, setPageSize] = useState(defaultPageSize);
	const [currentPage, setCurrentPage] = useState(current);

	const handlePageClick = useCallback(
		(page: number, size: number) => {
			const totalPages = Math.ceil(total / pageSize);

			if (page < 1 || page > totalPages) return;

			setCurrentPage(page);
			setPageSize(size);
			onChange(page, pageSize);
		},
		[onChange, pageSize, total]
	);

	const handlePageSizeChange = useCallback(
		(size: number) => {
			setPageSize(size);

			if (currentPage * size > total) {
				const nextPage = Math.round(total / size);
				setCurrentPage(nextPage);
				onChange(nextPage, size);
				return;
			}

			onChange(currentPage, size);
		},
		[currentPage, total, onChange]
	);

	useEffect(() => {
		if (currentPage * pageSize > total) {
			const nextPage = Math.round(total / pageSize) || 1;
			setCurrentPage(nextPage);
		}
	}, [currentPage, pageSize, total]);

	return (
		<div className="flex pagination-container align-center">
			{children &&
				React.Children.map(children, (child) => {
					if (child.type === MemoizedPagination.Arrow) {
						return React.cloneElement(child, {
							handlePageClick: () => {
								if (child.props.direction === "left") {
									handlePageClick(currentPage - 1, pageSize);
								}

								if (child.props.direction === "right") {
									handlePageClick(currentPage + 1, pageSize);
								}
							},
						});
					}

					if (child.type === MemoizedPagination.Current) {
						return React.cloneElement(child, {
							currentPage,
							totalPages: Math.ceil(total / pageSize),
						});
					}

					if (child.type === MemoizedPagination.PageSizeSelector) {
						return React.cloneElement(child, {
							handleSizeChange: (option: PageSizeOption) =>
								handlePageSizeChange(option.id),
							defaultPageSize,
						});
					}

					return null;
				})}
		</div>
	);
};

const MemoizedPagination = memo(
	Pagination
) as React.NamedExoticComponent<Props> & PaginationComposition;

MemoizedPagination.Arrow = Arrow;
MemoizedPagination.Current = Current;
MemoizedPagination.PageSizeSelector = PageSizeSelector;

export type { Props, PageSizeOption };
export default MemoizedPagination;
