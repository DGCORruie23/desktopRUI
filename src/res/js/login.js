
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    let validado = 1;
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const nickname = document.getElementById('nickname').value;
      const password = document.getElementById('password').value;
  
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/9.2.0'
        },
        body: JSON.stringify({ nickname, password })
      };
  
      try {
        const response = await fetch('http://ruie.dgcor.com/login/validar/?=', options);
        const data = await response.json();
  
        if (data.nickname === 'error' && data.password === 'error') {
          errorMessage.style.display = 'block';
          errorMessage.style.backgroundColor = 'red';
          errorMessage.style.color = 'white';
          errorMessage.textContent = 'Nombre de usuario y/o contraseña incorrectos.';
        } else {
          data.password = password;
          
          window.api.saveUserToDatabase(data);
          window.api.thenLogin(validado);
        }
      } catch (err) {
        console.error(err);
        errorMessage.style.display = 'block';
        errorMessage.style.backgroundColor = '#C30E2E';
        errorMessage.style.color = 'white';
        errorMessage.textContent = 'Error al conectar con el servidor. Inténtalo de nuevo más tarde.';
      }
    });
  });
  


 