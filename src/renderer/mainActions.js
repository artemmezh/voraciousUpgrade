import {List, Record, Map as IMap, OrderedMap, Set as ISet} from 'immutable';
import { loadDictionaries, searchIndex } from './dictionary';
// import createStorageBackend from './storage';
import {getCollectionIndex} from "./library";

const jstr = JSON.stringify; // alias
const jpar = JSON.parse; // alias

const AnkiPreferencesRecord = new Record({
  modelName: undefined,
  deckName: undefined,
  fieldMap: new OrderedMap(), // Anki field to our field that fills it
});

const PreferencesRecord = new Record({
  showRuby: true,
  showHelp: true,
  subtitleMode: 'manual',
  subtitleOrder: new List(['jpn', 'eng']), // list of iso639-3 codes
  subtitleIgnores: new List([]), // list of iso639-3 codes
  disabledDictionaries: new ISet(),
  dictionaryOrder: new List(),
  anki: new AnkiPreferencesRecord(),
});

const MainStateRecord = new Record({
  modalLoadingMessage: null,
  collections: new IMap(), // locator -> CollectionRecord
  dictionaries: new IMap(), // name -> object that we don't mutate (TODO: make it a Record)
  wordList: new IMap(), // word -> SavedWordRecord
  preferences: new PreferencesRecord(),
});

const CollectionRecord = new Record({
  locator: undefined,
  name: undefined,
  titles: new List(), // of TitleRecords
  videos: new IMap() // id -> VideoRecord,
});

const TitleRecord = new Record({
  name: undefined,
  series: undefined,
  videoId: undefined, // only defined if not a series
  parts: undefined, // only defined if a series
  playbackPosition: undefined,
});

const VideoRecord = new Record({
  id: undefined,
  name: undefined,
  videoURL: undefined,
  subtitleTracks: new IMap(), // id -> SubtitleTrackRecord
  playbackPosition: null,
  loadingSubs: false,
});

const SubtitleTrackRecord = new Record({
  id: undefined,
  language: undefined,
  chunkSet: undefined,
});

const SavedWordRecord = new Record({
  learnState: 0,
});

export default class MainActions {
  constructor(subscribableState) {
    this.state = subscribableState;
    console.log('in main action constructor')
    this.initializeState().then(() => {
      console.log('MainActions state initialized');
    });
  }

  initializeState = async () => {
    this.state.set(new MainStateRecord());

    this._setLoadingMessage('Loading profile...');

    // this.storage = await window.electron.ipcRenderer.invoke("sqlite", '')

    await this._storageLoadProfile();

    // if (!window.electron.remote.commandLine.hasSwitch('--nodicts')) {
    //   this._setLoadingMessage('Loading dictionaries...');
    //
    //   await this._loadDictionaries(progressMsg => {
    //     this._setLoadingMessage(progressMsg);
    //   });
    // }

    this._clearLoadingMessage();
  };

  _loadDictionaries = async (reportProgress) => {
    console.log("_loadDictionaries...")
    const dictionaries = await loadDictionaries(reportProgress);
    console.log(dictionaries)
    const items = [];
    for (const info of dictionaries) {
      items.push([info.name, info]);
    }

    this.state.set(this.state.get().set('dictionaries', new IMap(items)));

    this._updateDictionaryOrderByPreference();
  };

  _updateDictionaryOrderByPreference = () => {
    console.log("_updateDictionaryOrderByPreference...")
    const state = this.state.get();

    const items = [];
    for (const name of state.preferences.dictionaryOrder) {
      if (state.dictionaries.has(name)) {
        items.push([name, state.dictionaries.get(name)]);
      }
    }

    for (const [name, info] of state.dictionaries.entries()) {
      if (!state.preferences.dictionaryOrder.has(name)) {
        items.push([name, info]);
      }
    }

    this.state.set(state.set('dictionaries', new IMap(items)));
  };

  _clearLoadingMessage = (msg) => {
    console.log("clear loading message...")
    this.state.set(this.state.get().set('modalLoadingMessage', null));
  };

  _setLoadingMessage = (msg) => {
    this.state.set(this.state.get().set('modalLoadingMessage', msg));
  };

  _addCollection = async (name, locator) => {
    console.log("adding collection...")
    const collectionIndex = await getCollectionIndex(locator);

    const collectionVideoRecords = []; // [k, v] pairs
    for (const vid of collectionIndex.videos) {
      const subTrackKVs = []; // [k, v] pairs
      for (const stid of vid.subtitleTrackIds) {
        subTrackKVs.push([stid, new SubtitleTrackRecord({id: stid})]);
      }


      collectionVideoRecords.push([vid.id, new VideoRecord({
        id: vid.id,
        name: vid.name,
        videoURL: vid.url,
        subtitleTracks: new IMap(subTrackKVs),
        // remaining fields are OK to leave as default
      })]);
    }

    const collectionTitleRecords = [];
    for (const title of collectionIndex.titles) {
      collectionTitleRecords.push(new TitleRecord({
        name: title.name,
        series: title.series,
        videoId: title.videoId, // only defined if not a series
        parts: title.parts, // only defined if a series
      }));
    }

    this.state.set(this.state.get().setIn(['collections', locator], new CollectionRecord({
      locator,
      name,
      videos: new IMap(collectionVideoRecords),
      titles: new List(collectionTitleRecords),
    })));
  }

  _storageLoadProfile = async () => {
    console.log("loading profile...")
    // const profileStr = await this.storage.getItemMaybe('profile');
    const profileStr = await window.electron.ipcRenderer.invoke("sqliteGetItemMaybe", ['profile'])
    console.log("profileStr")
    console.log(profileStr)

    if (profileStr) {
      console.log("inside profileStr")
      const profile = jpar(profileStr);
      console.log(profile.collections)
      for (const col of profile.collections) {
        await this._addCollection(col.name, col.locator);
      }

      this.state.set(this.state.get().setIn(['preferences', 'showRuby'], profile.preferences.showRuby));
      this.state.set(this.state.get().setIn(['preferences', 'showHelp'], profile.preferences.showHelp));
      this.state.set(this.state.get().setIn(['preferences', 'subtitleMode'], profile.preferences.subtitleMode));
      this.state.set(this.state.get().setIn(['preferences', 'subtitleOrder'], new List(profile.preferences.subtitleOrder)));
      this.state.set(this.state.get().setIn(['preferences', 'subtitleIgnores'], new List(profile.preferences.subtitleIgnores)));
      this.state.set(this.state.get().setIn(['preferences', 'disabledDictionaries'], new ISet(profile.preferences.disabledDictionaries)));
      this.state.set(this.state.get().setIn(['preferences', 'dictionaryOrder'], new List(profile.preferences.dictionaryOrder)));

      if (!profile.preferences.anki) {
        profile.preferences.anki = {};
      }
      const ankiPrefRecord = new AnkiPreferencesRecord({
        deckName: profile.preferences.anki.deckName,
        modelName: profile.preferences.anki.modelName,
        fieldMap: new OrderedMap(profile.preferences.anki.fieldMap),
      });
      this.state.set(this.state.get().setIn(['preferences', 'anki'], ankiPrefRecord));
      console.log('state->>>>>')
      console.log(this.state)
    } else {
      // Key wasn't present, so initialize to default state
      console.log("profile not loaded...")
      // TODO: update state with default profile info, if any

      // Save our empty/default profile
      this._storageSaveProfile();
    }
  };

  _storageSaveProfile = async () => {
    console.log("saving profile...")
    const state = this.state.get();

    const profileObj = {
      collections: [],
      preferences: {
        showRuby: state.preferences.showRuby,
        showHelp: state.preferences.showHelp,
        subtitleMode: state.preferences.subtitleMode,
        subtitleOrder: state.preferences.subtitleOrder.toArray(),
        subtitleIgnores: state.preferences.subtitleIgnores.toArray(),
        disabledDictionaries: state.preferences.disabledDictionaries.toArray(),
        dictionaryOrder: state.preferences.dictionaryOrder.toArray(),
        anki: state.preferences.anki.toJS(),
      },
    };

    for (const collection of state.collections.values()) {
      profileObj.collections.push({
        locator: collection.locator,
        name: collection.name,
      });
    }

    await window.electron.ipcRenderer.invoke("sqliteSetItem", ['profile', jstr(profileObj)]);
  };

  _storageLoadSavedWordList = async () => {
    console.log('storage load saved word list');
  };

  loadVideoPlaybackPosition = async (collectionLocator, videoId) => {

  };

  _storageSavePlaybackPosition = async (collectionLocator, videoId, position) => {

  };
};
