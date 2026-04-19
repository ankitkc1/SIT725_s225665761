const expect = require("chai").expect;
const { add, divide } = require("../calculator");

describe("Calculation Function Tests", function () {
  it("add() should return correct result for valid integers", function () {
    const result = add(2, 3);
    expect(result).to.equal(5);
  });

  it("add() should handle decimal numbers", function () {
    const result = add(0.1, 0.2);
    expect(result).to.be.closeTo(0.3, 0.0001);
  });

  it("add() should throw an error for invalid input", function () {
    expect(() => add("abc", 5)).to.throw("Invalid input");
  });

  it("divide() should throw an error when dividing by zero", function () {
    expect(() => divide(10, 0)).to.throw("Cannot divide by zero");
  });
});