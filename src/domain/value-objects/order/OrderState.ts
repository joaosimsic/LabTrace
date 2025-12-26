export const ORDER_STATES = ["CREATED", "ANALYSIS", "COMPLETED"] as const;

export type OrderState = (typeof ORDER_STATES)[number];
