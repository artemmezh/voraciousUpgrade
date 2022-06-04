import {MemoryRouter as Router, Switch, Route, NavLink, Link, Redirect} from 'react-router-dom';

import icon from '../../assets/icon.svg';
import './App.css';
import WidthWrapper from "./components/WidthWrapper";
import AddCollection from "./components/AddCollection";

import {Greetings} from './components/Greetings'
import VideoListItem from "./components/VideoListItem";
import Settings from "./components/Settings";

const Hello = () => {
  return (

    <div>
      {/*<GlobalStyle />*/}
      <Greetings/>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon}/>
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};


export default function App(subscribableMainState, actions) {
  console.log("subscribableMainState-> ");
  console.log(subscribableMainState);
  console.log("actions-> ");
  console.log(actions);
  const mainState = subscribableMainState;
  // const { mainState, actions } = this.props;
  if (mainState.modalLoadingMessage) {
    return <WidthWrapper><h1 className="header-font">{mainState.modalLoadingMessage}</h1></WidthWrapper>;
  } else {
    return (
      <Router>
        <Switch>
          <Route path="/asad" children={<Hello/>}/>
          <Route path="/add_collection" render={({history}) => {
            return <AddCollection onAdd={(name, dir) => {
              actions.addLocalCollection(name, dir);
              history.replace('/library');
            }} onExit={() => {
              history.goBack();
            }}/>;
          }}/>
          <Route render={({history}) => (
            <WidthWrapper>
              <nav className="App-main-nav header-font">
                <NavLink to={'/library'} activeClassName="selected">Library</NavLink>
                <NavLink to={'/settings'} activeClassName="selected">Settings</NavLink>
              </nav>
              <div className="App-below-main-nav">
                <Switch>
                  <Route path="/library/:cloc/:tname" render={({match}) => {
                    const collectionLocator = decodeURIComponent(match.params.cloc);
                    const titleName = decodeURIComponent(match.params.tname);
                    const collection = mainState.collections.get(collectionLocator);
                    const title = collection.titles.find(t => t.name === titleName); // unindexed, but should be quick
                    return (
                      <div>
                        <div className="App-collection-header">
                          <h2 className="App-collection-header-title"><a href="/library" onClick={e => {
                            e.preventDefault();
                            history.goBack();
                          }} className="App-back-to-library-link">{collection.name}</a> / {title.name}</h2>
                        </div>
                        {title.parts.seasonEpisodes.length ? (
                          <ul>
                            {title.parts.seasonEpisodes.map(se => (
                              <VideoListItem collection={collection} videoId={se.videoId}
                                             name={'Season ' + se.seasonNumber + ' Episode ' + se.episodeNumber}
                                             playbackPosition={se.playbackPosition} key={se.videoId}/>
                            ))}
                          </ul>
                        ) : null}
                        {title.parts.episodes.length ? (
                          <ul>
                            {title.parts.episodes.map(ep => (
                              <VideoListItem collection={collection} videoId={ep.videoId}
                                             name={'Episode ' + ep.episodeNumber}
                                             playbackPosition={ep.playbackPosition} key={ep.videoId}/>
                            ))}
                          </ul>
                        ) : null}
                        {title.parts.others.length ? (
                          <ul>
                            {title.parts.others.map(other => (
                              <VideoListItem collection={collection} videoId={other.videoId}
                                             name={other.name} playbackPosition={other.playbackPosition}
                                             key={other.name}/>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  }}/>
                  <Route path="/library" render={() => (mainState.collections.size > 0) ? (
                    <ul>
                      {mainState.collections.valueSeq().sort((a, b) => a.name.localeCompare(b.name)).map((collection) => (
                        <li className="App-collection" key={collection.locator}>
                          <div className="App-collection-header">
                            <h2 className="App-collection-header-title">{collection.name} <span
                              className="App-collection-header-buttons">
                                <button onClick={e => {
                                  e.preventDefault();
                                  if (window.confirm('Are you sure you want to delete the collection "' + collection.name + '"?')) {
                                    actions.removeCollection(collection.locator);
                                  }
                                }}>Delete</button>
                              {' '}
                              </span></h2>
                            <div className="App-collection-id">{collection.locator}</div>
                          </div>
                          <ul>
                            {collection.titles.map(title => title.series ? (
                                <li key={title.name} className="App-library-list-item">
                                  <Link
                                    to={'/library/' + encodeURIComponent(collection.locator) + '/' + encodeURIComponent(title.name)}>
                                    {title.name} <span
                                    style={{color: 'grey'}}>[{title.parts.count}]</span>
                                  </Link>
                                </li>
                              ) : (
                                <VideoListItem collection={collection} videoId={title.videoId}
                                               name={title.name} playbackPosition={title.playbackPosition}
                                               key={title.name}/>
                              )
                            )}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="App-no-collections-message">
                      To get started, <Link to="/add_collection">Add A Collection</Link> to your library.
                    </div>
                  )}/>
                  <Route path="/settings" render={({history}) => (
                    <Settings mainState={mainState} actions={actions} history={history}/>
                  )}/>
                  <Redirect to="/library"/>
                </Switch>
              </div>
            </WidthWrapper>
          )}/>
        </Switch>
      </Router>
    );
  }
}
