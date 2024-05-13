
export function loginUser(credentials) {
  try {
    // Retrieve users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Check if user exists and password matches
    const user = users.find(user => user.username === credentials.username && user.password === credentials.password);
    if (user) {
      // Simulate generating a token (could be more complex in real use)
      const token = `token-${user.username}-${Date.now()}`;
      localStorage.setItem('token', token);
      return Promise.resolve({ success: true, token, message: 'Login successful!' });
    } else {
      return Promise.reject({ success: false, message: 'Invalid username or password!' });
    }
  } catch (error) {
    console.error('Error:', error);
    return Promise.reject({ success: false, message: 'An error occurred during login.' });
  }
}


export function registerUser(userData) {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Check if user already exists
    if (users.some(user => user.username === userData.username)) {
      return Promise.reject({ success: false, message: 'User already exists!' });
    }
    // Add new user to the array
    users.push({ username: userData.username, password: userData.password });
    localStorage.setItem('users', JSON.stringify(users));
    return Promise.resolve({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error('Error:', error);
    return Promise.reject({ success: false, message: 'An error occurred during registration.' });
  }
}
