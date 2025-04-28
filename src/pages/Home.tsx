import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router';
import Favorites from './home-tabs/Favorites';
import Feed from './home-tabs/Feed';
import Search from './home-tabs/Search';
import { heart } from 'ionicons/icons'; // Keep heart icon fallback for Favorites

const Home: React.FC = () => {
  const tabs = [
    {
      name: 'Feed',
      tab: 'feed',
      url: '/it35-lab/app/home/feed',
      icon: 'https://cdn-icons-png.flaticon.com/512/1081/1081934.png', // PNG for Feed tab
      alt: 'Feed Icon'
    },
    {
      name: 'Search',
      tab: 'search',
      url: '/it35-lab/app/home/search',
      icon: 'https://imgs.search.brave.com/JAaUO1v-lZoFPR_PyOULqSsyc_gpbeNXGwInWKWHhDw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjQv/NjI0LzU1NS9zbWFs/bC8zZC1yZW5kZXJp/bmctbWFnbmlmeWlu/Zy1nbGFzcy1vci1z/ZWFyY2gtaWNvbi0z/ZC1yZW5kZXItYS1k/ZXZpY2UtZm9yLWEt/dGhvcm91Z2gtaW5z/cGVjdGlvbi1vci1z/ZWFyY2gtaWNvbi1w/bmcucG5n', // PNG for Search tab
      alt: 'Search Icon'
    },
    {
      name: 'Favorites',
      tab: 'favorites',
      url: '/it35-lab/app/home/favorites',
      icon: 'https://imgs.search.brave.com/v6MLp0lQPw-5AnHzkm0_zCMLC11BqpkbjTdt8LGI8Dk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDkv/MzczLzgzNC9zbWFs/bC9mYXZvcml0ZS1i/b29rbWFyay0zZC1p/Y29uLXBuZy5wbmc', // PNG for Favorites tab
      alt: 'Favorites Icon'
    }
  ];

  return (
    <IonReactRouter>
      <IonTabs>
        {/* Router Outlet */}
        <IonRouterOutlet>
          <Route exact path="/it35-lab/app/home/feed" render={Feed} />
          <Route exact path="/it35-lab/app/home/search" render={Search} />
          <Route exact path="/it35-lab/app/home/favorites" render={Favorites} />
          <Route exact path="/it35-lab/app/home">
            <Redirect to="/it35-lab/app/home/feed" />
          </Route>
        </IonRouterOutlet>

        {/* Stylish Tab Bar */}
        <IonTabBar
          slot="bottom"
          style={{
            backgroundColor: '#1e1e1e',
            borderTop: '1px solid #444',
            boxShadow: '0 -1px 5px rgba(0,0,0,0.3)',
            paddingBottom: '6px',
            paddingTop: '4px'
          }}
        >
          {tabs.map((item, index) => (
            <IonTabButton
              key={index}
              tab={item.tab}
              href={item.url}
              style={{
                '--color': '#ffffff',
                '--color-selected': '#3880ff',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {/* Custom PNG Icon */}
              <img
                src={item.icon}
                alt={item.alt}
                style={{
                  width: '24px', 
                  height: '24px', 
                  objectFit: 'contain', 
                  marginBottom: '5px'
                }}
              />
              <IonLabel style={{ fontSize: '13px', fontWeight: '500', marginTop: '4px' }}>
                {item.name}
              </IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Home;
