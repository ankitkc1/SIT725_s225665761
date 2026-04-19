const expect = require("chai").expect;
const request = require("request");

describe("Calculator API Tests", function () {
  const baseUrl = "http://localhost:3000";

  it("return status 200 for the home page", function (done) {
    request(baseUrl, function (error, response, body) {
      expect(error).to.equal(null);
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it("return correct sum for valid numbers", function (done) {
    request.get(`${baseUrl}/add?a=10&b=5`, function (error, response, body) {
      expect(error).to.equal(null);
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("15");
      done();
    });
  });

  it("return 400 for missing parameter", function (done) {
    request.get(`${baseUrl}/add?a=10`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      expect(body).to.include("Invalid input");
      done();
    });
  });

  it("return 400 for non-numeric input", function (done) {
    request.get(`${baseUrl}/add?a=hello&b=world`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      expect(body).to.include("Invalid input");
      done();
    });
  });
});