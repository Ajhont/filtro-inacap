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

// CAMARA
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
}).then(stream => {
  video.srcObject = stream;
});

// CAMBIAR
changeBtn.onclick = () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
};

// CAPTURA
captureBtn.onclick = () => {

  const cw = 1080;
  const ch = 1920;

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");

  // 🔥 CALCULO COVER REAL (NO DISTORSIONA)
  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const scale = Math.max(cw / vw, ch / vh);

  const sw = vw * scale;
  const sh = vh * scale;

  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2;

  ctx.drawImage(video, dx, dy, sw, sh);

  // 🔥 SAFE AREA SUPERIOR (Instagram)
  const safeTop = 120;

  // CAJA TEXTO
  const boxWidth = 900;
  const boxHeight = 260;
  const boxX = (cw - boxWidth) / 2;
  const boxY = safeTop;

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 40);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 10;

  ctx.fillStyle = "white";
  ctx.font = "bold 70px Arial";
  ctx.fillText("¿QUÉ ÁREA", cw/2, boxY + 80);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", cw/2, boxY + 160);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", cw/2, boxY + 240);

  ctx.shadowBlur = 0;

  // 🔥 SAFE AREA INFERIOR (Instagram UI)
  const safeBottom = 250;

  // INACAPITO
  const img = new Image();
  img.src = inacapito.src;

  img.onload = () => {

    const width = 1000;
    const height = width * (img.height / img.width);

    const x = (cw - width) / 2;
    const y = ch - height - safeBottom + 80;

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

// RECT
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
