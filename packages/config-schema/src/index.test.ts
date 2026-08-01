import { describe, it, expect } from "vitest";
import { MerchantConfigSchema } from "./index";

describe("MerchantConfigSchema Placeholder", () => {
  it("should validate a placeholder configuration", () => {
    const validConfig = {
      businessName: "Fashion Hub",
    };

    const result = MerchantConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });
});
