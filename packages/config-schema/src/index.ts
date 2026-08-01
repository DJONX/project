import { z } from "zod";

export const MerchantConfigSchema = z.object({
  businessName: z.string(),
});

export type MerchantConfig = z.infer<typeof MerchantConfigSchema>;
