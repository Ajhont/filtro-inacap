const video = document.getElementById("camera");
const inacapito = document.getElementById("inacapito");
const canvas = document.getElementById("canvas");

const changeBtn = document.getElementById("change");
const captureBtn = document.getElementById("capture");

const images = [
  "assets/inacapito2.png",
  "assets/inacapito3.png",
  "assets/inacapito4.png",
  "assets/inacapito5.png",
  "assets/inacapito6.png"
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

// 🔥 ajuste con zoom reducido (más amplitud)
function ajustarVideo() {
  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const sw = window.innerWidth;
  const sh = window.innerHeight;

  const scale = Math.max(sw / vw, sh / vh) * 0.85;

  video.style.width = vw * scale + "px";
  video.style.height = vh * scale + "px";
}

// cambiar imagen
changeBtn.addEventListener("click", () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
});

// capturar
captureBtn.addEventListener("click", async () => {

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const cw = 1080;
  const ch = 1920;

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");

  // 🔥 mismo ajuste que preview
  const scale = Math.max(cw / vw, ch / vh) * 0.85;

  const sw = vw * scale;
  const sh = vh * scale;

  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2;

  ctx.drawImage(video, dx, dy, sw, sh);

  // gradiente
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(0,0,0,0.6)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cw, 300);

  // texto
  ctx.textAlign = "center";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 10;

  ctx.fillStyle = "white";
  ctx.font = "bold 80px Arial";
  ctx.fillText("¿QUÉ ÁREA", 540, 140);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", 540, 240);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", 540, 340);

  ctx.shadowBlur = 0;

  // inacapito
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
