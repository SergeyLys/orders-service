import React, { memo } from "react";
import "./styles.css";
import { Spinner } from "../Spinner";

type Props = {
	children: React.ReactNode;
	onClick?: () => void;
	styles?: Record<string, string | number>;
	disabled?: boolean;
	isLoading?: boolean;
};

function Button({ children, styles, isLoading, ...restProps }: Props) {
	return (
		<button className="button" style={{ ...styles }} {...restProps}>
			<span style={{ visibility: isLoading ? "hidden" : "visible" }}>
				{children}
			</span>
			{isLoading && (
				<Spinner />
			)}
		</button>
	);
}

export default memo(Button);
