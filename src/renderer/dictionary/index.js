// import path from 'path';

import { getResourcesPath, getUserDataPath } from '../util/appPaths';
import { loadYomichanZip, indexYomichanEntries } from './yomichan';
export { importEpwing } from './epwing';
import {exists, readdir, extname, join} from "../ipc/FileSystems";
import {read} from "fs";
//const fs = window.require('fs-extra'); // use window to avoid webpack

const loadAndIndexYomichanZip = async (zipfn, builtin, reportProgress) => {
  const {name, termEntries} = await loadYomichanZip(zipfn, reportProgress);

  if (reportProgress) {
    reportProgress('Indexing ' + name + '...');
  }
  return {
    name,
    index: indexYomichanEntries(termEntries),
    builtin,
    filename: zipfn,
  };
};

const scanDirForYomichanZips = async (dir, builtin, reportProgress) => {
  const result = [];
  const dirents = await readdir(dir);
  for (const dirent of dirents) {
    if (await extname(dirent) === '.zip') {
      // Assume any zips are Yomichan dicts
      const info = await loadAndIndexYomichanZip(join(dir, dirent), builtin, reportProgress);
      result.push(info);
    }
  }
  return result;
};

export const loadDictionaries = async (reportProgress) => {
  const result = [];
  console.log("doing staff for yomichan")
  // Scan for built-in dictionaries
  const resourcePath = await getResourcesPath();
  console.log("resourcePath")
  console.log(resourcePath)
  const joinedPath = await join(resourcePath);
  console.log("joinedPath");
  console.log(joinedPath);
  result.push(...await scanDirForYomichanZips(joinedPath, 'dictionaries'), true, reportProgress);

  // Scan for imported dictionaries
  console.log("start scan dictionaries")
  const importedPath = await join(getUserDataPath(), 'dictionaries');
  console.log(importedPath)
  if (await exists(importedPath)) {
    console.log("in exitst if")
    result.push(...await scanDirForYomichanZips(join(getUserDataPath(), 'dictionaries'), false, reportProgress));
  }
  console.log("result->>>")
  console.log(result)
  return result;
};

export const searchIndex = (index, word) => {
  const result = [];
  const sequences = index.wordOrReadingToSequences.get(word);
  if (sequences) {
    for (const seq of sequences) {
      const entry = index.sequenceToEntry.get(seq);
      result.push(Array.from(entry.glosses).join('\n'));
    }
  }

  return result;
};
