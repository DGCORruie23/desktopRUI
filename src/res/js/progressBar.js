var i = 0;
function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var counter = document.getElementById("counter");
    var width = 1;
    var id = setInterval(frame, 5);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        counter.textContent = width+" %";
        elem.style.width = width + "%";
      }
    }
  }
}

move();