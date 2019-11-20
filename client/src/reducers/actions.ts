type NoType<A extends object> = A extends { type: any } ? never : A;

interface EmptyAction<T extends string> {
  type: T;
}

type FilledAction<T extends string, P extends object> = EmptyAction<T> &
  NoType<P>;

type CreateAction = {
  <T extends string>(type: T): EmptyAction<T>;
  <T extends string, P extends object>(
    type: T,
    payload: NoType<P>
  ): FilledAction<T, P>;
};

export const createAction: CreateAction = <T extends string, P extends object>(
  type: T,
  payload?: NoType<P>
): EmptyAction<T> | FilledAction<T, P> =>
  payload === undefined ? { type } : { type, ...payload };

export type DeriveActionType<
  A extends { [key: string]: (...args: any[]) => any }
> = ReturnType<A[keyof A]>;
