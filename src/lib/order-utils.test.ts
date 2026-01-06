import { calculateOrderTotal } from "./order-utils";

describe("calculateOrderTotal", () => {
  it("should return 0 for empty items", () => {
    expect(calculateOrderTotal([])).toBe(0);
  });

  it("should calculate total correctly", () => {
    const items = [
      { price: 10, quantity: 2 }, // 20
      { price: 5, quantity: 3 }, // 15
    ];
    expect(calculateOrderTotal(items)).toBe(35);
  });

  it("should handle floating point numbers", () => {
    const items = [
      { price: 10.5, quantity: 2 }, // 21
    ];
    expect(calculateOrderTotal(items)).toBe(21);
  });
});
