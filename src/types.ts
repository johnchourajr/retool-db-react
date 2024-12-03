export interface RetoolDatabaseConfig {
  baseUrl?: string;
  validate?: (data: any) => Promise<any> | any;
}

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

export type RetoolContextParams = {
  params: {
    tableName: string;
  };
};
