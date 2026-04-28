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

// 🎥 CAMARA MÁS ABIERTA (clave)
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: "user",
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  }
}).then(stream => {
  video.srcObject = stream;
});

// 🔄 CAMBIAR
changeBtn.onclick = () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
};

// 📸 CAPTURA
captureBtn.onclick = () => {

  const cw = 1080;
  const ch = 1920;

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  // 🔥 MÁS ABIERTO (zoom out)
  const scale = Math.min(cw / vw, ch / vh) * 1.05;

  const sw = vw * scale;
  const sh = vh * scale;

  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2;

  ctx.drawImage(video, dx, dy, sw, sh);

  // =========================
  // 🟥 CAJA TEXTO RESPONSIVA
  // =========================
  const boxWidth = cw * 0.75; // 🔥 antes fija → ahora proporcional
  const boxHeight = ch * 0.14;

  const boxX = (cw - boxWidth) / 2;
  const boxY = 120;

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 40);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 12;

  ctx.fillStyle = "white";
  ctx.font = "bold 65px Arial";
  ctx.fillText("¿QUÉ ÁREA", cw/2, boxY + 70);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", cw/2, boxY + 140);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", cw/2, boxY + 210);

  ctx.shadowBlur = 0;

  // =========================
  // 🤖 INACAPITO DESDE ABAJO
  // =========================
  const img = new Image();
  img.src = inacapito.src;

  img.onload = () => {

    const width = cw * 0.95; // más grande
    const height = width * (img.height / img.width);

    const x = (cw - width) / 2;

    // 🔥 CLAVE: parte fuera del canvas
    const y = ch - height * 0.65;

    ctx.drawImage(img, x, y, width, height);

    canvas.toBlob(blob => {
      const file = new File([blob], "inacap.png", { type: "image/png" });

      if (navigator.share) {
        navigator.share({
          files: [file],
          title: "INACAP"
        });
      }
    });
  };
};

// 🔧 RECT
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
