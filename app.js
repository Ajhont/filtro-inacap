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

// cámara
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
}).then(stream => {
  video.srcObject = stream;

  video.onloadedmetadata = () => {
    ajustarVideo();
  };
});

// ajuste tipo cover (igual que canvas)
function ajustarVideo() {
  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const scale = Math.max(screenW / vw, screenH / vh);

  video.style.width = vw * scale + "px";
  video.style.height = vh * scale + "px";
}

// cambiar personaje
changeBtn.addEventListener("click", () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
});

// capturar y compartir
captureBtn.addEventListener("click", async () => {

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const cw = 1080;
  const ch = 1920;

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");

  // cover real (sin deformar)
  const scale = Math.max(cw / vw, ch / vh);

  const sw = vw * scale;
  const sh = vh * scale;

  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2;

  ctx.drawImage(video, dx, dy, sw, sh);

  // texto
  ctx.textAlign = "center";

  ctx.fillStyle = "white";
  ctx.font = "bold 80px Arial";
  ctx.fillText("¿QUÉ ÁREA", 540, 150);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", 540, 250);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", 540, 350);

  // inacapito proporcional
  const img = new Image();
  img.src = inacapito.src;

  img.onload = async () => {

    const width = 1000;
    const aspect = img.height / img.width;
    const height = width * aspect;

    const x = (cw - width) / 2;
    const y = ch - height + 140;

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
