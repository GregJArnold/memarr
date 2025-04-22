export type Joined<T, U extends keyof T> = T & Required<Pick<T, U>>;
