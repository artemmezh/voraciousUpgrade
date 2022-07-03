import {createRoot} from 'react-dom/client';
import App from './components/App';
import MainActions from './mainActions';
import {SubscribableState, StateMapper} from './ruxx';
import './index.css';

// Load Kuromoji right away
import { startLoadingKuromoji } from './util/analysis';
startLoadingKuromoji();

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
