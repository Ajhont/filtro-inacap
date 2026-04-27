const video = document.getElementById("camera");
const inacapito = document.getElementById("inacapito");
const canvas = document.getElementById("canvas");

const changeBtn = document.getElementById("change");
const shareBtn = document.getElementById("share");

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
});

// cambiar carrera
changeBtn.addEventListener("click", () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
});

// compartir
shareBtn.addEventListener("click", async () => {

  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");

  // dibujar cámara
  ctx.drawImage(video, 0, 0, 1080, 1920);

  // texto
  ctx.fillStyle = "white";
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  ctx.fillText("¿QUÉ ÁREA INACAP ERES?", 540, 120);

  // imagen
  const img = new Image();
  img.src = inacapito.src;

  img.onload = async () => {
    ctx.drawImage(img, 200, 1100, 700, 700);

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
