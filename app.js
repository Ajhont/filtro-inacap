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
  video.onloadedmetadata = () => ajustarVideo();
});

// PREVIEW (más abierto)
function ajustarVideo() {
  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const sw = window.innerWidth;
  const sh = window.innerHeight;

  const scale = Math.max(sw / vw, sh / vh) * 0.9;

  video.style.width = vw * scale + "px";
  video.style.height = vh * scale + "px";
}

// CAMBIAR
changeBtn.addEventListener("click", () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
});

// CAPTURA
captureBtn.addEventListener("click", async () => {

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const cw = 1080;
  const ch = 1920;

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");

  // 🔥 SCALE MÁS GRANDE PARA ELIMINAR NEGRO
  let scale = Math.max(cw / vw, ch / vh);
  scale *= 1.15; // 👈 clave (overfill)

  const sw = vw * scale;
  const sh = vh * scale;

  // 👇 mover levemente hacia arriba para compensar IG
  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2 - 120;

  ctx.drawImage(video, dx, dy, sw, sh);

  // HEADER
  const boxWidth = 900;
  const boxHeight = 300;
  const boxX = (cw - boxWidth) / 2;
  const boxY = 80;

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 40);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 15;

  ctx.fillStyle = "white";
  ctx.font = "bold 75px Arial";
  ctx.fillText("¿QUÉ ÁREA", cw / 2, boxY + 90);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", cw / 2, boxY + 180);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", cw / 2, boxY + 270);

  ctx.shadowBlur = 0;

  // INACAPITO (más grande y seguro)
  const img = new Image();
  img.src = inacapito.src;

  img.onload = async () => {

    const width = 1200; // 👈 más grande
    const aspect = img.height / img.width;
    const height = width * aspect;

    const x = (cw - width) / 2;
    const y = ch - height + 120; // 👈 sube un poco

    ctx.drawImage(img, x, y, width, height);

    canvas.toBlob(async (blob) => {
      const file = new File([blob], "inacap.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "INACAP",
          text: "Descubre tu área 🚀"
        });
      }
    });
  };
});

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
