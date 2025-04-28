import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    setShowToast(true);
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 800);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ backgroundColor: '#121212' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '25%',
          gap: '1rem'
        }}>
          <IonAvatar
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#2c2c2e'
            }}
          >
            <IonIcon
              icon={logoIonic}
              style={{ fontSize: '120px', color: '#3880ff' }}
            />
          </IonAvatar>

          <h1 style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '22px',
            marginTop: '15px'
          }}>
            User Login
          </h1>

          <p style={{
            color: '#a1a1aa',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            Please login to your account
          </p>

          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            style={{
              color: '#ffffff', // Text inside input
              '--placeholder-color': '#a1a1aa', // Placeholder color
              '--color': '#ffffff', // Label color
              width: '100%',
              maxWidth: '400px'
            }}
          />

          <IonInput
            label="Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            style={{
              marginTop: '10px',
              color: '#ffffff', // Text inside input
              '--placeholder-color': '#a1a1aa',
              '--color': '#ffffff',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>

          <IonButton
            onClick={doLogin}
            expand="full"
            shape="round"
            style={{
              marginTop: '20px',
              width: '100%',
              maxWidth: '400px',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            LOGIN
          </IonButton>

          <IonButton
            routerLink="/it35-lab/register"
            expand="full"
            fill="clear"
            style={{
              marginTop: '10px',
              color: '#3880ff',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 'normal'
            }}
          >
            Don't have an account? <b>REGISTER</b>
          </IonButton>
        </div>

        {/* AlertBox */}
        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="top"
          color="primary"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
