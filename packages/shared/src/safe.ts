export type SafeResult<T = any, E = any> =
  | {
      data: T;
    }
  | {
      error: E;
    };
