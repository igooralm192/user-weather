export type SafeResult<T = any> =
  | {
      data: T;
    }
  | {
      error: { message: string; status: number };
    };
