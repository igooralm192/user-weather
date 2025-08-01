export type SafeResultSuccess<T = any> = {
  data: T;
};

export type SafeResultError = {
  error: { message: string; status: number };
};

export type SafeResult<T = any> = SafeResultSuccess<T> | SafeResultError;
