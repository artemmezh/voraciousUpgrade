import {createRoot} from 'react-dom/client';
import App from './components/App';
import MainActions from './mainActions';
import {SubscribableState, StateMapper} from './ruxx';

const subscribableMainState = new SubscribableState();
const actions = new MainActions(subscribableMainState);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <StateMapper subscribableState={subscribableMainState}
               renderState={
                 state =>
                   <App mainState={state}
                        actions={actions}
                   />
               }
  />
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
