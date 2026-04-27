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

// cambiar personaje
changeBtn.addEventListener("click", () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
});

// compartir (SIN botones)
shareBtn.addEventListener("click", async () => {

  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");

  // cámara
  ctx.drawImage(video, 0, 0, 1080, 1920);

  // TEXTO GRANDE
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "bold 90px Arial";
  ctx.fillText("¿QUÉ ÁREA", 540, 150);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", 540, 260);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", 540, 370);

  // inacapito
  const img = new Image();
  img.src = inacapito.src;

  img.onload = async () => {

    const width = 1000;
    const height = 1000;

    ctx.drawImage(
      img,
      40,
      1920 - height + 120, // efecto salida desde abajo
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
