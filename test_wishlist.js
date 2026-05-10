// Test script to verify user-specific wishlist functionality
// Run this in browser console to test

// Test User 1: Signup and add to wishlist
async function testUser1() {
  console.log('=== Testing User 1 ===');

  // Signup User 1
  const signupResponse = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      name: 'Test User 1',
      email: 'test1@example.com',
      phone: '9876543210',
      password: 'password123',
      confirmPassword: 'password123'
    })
  });

  const signupData = await signupResponse.json();
  console.log('User 1 Signup:', signupData);

  // Simulate adding property to wishlist (this would normally be done via UI)
  const testProperty = {
    id: 'test_prop_1',
    title: 'Test Property 1',
    location: 'Test Location',
    price: '₹15000 / month'
  };

  // Store in user-specific localStorage
  const userId = signupData.user?.id;
  const wishlistKey = `wishlist_${userId}`;
  localStorage.setItem(wishlistKey, JSON.stringify([testProperty]));

  console.log(`User 1 wishlist stored with key: ${wishlistKey}`);
  console.log('User 1 wishlist:', JSON.parse(localStorage.getItem(wishlistKey)));
}

// Test User 2: Signup and check wishlist is separate
async function testUser2() {
  console.log('=== Testing User 2 ===');

  // Signup User 2
  const signupResponse = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      name: 'Test User 2',
      email: 'test2@example.com',
      phone: '9876543211',
      password: 'password123',
      confirmPassword: 'password123'
    })
  });

  const signupData = await signupResponse.json();
  console.log('User 2 Signup:', signupData);

  // Check User 2's wishlist (should be empty)
  const userId = signupData.user?.id;
  const wishlistKey = `wishlist_${userId}`;
  const user2Wishlist = localStorage.getItem(wishlistKey);

  console.log(`User 2 wishlist key: ${wishlistKey}`);
  console.log('User 2 wishlist (should be null/empty):', user2Wishlist);

  // Add different property for User 2
  const testProperty2 = {
    id: 'test_prop_2',
    title: 'Test Property 2',
    location: 'Different Location',
    price: '₹20000 / month'
  };

  localStorage.setItem(wishlistKey, JSON.stringify([testProperty2]));
  console.log('User 2 wishlist after adding:', JSON.parse(localStorage.getItem(wishlistKey)));
}

// Test Login and wishlist persistence
async function testLogin() {
  console.log('=== Testing Login ===');

  // Login as User 1
  const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: 'test1@example.com',
      password: 'password123'
    })
  });

  const loginData = await loginResponse.json();
  console.log('User 1 Login:', loginData);

  // Check if User 1's wishlist is loaded (this would be handled by the React app)
  console.log('Login successful - wishlist should be loaded automatically in the app');
}

// Run tests
async function runTests() {
  try {
    await testUser1();
    await testUser2();
    await testLogin();

    console.log('=== Test Results ===');
    console.log('Check localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('wishlist_')) {
        console.log(`${key}:`, JSON.parse(localStorage.getItem(key)));
      }
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Uncomment to run tests:
// runTests();