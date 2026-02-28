export type Env = { DB: D1Database };
export type Variables = { requestId: string };
export type AppContext = { Bindings: Env; Variables: Variables };
