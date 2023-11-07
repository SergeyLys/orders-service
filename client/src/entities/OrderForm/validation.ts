export type ValidationErrors = {
	name: string;
	phone: string;
	address: string;
	status: string;
};

type ValidateCallback<T> = (value: T) => string;

const validatePhone: ValidateCallback<string> = (value) => {
	const phoneRegexp = /^[+]?[0-9]{7,13}$/;
  
  const lengthErrors = validateTextLength(value);

	if (lengthErrors.length > 0) {
    return lengthErrors;
  }

	if (value.match(phoneRegexp) === null) {
		return VALIDATION_MESSAGES.invalidPhone;
	}

	return "";
};

const validateTextLength: ValidateCallback<string | number> = (value, minLength?: number, maxLength?: number) => {
  const min = minLength || 1;
  const max = maxLength || Infinity;

	if (value.toString().length < min) {
		return VALIDATION_MESSAGES.empty;
	}

  if (value.toString().length > max) {
    return VALIDATION_MESSAGES.long;
  }

	return "";
};

const VALIDATION_MESSAGES = {
	empty: "Please fill the field",
  long: "Too many characters",
	invalidPhone: "Invalid phone number",
};

export const validationRules: Record<string, ValidateCallback<string>> = {
	name: validateTextLength,
	phone: validatePhone,
	address: validateTextLength,
};