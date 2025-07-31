export type SafeResult<T = any, E = any> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: E;
    };
