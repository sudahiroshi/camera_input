/**
 * フィルタ処理を開始する
 */
function renderStart() {
  let video = document.querySelector("#video");
  let buffer = document.createElement("canvas");
  let display = document.querySelector("#display_canvas");
  let bufferContext = buffer.getContext("2d");
  let displayContext = display.getContext("2d");

  /**
   * リアルタイムで入力画像からデータを読み取り加工して出力する
   *
   * @returns null
   */
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
    // for (let i = 0; i < dest.data.length; i += 4) {
    //   dest.data[i + 0] = (src.data[i + 0] + src.data[i + 1]) / 2; // Red
    //   dest.data[i + 1] = (src.data[i + 0] + src.data[i + 1]) / 2; // Green
    //   dest.data[i + 2] = src.data[i + 2]; // Blue
    //   dest.data[i + 3] = 255; // Alpha
    // }

    /**
     * 入力をそのまま出力する
     */
    let through = () => {
        for( let i=0; i< dest.data.length; i++ )
            dest.data[i] = src.data[i];
    }

    /**
     * 画像をぼかす
     */
    let softfocus = () => {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 4; x < width * 4 - 4; x += 4) {
          let p = y * width * 4 + x;
          dest.data[p + 0] =
            (src.data[p + 0] +
              src.data[p - 4 + 0] +
              src.data[p + 4 + 0] +
              src.data[p - width * 4 + 0] +
              src.data[p + width * 4 + 0]) /
            5; // red
          dest.data[p + 1] =
            (src.data[p + 1] +
              src.data[p - 4 + 1] +
              src.data[p + 4 + 1] +
              src.data[p - width * 4 + 1] +
              src.data[p + width * 4 + 1]) /
            5; // green
          dest.data[p + 2] =
            (src.data[p + 2] +
              src.data[p - 4 + 2] +
              src.data[p + 4 + 2] +
              src.data[p - width * 4 + 2] +
              src.data[p + width * 4 + 2]) /
            5; // blue
          dest.data[p + 3] = 255; // alpha
        }
      }
    };

    /**
     * エッジ抽出（縦方向）
     */
    let edge = () => {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 4; x < width * 4 - 4; x += 4) {
          let p = y * width * 4 + x;
          dest.data[p + 0] =
            -src.data[p - width * 4 + 0] + src.data[p + width * 4 + 0]; // red
          dest.data[p + 1] =
            -src.data[p - width * 4 + 1] + src.data[p + width * 4 + 1]; // green
          dest.data[p + 2] =
            -src.data[p - width * 4 + 2] + src.data[p + width * 4 + 2]; // blue
          dest.data[p + 3] = 255; // alpha
        }
      }
    };

    /**
     * ラプラシアンフィルタ
     */
    let laplacian = () => {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 4; x < width * 4 - 4; x += 4) {
          let p = y * width * 4 + x;
          dest.data[p + 0] =
            -4 * src.data[p + 0] +
            src.data[p - 4 + 0] +
            src.data[p + 4 + 0] +
            src.data[p - width * 4 + 0] +
            src.data[p + width * 4 + 0]; // red
          dest.data[p + 1] =
            -4 * src.data[p + 1] +
            src.data[p - 4 + 1] +
            src.data[p + 4 + 1] +
            src.data[p - width * 4 + 1] +
            src.data[p + width * 4 + 1]; // green
          dest.data[p + 2] =
            -4 * src.data[p + 2] +
            src.data[p - 4 + 2] +
            src.data[p + 4 + 2] +
            src.data[p - width * 4 + 2] +
            src.data[p + width * 4 + 2]; // blue
          dest.data[p + 3] = 255; // alpha
        }
      }
    };

    // ちょっとダサいけど，コメントアウトする行を変更してやりたい処理を選択する
    //through();
    softfocus();
    //edge();
    //laplacian();

    // 描画
    displayContext.putImageData(dest, 0, 0);
  };
  render();
}

document.querySelector("#start").addEventListener("click", renderStart);
