import React from "react";
import { MerchantConfig } from "@cameroon-merchants/config-schema";

export interface TemplateProps {
  config: MerchantConfig;
}

export const BoutiqueTemplate: React.FC<TemplateProps> = ({ config }) => {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{config.businessName} Boutique Placeholder</h3>
    </div>
  );
};

export const RestaurantTemplate: React.FC<TemplateProps> = ({ config }) => {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{config.businessName} Restaurant Placeholder</h3>
    </div>
  );
};
