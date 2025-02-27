import { 
    IonButtons,
      IonContent, 
      IonHeader, 
      IonMenuButton, 
      IonPage, 
      IonTitle, 
      IonToolbar,
      IonItem,
      IonLabel,
      IonList 
  } from '@ionic/react';
  
  const Favorites: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Favorites</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <IonList>
      <IonItem>
        <IonLabel>Climate Change</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Cybercrimes</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Philippine politics</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>New Social Media Trends</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Effects of Overpopulation</IonLabel>
      </IonItem>
    </IonList>
        </IonContent>
      </IonPage>
      
    );
  };
  
  export default Favorites;