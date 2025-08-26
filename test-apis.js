// Simple test file to test all your APIs
// Run this with: node test-apis.js

const axios = require('axios');

const BASE_URL = 'http://localhost:6000/api/auth';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

async function testAPIs() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Signup
    console.log('1️⃣ Testing Signup...');
    const signupResponse = await axios.post(`${BASE_URL}/signup`, testUser);
    console.log('✅ Signup successful:', signupResponse.data);
    console.log('');

    // Test 2: Login
    console.log('2️⃣ Testing Login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data);
    authToken = loginResponse.data.token;
    console.log('');

    // Test 3: Get Profile (Protected Route)
    console.log('3️⃣ Testing Protected Route (Get Profile)...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data);
    console.log('');

    // Test 4: Change Password
    console.log('4️⃣ Testing Change Password...');
    const changePasswordResponse = await axios.post(`${BASE_URL}/change-password`, {
      oldPassword: testUser.password,
      newPassword: 'newpassword123'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Password changed:', changePasswordResponse.data);
    console.log('');

    // Test 5: Login with new password
    console.log('5️⃣ Testing Login with new password...');
    const newLoginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: 'newpassword123'
    });
    console.log('✅ Login with new password successful:', newLoginResponse.data);
    console.log('');

    // Test 6: Forgot Password (Note: This is not secure in production)
    console.log('6️⃣ Testing Forgot Password...');
    const forgotPasswordResponse = await axios.post(`${BASE_URL}/forgot-password`, {
      email: testUser.email,
      newPassword: 'resetpassword123'
    });
    console.log('✅ Password reset:', forgotPasswordResponse.data);
    console.log('');

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Run tests
testAPIs();
