const { assert } = require('chai');

const findUserByEmail  = require('../helper_function.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = "user@example.com";
    assert.equal(user.email, expectedOutput);
  });

  it('should return undefined with invalid email', function() {
    const user = findUserByEmail("notthere@example.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user.email, expectedOutput);
  });
});