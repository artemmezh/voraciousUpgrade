import {List, Record, Map as IMap, OrderedMap, Set as ISet} from 'immutable';
// import createStorageBackend from './storage';

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

    // if (!process.argv.includes('--nodicts')) {
    this._setLoadingMessage('Loading dictionaries...');

    await this._loadDictionaries(progressMsg => {
      this._setLoadingMessage(progressMsg);
    });
    // }

    this._clearLoadingMessage();
  };

  _loadDictionaries = async (reportProgress) => {
    const dictionaries = await loadDictionaries(reportProgress);

    const items = [];
    for (const info of dictionaries) {
      items.push([info.name, info]);
    }

    this.state.set(this.state.get().set('dictionaries', new IMap(items)));

    this._updateDictionaryOrderByPreference();
  };

  _clearLoadingMessage = (msg) => {
    this.state.set(this.state.get().set('modalLoadingMessage', null));
  };

  _setLoadingMessage = (msg) => {
    this.state.set(this.state.get().set('modalLoadingMessage', msg));
  };

  _addCollection = async (name, locator) => {
    console.log('add collection');
  }

  _storageLoadProfile = async () => {
    console.log("loading profile...")
    // const profileStr = await this.storage.getItemMaybe('profile');
    const profileStr = await window.electron.ipcRenderer.invoke("sqliteGetItemMaybe", ['profile'])

    if (profileStr) {
      const profile = jpar(profileStr);

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
    } else {
      // Key wasn't present, so initialize to default state

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
