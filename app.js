const video = document.getElementById("camera");
const inacapito = document.getElementById("inacapito");
const canvas = document.getElementById("canvas");

const changeBtn = document.getElementById("change");
const captureBtn = document.getElementById("capture");

const images = [
  "assets/inacapito2.png",
  "assets/inacapito3.png",
  "assets/inacapito4.png",
  "assets/inacapito5.png"
];

let index = 0;

// 🎥 CAMARA MÁS ABIERTA
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: "user",
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  }
}).then(stream => {
  video.srcObject = stream;
});

// 🔄 CAMBIO
changeBtn.onclick = () => {
  index = (index + 1) % images.length;
  inacapito.src = images[index];
};

// 📸 CAPTURA
captureBtn.onclick = () => {

  const cw = 1080;
  const ch = 1920;

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const scale = Math.min(cw / vw, ch / vh) * 0.9;

  const sw = vw * scale;
  const sh = vh * scale;

  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2;

  ctx.drawImage(video, dx, dy, sw, sh);

  // SAFE AREAS
  const safeTop = 180;
  const safeBottom = 350;

  // TEXTO
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.roundRect(150, safeTop, 780, 220, 40);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("¿QUÉ ÁREA", cw/2, safeTop + 70);

  ctx.fillStyle = "#E30613";
  ctx.fillText("INACAP", cw/2, safeTop + 140);

  ctx.fillStyle = "white";
  ctx.fillText("ERES?", cw/2, safeTop + 210);

  // INACAPITO
  const img = new Image();
  img.src = inacapito.src;

  img.onload = () => {

    const width = cw * 0.8;
    const height = width * (img.height / img.width);

    const x = (cw - width) / 2;

    // 🔥 CLAVE: MÁS ABAJO PARA “ASOMARSE”
    const y = ch - height - safeBottom + 320;

    ctx.drawImage(img, x, y, width, height);

    canvas.toBlob(blob => {
      const file = new File([blob], "inacap.png", { type: "image/png" });

      if (navigator.share) {
        navigator.share({
          files: [file],
          title: "INACAP"
        });
      }
    });
  };
};
