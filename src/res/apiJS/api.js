function validateUser() {

    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
  
    const data = JSON.stringify({
      "nickname": nickname,
      "password": password
    });

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
  
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {

        } else {

        }
      }
    });
  
    xhr.open("POST", "https://ruie.dgcor.com/login/validar/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("User-Agent", "insomnia/8.6.0");
    xhr.send(data);


    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
            console.log(xhr.response);
            console.log(xhr.responseText);
            console.log("Usuario válido");

            var obj = $.parseJSON(xhr.responseText);
            var valPasswd = obj['password'];
            var valUser = obj['nickname'];
            
            //alert(valPasswd);

            if(valPasswd == 'ok'){
                alert("¡Usuario correcto!");
            }else {
                alert("Usuario y/o contraseña incorrectos");
            }
          }else {
            alert("No se ha podido conectar con el sistema.");
          }
        }
      };
  }
  