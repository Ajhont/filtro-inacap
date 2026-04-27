const video = document.getElementById("camera");
const inacapito = document.getElementById("inacapito");
const canvas = document.getElementById("canvas");

const changeBtn = document.getElementById("change");
const shareBtn = document.getElementById("share");

const images = [
  "assets/inacapito6.png",
  "assets/inacapito2.png",
  "assets/inacapito3.png",
  "assets/inacapito4.png",
  "assets/inacapito5.png"
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

// compartir (SIN deformación)
shareBtn.addEventListener("click", async () => {

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  // calcular recorte vertical tipo story
  const targetRatio = 9 / 16;
  let newHeight = videoWidth / targetRatio;

  if (newHeight > videoHeight) {
    newHeight = videoHeight;
  }

  const offsetY = (videoHeight - newHeight) / 2;

  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");

  // dibujar cámara recortada (SIN deformar)
  ctx.drawImage(
    video,
    0,
    offsetY,
    videoWidth,
    newHeight,
    0,
    0,
    1080,
    1920
  );

  // TEXTO PRO
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "bold 80px Arial";
  ctx.fillText("¿QUÉ ÁREA", 540, 150);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", 540, 240);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", 540, 330);

  // inacapito
  const img = new Image();
  img.src = inacapito.src;

  img.onload = async () => {

    const width = 1000;
    const height = 1000;

    ctx.drawImage(
      img,
      40,
      1920 - height + 180,
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
