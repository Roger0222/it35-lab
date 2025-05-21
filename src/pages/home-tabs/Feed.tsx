import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText
} from '@ionic/react';
import FeedContainer from '../../components/FeedContainer';

const Feed: React.FC = () => {
  return (
    <IonPage>
      {/* Header */}
      <IonHeader style={{ backgroundColor: '#232323' }}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton color="light">
            </IonMenuButton>
          </IonButtons>
          <IonTitle style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: '700' }}>
            Feed
          </IonTitle>
        </IonToolbar>
      </IonHeader>
          <FeedContainer />

    </IonPage>
  );
};

export default Feed;
