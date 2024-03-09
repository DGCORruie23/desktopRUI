const { ipcRenderer } = require('electron');

async function validateUser() {
  const nickname = document.getElementById('nickname').value;
  const password = document.getElementById('password').value;
  const loginButton = document.querySelector('button');
  var validado = 0;

  loginButton.disabled = true;

  const data = JSON.stringify({
      "nickname": nickname,
      "password": password
  });

  try {
      const response = await fetch("https://ruie.dgcor.com/login/validar/", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'insomnia/8.6.0'
          },
          body: data
      });

      if (response.ok) {
          const responseData = await response.json();
          const valPasswd = responseData['password'];

          if (valPasswd === 'ok') {
              alert("¡Usuario correcto!");
              validado = 1;
              ipcRenderer.send('user-validated');
          } else {
              alert("Usuario y/o contraseña incorrectos");
          }
      } else {
          alert("No se ha podido conectar con el sistema.");
      }
  } catch (error) {
      console.error('Error:', error);
  } finally {
      loginButton.disabled = false;
  }

}
