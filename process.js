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

    let m11 = Number(document.querySelector("#matrix11").value);
    let m12 = Number(document.querySelector("#matrix12").value);
    let m13 = Number(document.querySelector("#matrix13").value);
    let m21 = Number(document.querySelector("#matrix21").value);
    let m22 = Number(document.querySelector("#matrix22").value);
    let m23 = Number(document.querySelector("#matrix23").value);
    let m31 = Number(document.querySelector("#matrix31").value);
    let m32 = Number(document.querySelector("#matrix32").value);
    let m33 = Number(document.querySelector("#matrix33").value);

    /* ##############################
		    ここで画像処理を行う
		############################## */
    // for (let i = 0; i < dest.data.length; i += 4) {
    //   dest.data[i + 0] = (src.data[i + 0] + src.data[i + 1]) / 2; // Red
    //   dest.data[i + 1] = (src.data[i + 0] + src.data[i + 1]) / 2; // Green
    //   dest.data[i + 2] = src.data[i + 2]; // Blue
    //   dest.data[i + 3] = 255; // Alpha
    // }

    for( let y=1; y<height-1; y++ ) {
      for( let x=4; x<width*4-4; x+=4 ) {
        let p = y * width * 4 + x;

        let p0 = Math.abs(
          src.data[p -  width * 4 - 4 + 0] * m11 +
          src.data[p - width * 4 + 0 + 0] * m12 +
          src.data[p - width * 4 + 4 + 0] * m13 +
          src.data[p - 4 + 0] * m21 +
          src.data[p + 0 + 0] * m22 +
          src.data[p + 4 + 0] * m23 +
          src.data[p + width * 4 - 4 + 0] * m31 +
          src.data[p + width * 4 + 0 + 0] * m32 +
          src.data[p + width * 4 + 4 + 0] * m33
        );  // Red
        if( p0 < 0 ) p0 = 0;
        else if( 255 < p0 ) p0 = 255;
        dest.data[p + 0] = p0;

        let p1 = Math.abs(
          src.data[p -  width * 4 - 4 + 1] * m11 +
          src.data[p - width * 4 + 0 + 1] * m12 +
          src.data[p - width * 4 + 4 + 1] * m13 +
          src.data[p - 4 + 1] * m21 +
          src.data[p + 0 + 1] * m22 +
          src.data[p + 4 + 1] * m23 +
          src.data[p + width * 4 - 4 + 1] * m31 +
          src.data[p + width * 4 + 0 + 1] * m32 +
          src.data[p + width * 4 + 4 + 1] * m33
        );  // Green
        if( p1 < 0 ) p1 = 0;
        else if( 255 < p1 ) p1 = 255;
        dest.data[p + 1] = p1

        let p2 = Math.abs(
          src.data[p -  width * 4 - 4 + 2] * m11 +
          src.data[p - width * 4 + 0 + 2] * m12 +
          src.data[p - width * 4 + 4 + 2] * m13 +
          src.data[p - 4 + 2] * m21 +
          src.data[p + 0 + 2] * m22 +
          src.data[p + 4 + 2] * m23 +
          src.data[p + width * 4 - 4 + 2] * m31 +
          src.data[p + width * 4 + 0 + 2] * m32 +
          src.data[p + width * 4 + 4 + 2] * m33
        );  // Blue
        if( p2 < 0 ) p2 = 0;
        else if( 255 < p2 ) p2 = 255;
        dest.data[p + 2] = p2;
        dest.data[p + 3] = 255; // alpha
      }
    }
    // /**
    //  * 入力をそのまま出力する
    //  */
    // let through = () => {
    //     for( let i=0; i< dest.data.length; i++ )
    //         dest.data[i] = src.data[i];
    // }

    // /**
    //  * 画像をぼかす
    //  */
    // let softfocus = () => {
    //   for (let y = 1; y < height - 1; y++) {
    //     for (let x = 4; x < width * 4 - 4; x += 4) {
    //       let p = y * width * 4 + x;
    //       dest.data[p + 0] =
    //         (src.data[p + 0] +
    //           src.data[p - 4 + 0] +
    //           src.data[p + 4 + 0] +
    //           src.data[p - width * 4 + 0] +
    //           src.data[p + width * 4 + 0]) /
    //         5; // red
    //       dest.data[p + 1] =
    //         (src.data[p + 1] +
    //           src.data[p - 4 + 1] +
    //           src.data[p + 4 + 1] +
    //           src.data[p - width * 4 + 1] +
    //           src.data[p + width * 4 + 1]) /
    //         5; // green
    //       dest.data[p + 2] =
    //         (src.data[p + 2] +
    //           src.data[p - 4 + 2] +
    //           src.data[p + 4 + 2] +
    //           src.data[p - width * 4 + 2] +
    //           src.data[p + width * 4 + 2]) /
    //         5; // blue
    //       dest.data[p + 3] = 255; // alpha
    //     }
    //   }
    // };

    // /**
    //  * エッジ抽出（縦方向）
    //  */
    // let edge = () => {
    //   for (let y = 1; y < height - 1; y++) {
    //     for (let x = 4; x < width * 4 - 4; x += 4) {
    //       let p = y * width * 4 + x;
    //       dest.data[p + 0] =
    //         -src.data[p - width * 4 + 0] + src.data[p + width * 4 + 0]; // red
    //       dest.data[p + 1] =
    //         -src.data[p - width * 4 + 1] + src.data[p + width * 4 + 1]; // green
    //       dest.data[p + 2] =
    //         -src.data[p - width * 4 + 2] + src.data[p + width * 4 + 2]; // blue
    //       dest.data[p + 3] = 255; // alpha
    //     }
    //   }
    // };

    // /**
    //  * ラプラシアンフィルタ
    //  */
    // let laplacian = () => {
    //   for (let y = 1; y < height - 1; y++) {
    //     for (let x = 4; x < width * 4 - 4; x += 4) {
    //       let p = y * width * 4 + x;
    //       dest.data[p + 0] =
    //         -4 * src.data[p + 0] +
    //         src.data[p - 4 + 0] +
    //         src.data[p + 4 + 0] +
    //         src.data[p - width * 4 + 0] +
    //         src.data[p + width * 4 + 0]; // red
    //       dest.data[p + 1] =
    //         -4 * src.data[p + 1] +
    //         src.data[p - 4 + 1] +
    //         src.data[p + 4 + 1] +
    //         src.data[p - width * 4 + 1] +
    //         src.data[p + width * 4 + 1]; // green
    //       dest.data[p + 2] =
    //         -4 * src.data[p + 2] +
    //         src.data[p - 4 + 2] +
    //         src.data[p + 4 + 2] +
    //         src.data[p - width * 4 + 2] +
    //         src.data[p + width * 4 + 2]; // blue
    //       dest.data[p + 3] = 255; // alpha
    //     }
    //   }
    // };

    // eval(document.querySelector('#filter').value)()

    // 描画
    displayContext.putImageData(dest, 0, 0);
  };
  render();
}

//document.querySelector("#start").addEventListener("click", renderStart);
