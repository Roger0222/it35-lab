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

      {/* Content */}
      <IonContent fullscreen style={{ background: 'linear-gradient(180deg, #121212 0%, #1f1f1f 100%)' }}>
        
        {/* Feed Title */}
        <div 
          style={{
            textAlign: 'center',
            marginTop: '40px',
            marginBottom: '20px',
            color: '#FFFFFF',
            fontSize: '32px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Welcome to Your Feed
        </div>

        {/* Example Feed Items */}
        <div style={{ margin: '20px', padding: '10px', borderRadius: '10px', backgroundColor: '#2a2a2a', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
          <IonText style={{ fontSize: '18px', fontWeight: '500', color: '#ddd' }}>
            Feed Item 1 - This is a sample feed item to demonstrate the layout. The content here can include posts, images, or other media.
          </IonText>
        </div>

        <div style={{ margin: '20px', padding: '10px', borderRadius: '10px', backgroundColor: '#2a2a2a', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
          <IonText style={{ fontSize: '18px', fontWeight: '500', color: '#ddd' }}>
            Feed Item 2 - Here's another sample post. Each item is clearly separated, making it easy to read through and engage.
          </IonText>
        </div>

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
        
      </IonContent>
    </IonPage>
  );
};

export default Feed;
