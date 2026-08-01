import React from "react";
import { describe, it, expect } from "vitest";
import { BoutiqueTemplate } from "./index";
import { MerchantConfig } from "@cameroon-merchants/config-schema";

describe("Templates Package Placeholder", () => {
  it("exports BoutiqueTemplate correctly", () => {
    const config: MerchantConfig = {
      businessName: "Test Boutique Placeholder",
    };

    const element = React.createElement(BoutiqueTemplate, { config });
    expect(element).toBeDefined();
    expect(element.props.config.businessName).toBe("Test Boutique Placeholder");
  });
});
