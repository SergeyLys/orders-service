import { forwardRef, memo, useState } from "react";
import "./styles.css";

type Props = {
	value: string;
	onChange?: (value: string) => void;
	error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
	({ value, onChange, error }, ref) => {
		const [inputValue, setInputValue] = useState<string>(value);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(e.target.value);

			if (onChange) {
				onChange(e.target.value);
			}
		};

		return (
			<div
				className={["input-container", ...(error ? ["error"] : [])].join(" ")}
			>
				<input
					className="input"
					ref={ref}
					type="text"
					value={inputValue}
					onChange={handleChange}
				/>
				{error && <span>{error}</span>}
			</div>
		);
	}
);

export default memo(Input);
