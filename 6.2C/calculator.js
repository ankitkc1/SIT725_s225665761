function parseInputs(a, b) {
  const numA = Number(a);
  const numB = Number(b);

  if (Number.isNaN(numA) || Number.isNaN(numB)) {
    throw new Error("Invalid input");
  }

  return { numA, numB };
}

function add(a, b) {
  const { numA, numB } = parseInputs(a, b);
  return numA + numB;
}

function subtract(a, b) {
  const { numA, numB } = parseInputs(a, b);
  return numA - numB;
}

function multiply(a, b) {
  const { numA, numB } = parseInputs(a, b);
  return numA * numB;
}

function divide(a, b) {
  const { numA, numB } = parseInputs(a, b);

  if (numB === 0) {
    throw new Error("Cannot divide by zero");
  }

  return numA / numB;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide
};
