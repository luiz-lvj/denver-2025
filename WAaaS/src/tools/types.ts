import { z } from "zod";

/**
 * Base schema type for WAaaS tool actions
 */
export type WaaaSActionSchema = z.ZodObject<
  {
    [K: string]: z.ZodTypeAny;
  },
  "strict",
  z.ZodTypeAny
>;

/**
 * Core WAaaS Actions interface
 */
export interface WaaaSAction<TSchema extends WaaaSActionSchema> {
  name: string;
  description: string;
  schema: TSchema;
  func: (args: z.infer<TSchema>) => Promise<string>;
} 