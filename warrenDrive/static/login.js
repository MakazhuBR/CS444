async function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission behavior
  
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    if (!username || !password) {
      alert('Please fill in both username and password fields.');
      return;
    }

    var formData = {
      username: username,
      password: password
    }
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
  
    if (response.ok) {
      const data = await response.json();      
      if (data.message === 'login successful') {
        console.log('Redirecting to /home');
        window.location.href = '/home'; // Redirect to /addFile page
      } else {
        const loginStatus = document.getElementById("loginStatus");
        loginStatus.textContent = data.message;
      }
    } else {
      console.error('Error logging in:', response.statusText);
      alert('An error occurred. Please try again later.');
    }
    
  }
  
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', handleLogin);
  