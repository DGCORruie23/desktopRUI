
// async function insertUser() {
//     const nickname = document.getElementById('insertNickname').value;
//     const nombre = document.getElementById('insertNombre').value;
//     const apellido = document.getElementById('insertApellido').value;
//     const password = document.getElementById('insertPassword').value;
//     const estado = document.getElementById('insertEstado').value;
//     const tipo = document.getElementById('insertTipo').value;

//     console.log('Insertando usuario:', { nickname, nombre, apellido, password, estado, tipo });

//     try {
//         await window.dbManager.executeQuery('INSERT INTO Users (nickname, nombre, apellido, password, estado, tipo) VALUES (?, ?, ?, ?, ?, ?)', [nickname, nombre, apellido, password, estado, tipo]);
//         console.log('Usuario insertado correctamente');
//         alert('Usuario insertado correctamente');
//     } catch (error) {
//         console.error('Error al insertar el usuario:', error.message);
//         alert('Error al insertar el usuario: ' + error.message);
//     }
// }



async function deleteUser() {
    const id = document.getElementById('deleteId').value;

    console.log('Eliminando usuario con ID:', id);

    try {
        await window.dbManager.executeQuery('DELETE FROM Users WHERE id = ?', [id]);
        console.log('Usuario eliminado correctamente');
        alert('Usuario eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el usuario:', error.message);
        alert('Error al eliminar el usuario: ' + error.message);
    }
}

async function selectUsers() {
    console.log('Seleccionando todos los usuarios');

    try {
        const rows = await window.dbManager.executeQuery('SELECT * FROM Users', []);
        console.log('Usuarios seleccionados:', rows);
        alert('Usuarios seleccionados:\n' + JSON.stringify(rows, null, 2));
    } catch (error) {
        console.error('Error al seleccionar los usuarios:', error.message);
        alert('Error al seleccionar los usuarios: ' + error.message);
    }
}






window.addEventListener('DOMContentLoaded', () => {
    window.api.receiveUserData((user) => {
      const estadoMap = {
        '1': 'AGUASCALIENTES',
        '2': 'BAJA CALIFORNIA',
        '3': 'BAJA CALIFORNIA SUR',
        '4': 'CAMPECHE',
        '5': 'COAHUILA',
        '6': 'COLIMA',
        '7': 'CHIAPAS',
        '8': 'CHIHUAHUA',
        '9': 'CDMX',
        '10': 'DURANGO',
        '11': 'GUANAJUATO',
        '12': 'GUERRERO',
        '13': 'HIDALGO',
        '14': 'JALISCO',
        '15': 'EDOMEX',
        '16': 'MICHOACÁN',
        '17': 'MORELOS',
        '18': 'NAYARIT',
        '19': 'NUEVO LEÓN',
        '20': 'OAXACA',
        '21': 'PUEBLA',
        '22': 'QUERÉTARO',
        '23': 'QUINTANA ROO',
        '24': 'SAN LUIS POTOSÍ',
        '25': 'SINALOA',
        '26': 'SONORA',
        '27': 'TABASCO',
        '28': 'TAMAULIPAS',
        '29': 'TLAXCALA',
        '30': 'VERACRUZ',
        '31': 'YUCATÁN',
        '32': 'ZACATECAS'
      };
      console.log("entró");
      console.log(user);
      const estado = estadoMap[user.estado] || 'Estado desconocido';
      const header = document.querySelector('header h1');
      header.textContent = `RESCATES OR: ${estado}`;

      const footer = document.querySelector('footer p');
      footer.textContent = `Agente: ${user.nombre} ${user.apellido}`;

      const oficinaR = document.getElementById("oficinaR");
      oficinaR.value = `${estado}`;;
      oficinaR.textContent = `${estado}`;;
    });
  });





  window.addEventListener('DOMContentLoaded', () => {
    window.api.updateUserData((user) => {
        validarUser(user);
    });
  });


  async function validarUser(user) {
    const nickname = user.nickname;
    const password = user.password;

    var validado = 0;

  
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
              
              updateUser(user.id,nickname, nombre, apellido, password, estado, tipo);
              window.myAPI.printNameToCLI(validado);
  
            } else {
                validado = 0;
                console.log("validado vale");
                console.log(validado);
                deleteUserAll();
                window.myAPI.printNameToCLI(validado);
            }
        } else {

        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
    }
  
  }



  async function updateUser(id,nickname,nombre,apellido,password,estado,tipo) {
        await window.dbManager.executeQuery('UPDATE Users SET nickname = ?, nombre = ?, apellido = ?, password = ?, estado = ?, tipo = ? WHERE id = ?', [nickname, nombre, apellido, password, estado, tipo, id]);
}








//   async function updateUser() {
//     const id = document.getElementById('updateId').value;
//     const nickname = document.getElementById('updateNickname').value;
//     const nombre = document.getElementById('updateNombre').value;
//     const apellido = document.getElementById('updateApellido').value;
//     const password = document.getElementById('updatePassword').value;
//     const estado = document.getElementById('updateEstado').value;
//     const tipo = document.getElementById('updateTipo').value;

//     console.log('Actualizando usuario con ID:', id);

//     try {
//         await window.dbManager.executeQuery('UPDATE Users SET nickname = ?, nombre = ?, apellido = ?, password = ?, estado = ?, tipo = ? WHERE id = ?', [nickname, nombre, apellido, password, estado, tipo, id]);
//         console.log('Usuario actualizado correctamente');
//         alert('Usuario actualizado correctamente');
//     } catch (error) {
//         console.error('Error al actualizar el usuario:', error.message);
//         alert('Error al actualizar el usuario: ' + error.message);
//     }
// }





async function deleteUserAll() {
    await window.dbManager.executeQuery('DELETE FROM Users');
}



window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('main-window-ready');
});

ipcRenderer.on('update-data', (event, userData) => {
  // Aquí manejas los datos del usuario
  console.log('Datos del usuario recibidos:', userData);
  // Actualiza tu UI con los datos del usuario
});
