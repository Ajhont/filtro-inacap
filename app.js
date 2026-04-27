const video = document.getElementById("camera");
const inacapito = document.getElementById("inacapito");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture");

const images = [
  "assets/inacapito1.png",
  "assets/inacapito2.png",
  "assets/inacapito3.png",
  "assets/inacapito4.png",
  "assets/inacapito5.png",
  "assets/inacapito6.png"
];

let index = 0;

// 📷 Activar cámara
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
}).then(stream => {
  video.srcObject = stream;
});

// 🔁 Cambiar imagen con tap
document.body.addEventListener("click", () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
});

// 📸 Capturar imagen
const shareBtn = document.getElementById("share");

shareBtn.addEventListener("click", async () => {
  canvas.width = video.videoWidth * 2;
  canvas.height = video.videoHeight * 2;

  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  ctx.drawImage(video, 0, 0);

  const img = new Image();
  img.src = inacapito.src;

  img.onload = async () => {
    ctx.drawImage(
      img,
      canvas.width / 2 * 0.65,
      canvas.height / 2 * 0.65,
      canvas.width / 2 * 0.35,
      canvas.height / 2 * 0.35
    );

    canvas.toBlob(async (blob) => {
      const file = new File([blob], "inacap.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "Mi área INACAP",
          text: "Descubre tu área en INACAP 🚀"
        });
      } else {
        alert("Tu navegador no permite compartir directo 😢");
      }
    });
  };
});