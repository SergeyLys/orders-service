import React, {
	useEffect,
	useState,
	Children,
	useRef,
	useCallback,
	memo,
} from "react";
import "./styles.css";
import { Option } from "./Option";

type DropdownComposition = {
	Option: typeof Option;
};

type Props<T> = {
	onChange: (item: T) => void;
	children: React.ReactElement | React.ReactElement[];
	placeholder?: string;
	error?: string;
};

const Dropdown: React.FC<Props<unknown>> = <T,>({
	children,
	onChange,
	placeholder,
	error,
}: Props<T>) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedValue, setSelectedValue] = useState<string>(
		(
			Children.toArray(children).find(
				(child) => (child as React.ReactElement).props.default
			) as React.ReactElement
		)?.props.children || placeholder
	);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setSelectedValue(selectedValue);
	}, [selectedValue]);

	useEffect(() => {
		document.addEventListener("click", hideDropdown);
		return () => {
			document.removeEventListener("click", hideDropdown);
		};
	}, []);

	const hideDropdown = (e: MouseEvent) => {
		if (e.target === containerRef.current) return;
		setIsOpen(false);
	};

	const toggleDropdown = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	return (
		<div className={["dropdown", ...(error ? ["error"] : [])].join(" ")}>
			<div onClick={toggleDropdown}>
				<div
					ref={containerRef}
					className={`dropdown-button ${isOpen ? "open" : ""}`}
				>
					{selectedValue}
				</div>
			</div>
			{error && <span className="validation-error-text">{error}</span>}
			{isOpen && (
				<div className="dropdown-content">
					{Children.map(children, (child) => {
						if (child.type === MemoizedDropdown.Option) {
							return React.cloneElement(child, {
								onSelect: (item: T) => {
									toggleDropdown();
									onChange(item);
									setSelectedValue(child.props.children);
								},
							});
						}
						return null;
					})}
				</div>
			)}
		</div>
	);
};

type TMemoizedDropdown<T> = React.NamedExoticComponent<Props<T>> &
	DropdownComposition;

const MemoizedDropdown = memo(Dropdown) as TMemoizedDropdown<any>;

MemoizedDropdown.Option = Option;

export default MemoizedDropdown;
