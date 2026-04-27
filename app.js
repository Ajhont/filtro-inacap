const video = document.getElementById("camera");
const inacapito = document.getElementById("inacapito");
const canvas = document.getElementById("canvas");
const shareBtn = document.getElementById("share");

const images = [
  "assets/admin.png",
  "assets/mecanica.png",
  "assets/gastronomia.png",
  "assets/informatica.png",
  "assets/logistica.png"
];

let index = 0;

// activar cámara
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
}).then(stream => {
  video.srcObject = stream;
});

// cambiar personaje
document.body.addEventListener("click", () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
});

// compartir imagen
shareBtn.addEventListener("click", async () => {

  canvas.width = video.videoWidth * 2;
  canvas.height = video.videoHeight * 2;

  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  ctx.drawImage(video, 0, 0);

  const img = new Image();
  img.src = inacapito.src;

  img.onload = async () => {

    ctx.imageSmoothingQuality = "high";

    // posición y tamaño grande
    const width = video.videoWidth * 0.4;
    const height = video.videoHeight * 0.4;

    ctx.drawImage(
      img,
      video.videoWidth * 0.55,
      video.videoHeight * 0.55,
      width,
      height
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
        alert("Tu celular no permite compartir directo 😢");
      }
    });
  };
});
