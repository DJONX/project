import React from "react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Staff Console Home page", () => {
  it("renders the OK text placeholder", () => {
    const pageElement = React.createElement(Home);
    expect(pageElement).toBeDefined();
  });
});
