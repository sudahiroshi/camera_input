function renderStart() {
  let video = document.querySelector("#video");
  let buffer = document.createElement("canvas");
  let display = document.querySelector("#display_canvas");
  let bufferContext = buffer.getContext("2d");
  let displayContext = display.getContext("2d");

  let render = function () {
    requestAnimationFrame(render);
    let width = video.videoWidth;
    let height = video.videoHeight;
    if (width == 0 || height == 0) {
      return;
    }
    buffer.width = display.width = width;
    buffer.height = display.height = height;
    bufferContext.drawImage(video, 0, 0);

    let src = bufferContext.getImageData(0, 0, width, height); // カメラ画像のデータ
    let dest = bufferContext.createImageData(buffer.width, buffer.height); // 空のデータ(サイズはカメラ画像と一緒)

    /* ##############################
		    ここで画像処理を行う
		############################## */
    for (let i = 0; i < dest.data.length; i += 4) {
      dest.data[i + 0] = (src.data[i + 0] + src.data[i + 1]) / 2; // Red
      dest.data[i + 1] = (src.data[i + 0] + src.data[i + 1]) / 2; // Green
      dest.data[i + 2] = src.data[i + 2]; // Blue
      dest.data[i + 3] = 255; // Alpha
    }

    displayContext.putImageData(dest, 0, 0);
  };
  render();
}

document.querySelector('#start').addEventListener('click', renderStart );