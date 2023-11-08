import { memo } from "react";

const Current = ({
	currentPage,
	totalPages,
}: {
	currentPage?: number;
	totalPages?: number;
}) => (
	<div className="current">
		{currentPage} of {totalPages}
	</div>
);

export default memo(Current);
