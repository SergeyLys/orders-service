import { useCallback, useRef, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Input, Button } from "../../ui";
import { IOrder, OrderStatus } from "../../../../shared";
import { ValidationErrors, validationRules } from "./validation";

const STATUSES = {
	approved: "Approved",
	cancelled: "Cancelled",
	pending: "Pending",
};

const orderStatuses = Object.entries(STATUSES).map(([key, value]) => ({
	id: key,
	value,
}));

type Props = {
	status?: OrderStatus;
	name?: string;
	phone?: string;
	address?: string;
	onSubmit: (data: IOrder) => Promise<void>;
	isSubmitting: boolean;
	error?: string;
};

const OrderForm: React.FC<Props> = ({
	status: currentStatus = "",
	phone = "",
	address = "",
	name = "",
	onSubmit,
	isSubmitting,
	error,
}) => {
	const [status, setStatus] = useState(currentStatus);
	const [shouldValidate, setShouldValidate] = useState(
		currentStatus === "approved"
	);
	const nameInputRef = useRef<HTMLInputElement | null>(null);
	const phoneInputRef = useRef<HTMLInputElement | null>(null);
	const addressInputRef = useRef<HTMLInputElement | null>(null);

	const navigate = useNavigate();

	const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
		name: "",
		phone: "",
		address: "",
		status: "",
	});

	const handleSubmit = useCallback(() => {
		const data = {
			name: nameInputRef.current?.value,
			phone: phoneInputRef.current?.value,
			address: addressInputRef.current?.value,
			status,
		};

		if (shouldValidate) {
			const invalidFields = Object.entries(data).reduce((acc, [key, value]) => {
				const errorMsg =
					(validationRules[key] && validationRules[key](value as string)) || "";

				if (errorMsg.length !== 0) {
					return {
						...acc,
						[key]: errorMsg,
					};
				}

				return acc;
			}, {});

			const isValid = Object.keys(invalidFields).length === 0;

			if (!isValid) {
				setValidationErrors((prev) => ({
					...prev,
					...invalidFields,
				}));

				return;
			}
		}

		onSubmit(data as IOrder)
			.then(() => {
				navigate("/");
			})
			.catch((error) => {
				if (error.status === 409) {
					setValidationErrors(error.data.data);
				}
			});
	}, [status, shouldValidate, onSubmit, navigate]);

	const handleInputChange = useCallback(
		(value: string, field: string, validate: (val: string) => string) => {
			if (shouldValidate) {
				setValidationErrors((prev) => ({
					...prev,
					[field]: validate(value),
				}));
			}
		},
		[shouldValidate]
	);

	return (
		<>
			<div className="m-8">
				<p>Name</p>
				<Input
					ref={nameInputRef}
					onChange={(value: string) =>
						handleInputChange(value, "name", validationRules.name)
					}
					error={shouldValidate ? validationErrors.name : ""}
					value={name}
				/>
			</div>

			<div className="m-8">
				<p>Phone</p>
				<Input
					ref={phoneInputRef}
					onChange={(value: string) =>
						handleInputChange(value, "phone", validationRules.phone)
					}
					error={shouldValidate ? validationErrors.phone : ""}
					value={phone}
				/>
			</div>

			<div className="m-8">
				<p>Address</p>
				<Input
					ref={addressInputRef}
					onChange={(value: string) =>
						handleInputChange(value, "address", validationRules.address)
					}
					error={shouldValidate ? validationErrors.address : ""}
					value={address}
				/>
			</div>

			<div className="m-8">
				<p>Status</p>
				<Dropdown
					error={validationErrors.status}
					onChange={(status) => {
						setStatus((status as { id: OrderStatus; value: string }).id);
						setValidationErrors((prev) => ({
							...prev,
							status: "",
						}));
						setShouldValidate(
							(status as { id: OrderStatus; value: string }).id === "approved"
						);
					}}
					placeholder="Choose status"
				>
					{orderStatuses.map((status) => (
						<Dropdown.Option
							default={status.id === currentStatus}
							key={status.id}
							value={status}
						>
							{status.value}
						</Dropdown.Option>
					))}
				</Dropdown>
			</div>

			<div className="flex mt-16">
				<div className="m-8">
					<Link to={"/"} className="button">
						Cancel
					</Link>
				</div>
				<div className="m-8">
					<Button
						isLoading={isSubmitting}
						disabled={isSubmitting}
						onClick={handleSubmit}
					>
						Save
					</Button>
					{error && <p style={{ color: "red" }}>{error}</p>}
				</div>
			</div>
		</>
	);
};

export default memo(OrderForm);
