import path from 'path';
import {app} from 'electron';

const tmp = require('tmp-promise');
const {spawn} = require('child_process');
const fs = require('fs-extra');

const getBinaryFilename = () => {
  const ffmpegDir = path.join(getBinariesPath(), 'ffmpeg');
  let result = path.join(ffmpegDir, 'ffmpeg');
  if (process.platform === 'win32') {
    result += '.exe';
  }
  return result;
};

const getBinariesPath = () => {
  let appPath = app.getAppPath();
  if (appPath.endsWith('.asar')) {
    appPath += '.unpacked';
  }
  return path.join(appPath, 'resources', 'bin', process.platform);
};

export const extractAudio = async (vidfn, startTime, endTime) => {
  const tmpfile = await tmp.file({keep: true, postfix: '.mp3'});
  await new Promise((resolve, reject) => {
    const subp = spawn(
      getBinaryFilename(),
      ['-ss', startTime.toString(), '-i', vidfn, '-t', (endTime - startTime).toString(), '-map', '0:a:0', '-ab', '192k', '-f', 'mp3', '-y', tmpfile.path],
      {windowsHide: true, stdio: ['ignore', 'pipe', 'pipe']}
    );

    subp.on('error', (error) => {
      reject(error);
    });

    subp.stderr.on('data', (data) => {
      console.log(`ffmpeg extract audio stderr: ${data}`);
    });

    subp.on('exit', (code) => {
      if (code) {
        reject(new Error('ffmpeg exit code ' + code));
      }
      resolve();
    });
  });

  const data = await fs.readFile(tmpfile.path, 'base64');

  tmpfile.cleanup();

  return data;
};

export const extractFrameImage = async (vidfn, time) => {
  const tmpfile = await tmp.file({keep: true, postfix: '.jpg'});

  await new Promise((resolve, reject) => {
    const subp = spawn(getBinaryFilename(), ['-ss', time.toString(), '-i', vidfn, '-vf', "scale='min(480,iw)':'min(240,ih)':force_original_aspect_ratio=decrease", '-frames:v', '1', "-q:v", "6", '-y', tmpfile.path], {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    subp.on('error', (error) => {
      reject(error);
    });

    subp.stderr.on('data', (data) => {
      console.log(`ffmpeg extract image stderr: ${data}`);
    });

    subp.on('exit', (code) => {
      if (code) {
        reject(new Error('ffmpeg exit code ' + code));
      }
      resolve();
    });
  });

  const data = await fs.readFile(tmpfile.path);

  tmpfile.cleanup();

  return data;
};

