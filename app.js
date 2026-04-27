const video = document.getElementById("camera");
const inacapito = document.getElementById("inacapito");
const canvas = document.getElementById("canvas");

const changeBtn = document.getElementById("change");
const shareBtn = document.getElementById("share");

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
});

// cambiar personaje
changeBtn.addEventListener("click", () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
});

// COMPARTIR SIN DISTORSIÓN
shareBtn.addEventListener("click", async () => {

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const canvasWidth = 1080;
  const canvasHeight = 1920;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d");

  // COVER REAL (tipo CSS cover)
  const scale = Math.max(canvasWidth / vw, canvasHeight / vh);

  const scaledWidth = vw * scale;
  const scaledHeight = vh * scale;

  const dx = (canvasWidth - scaledWidth) / 2;
  const dy = (canvasHeight - scaledHeight) / 2;

  ctx.drawImage(video, dx, dy, scaledWidth, scaledHeight);

  // TEXTO CONSISTENTE
  ctx.textAlign = "center";

  ctx.fillStyle = "white";
  ctx.font = "bold 80px Arial";
  ctx.fillText("¿QUÉ ÁREA", 540, 150);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", 540, 250);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", 540, 350);

  // inacapito
  const img = new Image();
  img.src = inacapito.src;

  img.onload = async () => {

    const width = 900;
    const height = 900;

    ctx.drawImage(
      img,
      (canvasWidth - width) / 2,
      canvasHeight - height + 120,
      width,
      height
    );

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
