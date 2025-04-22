import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS */
import '@ionic/react/css/core.css';

/* Basic CSS */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark Mode: Matches system preference */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme Variables */
import './theme/variables.css';

/* Pages */
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';

setupIonicReact();

const App: React.FC = () => (
  <IonApp className="app-wrapper">
    <IonReactRouter>
      <IonRouterOutlet animated={true}>
        <Route exact path="/it35-lab" component={Login} />
        <Route exact path="/it35-lab/register" component={Register} />
        <Route path="/it35-lab/app" component={Menu} />
        <Route exact path="/" render={() => <Redirect to="/it35-lab" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;