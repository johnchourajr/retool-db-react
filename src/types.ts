export type RetoolDatabaseConfig = {
  baseUrl?: string;
};

export type RetoolDatabaseOptions = {
  query?: string;
  params?: unknown[];
  limit?: number;
};

export type RetoolMutationType = "INSERT" | "UPDATE" | "DELETE";

export type RetoolMutation = {
  type: RetoolMutationType;
  data?: Record<string, unknown>;
  where?: Record<string, unknown>;
};

export type RetoolDatabaseError = {
  message: string;
  code?: string;
  detail?: string;
};
