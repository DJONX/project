import React from "react";
import { describe, it, expect } from "vitest";
import { Button } from "./index";

describe("Button component", () => {
  it("should be a valid functional component", () => {
    const buttonElement = React.createElement(Button, { variant: "primary" }, "Click me");
    expect(buttonElement).toBeDefined();
    expect(buttonElement.props.children).toBe("Click me");
    expect(buttonElement.props.variant).toBe("primary");
  });
});
