/**
 * SIT725 – 5.4D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3004";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// =============================

function makeValidBook(id) {
  return {
    id,
    title: "The Testing Book",
    author: "Alex Writer",
    year: 2020,
    genre: "Fiction",
    summary: "This is a valid summary that satisfies the schema validation rules.",
    price: "19.99"
  };
}

function makeValidUpdate() {
  return {
    title: "Updated Testing Book",
    author: "Jordan Author",
    year: 2021,
    genre: "Drama",
    summary: "This updated summary is still valid under the schema rules.",
    price: "25.50"
  };
}

async function seedValidBook(id) {
  const res = await http("POST", API_BASE, makeValidBook(id));
  if (res.status !== 201) {
    throw new Error(`Seed create failed for ${id}. Expected 201, got ${res.status}. Body: ${res.text}`);
  }
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // =====================================
  // STUDENTS MUST ADD ADDITIONAL TESTS
  // =====================================

  //T06 Valid UPDATE
  await test({
    id: "T06",
    name: "Valid update existing book",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 200,
    body: makeValidUpdate(),
    tags: []
  });

  // T07 UPDATE target not found
  await test({
    id: "T07",
    name: "Update missing target record",
    method: "PUT",
    path: updatePath(`missing-${Date.now()}`),
    expected: 404,
    body: makeValidUpdate(),
    tags: []
  });

  // T08 Required field CREATE: missing title
  await test({
    id: "T08",
    name: "Create missing required title",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const b = makeValidBook(`b${Date.now()+2}`);
      delete b.title;
      return b;
    })(),
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // T09 Required field CREATE: missing price
  await test({
    id: "T09",
    name: "Create missing required price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const b = makeValidBook(`b${Date.now()+3}`);
      delete b.price;
      return b;
    })(),
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // T10 Type validation CREATE: year wrong type
  await test({
    id: "T10",
    name: "Create invalid year type",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+4}`), year: "two thousand" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // T11 Type validation CREATE: price wrong type
  await test({
    id: "T11",
    name: "Create invalid price type",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+5}`), price: "abc" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // T12 Boundary CREATE: year below minimum
  await test({
    id: "T12",
    name: "Create year below lower boundary",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+6}`), year: 1449 },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // T13 Boundary CREATE: negative price
  await test({
    id: "T13",
    name: "Create negative price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+7}`), price: "-1.00" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // T14 Length CREATE: title too long
  await test({
    id: "T14",
    name: "Create title too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now()+8}`),
      title: "T".repeat(201)
    },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // T15 Length CREATE: summary too short
  await test({
    id: "T15",
    name: "Create summary too short",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now()+9}`),
      summary: "Too short"
    },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // T16 Temporal CREATE: future year
  await test({
    id: "T16",
    name: "Create year too far in the future",
    method: "POST",
    path: createPath,
    expected: 400,
    body: {
      ...makeValidBook(`b${Date.now()+10}`),
      year: new Date().getFullYear() + 2
    },
    tags: ["CREATE_FAIL", "TEMPORAL"]
  });

  // Seed one record for update validation tests
  const updateSeedId = `b${Date.now()+11}`;
  await seedValidBook(updateSeedId);

  // T17 Required validation UPDATE: empty title
  await test({
    id: "T17",
    name: "Update title to empty string",
    method: "PUT",
    path: updatePath(updateSeedId),
    expected: 400,
    body: { title: "   " },
    tags: ["UPDATE_FAIL", "REQUIRED"]
  });

  // T18 Type validation UPDATE: invalid year type
  await test({
    id: "T18",
    name: "Update invalid year type",
    method: "PUT",
    path: updatePath(updateSeedId),
    expected: 400,
    body: { year: "not-a-number" },
    tags: ["UPDATE_FAIL", "TYPE"]
  });

  // T19 Boundary UPDATE: price above max
  await test({
    id: "T19",
    name: "Update price above upper boundary",
    method: "PUT",
    path: updatePath(updateSeedId),
    expected: 400,
    body: { price: "1000.01" },
    tags: ["UPDATE_FAIL", "BOUNDARY"]
  });

  // T20 Length UPDATE: author too short
  await test({
    id: "T20",
    name: "Update author too short",
    method: "PUT",
    path: updatePath(updateSeedId),
    expected: 400,
    body: { author: "A" },
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  // T21 Temporal UPDATE: future year
  await test({
    id: "T21",
    name: "Update year too far in the future",
    method: "PUT",
    path: updatePath(updateSeedId),
    expected: 400,
    body: { year: new Date().getFullYear() + 2 },
    tags: ["UPDATE_FAIL", "TEMPORAL"]
  });

  // T22 UPDATE with empty body
  await test({
    id: "T22",
    name: "Update with no updatable fields",
    method: "PUT",
    path: updatePath(updateSeedId),
    expected: 400,
    body: {},
    tags: ["UPDATE_FAIL"]
  });

  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});