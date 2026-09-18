import assert from 'node:assert';
import { signup, login } from '../src/controllers/auth.controller.js';
import { schemas } from '../src/validators/schemas.js';

export async function runAuthTests() {
  console.log('  ▶ Testing Auth & Validation Controllers...');

  // 1. Validation Schema Tests
  const validReg = schemas.register({
    email: 'testuser@recip52.com',
    password: 'Password123!',
    firstName: 'Jordan',
  });
  assert.strictEqual(validReg.length, 0, 'Valid registration should produce 0 errors');

  const invalidEmailReg = schemas.register({
    email: 'invalid-email',
    password: 'Password123!',
    firstName: 'Jordan',
  });
  assert.ok(invalidEmailReg.length > 0, 'Invalid email must fail validation');
  assert.strictEqual(invalidEmailReg[0].field, 'email');

  const shortPassReg = schemas.register({
    email: 'valid@recip52.com',
    password: '123',
    firstName: 'Jordan',
  });
  assert.ok(shortPassReg.length > 0, 'Short password must fail validation');
  assert.strictEqual(shortPassReg[0].field, 'password');

  // 2. Mock Express Request/Response for Signup
  let signupResponse = {};
  const mockSignupReq = {
    body: {
      email: `runner_${Date.now()}@recip52.com`,
      password: 'StrongPassword123!',
      firstName: 'Runner',
      lastName: 'Athlete',
    },
  };
  const mockSignupRes = {
    status(code) {
      signupResponse.statusCode = code;
      return this;
    },
    json(data) {
      signupResponse.body = data;
      return this;
    },
  };

  await signup(mockSignupReq, mockSignupRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(signupResponse.statusCode, 201, 'Signup status should be 201');
  assert.strictEqual(signupResponse.body.success, true, 'Signup should return success: true');
  assert.ok(signupResponse.body.token, 'Signup should issue a JWT token');
  assert.strictEqual(signupResponse.body.user.firstName, 'Runner');

  // 3. Mock Express Request/Response for Login
  let loginResponse = {};
  const mockLoginReq = {
    body: {
      email: mockSignupReq.body.email,
      password: 'StrongPassword123!',
    },
  };
  const mockLoginRes = {
    status(code) {
      loginResponse.statusCode = code;
      return this;
    },
    json(data) {
      loginResponse.body = data;
      return this;
    },
  };

  await login(mockLoginReq, mockLoginRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(loginResponse.statusCode, 200, 'Login status should be 200');
  assert.strictEqual(loginResponse.body.success, true, 'Login should succeed');
  assert.ok(loginResponse.body.token, 'Login should issue a JWT token');
  assert.strictEqual(loginResponse.body.user.email, mockSignupReq.body.email);

  console.log('  ✔ Auth & Validation tests passed successfully.');
}

if (process.argv[1] && process.argv[1].endsWith('auth.test.js')) {
  runAuthTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
