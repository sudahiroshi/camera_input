getVideoSources(function (cam) {
  let video = document.querySelector("#video");
  //let control = document.querySelector("#control");
  //console.log("cam", cam);
  // let l = document.createElement('label');
  // let br = document.createElement('br');
  let b = document.createElement("input");
  b.type = "button";
  b.value = cam.name;
  b.addEventListener("click", () => main(cam.id, video));
  control.appendChild(b);
  // l.innerText = "カメラを選択してください："
  // l.appendChild(b);
  // l.appendChild(br);
});

document.querySelector("#reset").addEventListener('click', () => {
  document.querySelector("#matrix11").value = 0;
  document.querySelector("#matrix12").value = 0;
  document.querySelector("#matrix13").value = 0;
  document.querySelector("#matrix21").value = 0;
  document.querySelector("#matrix22").value = 1;
  document.querySelector("#matrix23").value = 0;
  document.querySelector("#matrix31").value = 0;
  document.querySelector("#matrix32").value = 0;
  document.querySelector("#matrix33").value = 0;
})
/**
 * カメラ入力を開始する
 *
 * @param {カメラID} cam_id
 * @param {映像入力するcanvas要素} video
 */
function main(cam_id, video) {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        optional: [{ sourceId: cam_id }],
      },
    })
    .then((stream) => {
      // success
      console.log("Start Video", stream);
      localStream = stream;
      video.srcObject = stream;
      video.onloadedmetadata = function (e) {
        video.play();
        video.volume = 0;
      };
      renderStart();

    })
    .catch((e) => {
      // error
      console.error("Error on start video: " + e.code);
    });
}
