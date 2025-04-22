
    const form = document.getElementById('registerForm');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const isAdmin = document.getElementById('is_admin').checked;
  
      
  
    
      if (username.length < 4 || username.length > 20) {
        alert('Username must be between 4 and 20 characters.');
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
  
      if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
  
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

  
      const user = { username, email, password, isAdmin };
  
      let users = JSON.parse(localStorage.getItem('users')) || [];
  
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        alert('Email already registered.');
        return;
      }
  
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
  
      alert('Registration successful!');
      window.location.href = 'login.html';
    });

  
