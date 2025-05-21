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
            <IonMenuButton color="light"></IonMenuButton>
          </IonButtons>
          <IonTitle style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: '700' }}>
            Feed
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
        {/* Styled Feed Container */}
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          borderRadius: '10px', 
          backgroundColor: '#333', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)' 
        }}>
          <FeedContainer />
        </div>
    </IonPage>
  );
};

export default Feed;
