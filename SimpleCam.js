getVideoSources(function (cam) {
  let video = document.querySelector("#video");
  let control = document.querySelector("#control");
  //console.log("cam", cam);
  let b = document.createElement("input");
  b.type = "button";
  b.value = cam.name;
  b.addEventListener("click", () => main(cam.id, video));
  control.appendChild(b);
});

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
    })
    .catch((e) => {
      // error
      console.error("Error on start video: " + e.code);
    });
}
