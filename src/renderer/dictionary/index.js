import { getResourcesPath, getUserDataPath } from '../util/appPaths';
import { loadYomichanZip, indexYomichanEntries } from './yomichan';
export { importEpwing } from './epwing';
import {exists, readdir} from "../ipc/fileSystems";
import {extname, join} from "../ipc/path";


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
      const direntPath = await join(dir, dirent);
      const info = await loadAndIndexYomichanZip(direntPath, builtin, reportProgress);
      result.push(info);
    }
  }
  return result;
};

export const loadDictionaries = async (reportProgress) => {
  const result = [];
  // Scan for built-in dictionaries
  const resourcePath = await getResourcesPath();
  const joinedPath = await join(resourcePath, 'dictionaries');
  const zips = await scanDirForYomichanZips(joinedPath, true, reportProgress);
  result.push(...zips, true, reportProgress);
  // Scan for imported dictionaries
  const userDataPath = await getUserDataPath();
  const importedPath = await join(userDataPath, 'dictionaries');

  if (await exists(importedPath)) {
    result.push(...await scanDirForYomichanZips(importedPath, false, reportProgress));
  }
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
