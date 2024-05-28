
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

  console.log("Entró a validateUser");
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

          console.log(responseData);
          if (valPasswd === 'ok') {
            //   validado = 1;
            //   console.log("Usuario correcto");
            //   console.log(validado);

            
            const nickname = responseData['nickname'];
            const nombre = responseData['nombre'];
            const apellido = responseData['apellido'];
            const estado = responseData['estado'];
            const tipo = responseData['tipo'];

            const validado = {
                val: 1,
                nickname: nickname,
                nombre: nombre,
                apellido: apellido,
                estado: estado,
                tipo: tipo,
                password: password,
            };

            insertUser(nickname, nombre, apellido, password, estado, tipo);
            window.myAPI.printNameToCLI(validado);

          } else {
              validado = 0;
              document.getElementById("errorMessage").style.display = "block";
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

async function insertUser(nickname, nombre, apellido, password, estado, tipo) {

    console.log('Insertando usuario:', { nickname, nombre, apellido, password, estado, tipo });

    try {
        await window.dbManager.executeQuery('INSERT INTO Users (nickname, nombre, apellido, password, estado, tipo) VALUES (?, ?, ?, ?, ?, ?)', [nickname, nombre, apellido, password, estado, tipo]);
        console.log('Usuario insertado correctamente');
        alert('Usuario insertado correctamente');
    } catch (error) {
        console.error('Error al insertar el usuario:', error.message);
        alert('Error al insertar el usuario: ' + error.message);
    }
}



















