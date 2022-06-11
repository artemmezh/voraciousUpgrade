import {protocol} from "electron";

export default function registerFileProtocol() {
  protocol.registerFileProtocol('local', (request, callback) => {
    const path = request.url.substr(8); // strip off local:// prefix
    const decodedPath = decodeURI(path); // this makes utf-8 filenames work, I'm not sure it's correct
    callback(decodedPath);
  }, (error) => {
    if (error) console.error('Failed to register protocol');
  })
}
