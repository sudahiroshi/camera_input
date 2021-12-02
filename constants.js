function getVideoSources(callback) {
  if (!navigator.mediaDevices) {
    console.log("MediaStreamTrack");
    MediaStreamTrack.getSources(function (cams) {
      cams.forEach(function (c, i, a) {
        if (c.kind != "video") return;
        callback({
          name: c.facing,
          id: c.id,
        });
      });
    });
  } else {
    navigator.mediaDevices.enumerateDevices().then(function (cams) {
      cams.forEach(function (c, i, a) {
        console.log("mediaDevices", c);
        if (c.kind != "videoinput") return;
        callback({
          name: c.label,
          id: c.deviceId,
        });
      });
    });
  }
}
