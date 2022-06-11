import {protocol} from "electron";
import log from "electron-log";

export default function registerFileProtocol() {
  protocol.registerFileProtocol("local-video", (req, callback) => {
    const url = req.url.replace("local-video://", "");
    const decodedUrl = decodeURI(url); // in case URL contains spaces
    try {
      return callback(decodedUrl);
    } catch (err) {
      log.error('Invalid video file selected:', err);
      return callback(404);
    }
  });
}
