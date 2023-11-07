export type TResponse = {
  statusCode: number;
  body: {
    message: string;
    data: unknown;
  };
}

const formatResponse = (statusCode: number, message: string, data: unknown) => {
  const body = {
    message,
    ...({data} || {})
  };

  return {
    statusCode,
    body
  }
}

export const SuccessResponse = (data: object) => {
  return formatResponse(200, "success", data);
}

export const FailureResponse = (code: number, error: unknown) => {
  
  // handle class-validator errors
  if (Array.isArray(error)) {
    const errorMsg = 'Validation error';
    const errors = error.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.property]: curr.constraints[Object.keys(curr.constraints)[0]]
      }
    }, {});

    return formatResponse(code, errorMsg, errors);
  }

  if (error instanceof Error) {

    console.log(code);

    if (typeof error.message === 'string') {
      return formatResponse(code, error.message, error);
    }

    const data = JSON.parse(error.message) as TResponse;
    const statusCode = data.statusCode;

    return formatResponse(statusCode, `${data.body.message}`, data.body.data);
  }

  return formatResponse(code, `${error}`, error);
}