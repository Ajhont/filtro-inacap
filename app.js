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
captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(video, 0, 0);

  const img = new Image();
  img.src = inacapito.src;

  img.onload = () => {
    ctx.drawImage(
      img,
      canvas.width * 0.65,
      canvas.height * 0.65,
      canvas.width * 0.3,
      canvas.height * 0.3
    );

    const link = document.createElement("a");
    link.download = "inacap.png";
    link.href = canvas.toDataURL();
    link.click();
  };
});