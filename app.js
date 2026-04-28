const video = document.getElementById("camera");
const inacapito = document.getElementById("inacapito");
const canvas = document.getElementById("canvas");

const changeBtn = document.getElementById("change");
const captureBtn = document.getElementById("capture");

const images = [
  "assets/admin.png",
  "assets/mecanica.png",
  "assets/gastronomia.png",
  "assets/informatica.png",
  "assets/logistica.png"
];

let index = 0;

// 🎥 CAMARA
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
})
.then(stream => {
  video.srcObject = stream;
})
.catch(err => {
  alert("No se pudo acceder a la cámara");
});

// 🔄 CAMBIAR
changeBtn.onclick = () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
};

// 📸 CAPTURAR
captureBtn.onclick = () => {

  const cw = 1080;
  const ch = 1920;

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");

  // 🔥 DIBUJAR VIDEO (cover real)
  ctx.drawImage(video, 0, 0, cw, ch);

  // 🔥 CAJA TEXTO
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(100, 60, 880, 260);

  ctx.textAlign = "center";

  ctx.fillStyle = "white";
  ctx.font = "bold 70px Arial";
  ctx.fillText("¿QUÉ ÁREA", cw/2, 140);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", cw/2, 230);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", cw/2, 320);

  // 🔥 INACAPITO
  const img = new Image();
  img.src = inacapito.src;

  img.onload = () => {

    const width = 900;
    const height = width * (img.height / img.width);

    ctx.drawImage(
      img,
      (cw - width)/2,
      ch - height,
      width,
      height
    );

    // 🔥 SHARE
    canvas.toBlob(blob => {

      const file = new File([blob], "inacap.png", { type: "image/png" });

      if (navigator.share) {
        navigator.share({
          files: [file],
          title: "INACAP"
        });
      } else {
        alert("No compatible con compartir");
      }

    });

  };
};
