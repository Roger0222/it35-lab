import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const ChangePass: React.FC = () => {
  const navigation = useIonRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      setAlertMessage("Please fill in all password fields");
      setShowAlert(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertMessage("Passwords do not match");
      setShowAlert(true);
      return;
    }

    if (newPassword.length < 6) {
      setAlertMessage("Password must be at least 6 characters");
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setShowToast(true);
      setAlertMessage("Password updated successfully!");
      setShowAlert(true);
      navigation.push('/it35-lab', 'forward', 'replace');
    } catch (error: any) {
      setAlertMessage(error.message || "Password update failed");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ backgroundColor: '#121212' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '1rem',
          padding: '1rem'
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
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '22px',
            margin: '15px 0 0 0'
          }}>
            Set New Password
          </h1>

          <p style={{
            color: '#a1a1aa',
            fontSize: '14px',
            margin: '0 0 20px 0',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            Enter your new password below
          </p>

          <IonInput
            label="New Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onIonChange={e => setNewPassword(e.detail.value!)}
            style={{
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa',
              width: '100%',
              maxWidth: '400px'
            }}
          />

          <IonInput
            label="Confirm Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onIonChange={e => setConfirmPassword(e.detail.value!)}
            style={{
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa',
              width: '100%',
              maxWidth: '400px'
            }}
          />

          <IonButton
            onClick={handlePasswordUpdate}
            expand="full"
            shape="round"
            disabled={isLoading}
            style={{
              marginTop: '20px',
              width: '100%',
              maxWidth: '400px',
              fontWeight: 'bold',
              '--background': '#3880ff',
              '--background-activated': '#4d8eff',
              '--background-focused': '#4d8eff',
              '--background-hover': '#4d8eff'
            }}
          >
            {isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </IonButton>

          <IonButton
            routerLink="/it35-lab"
            fill="clear"
            style={{
              color: '#3880ff',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 'normal',
              '--background-activated': 'transparent'
            }}
          >
            Back to <b>LOGIN</b>
          </IonButton>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Notification"
          message={alertMessage}
          buttons={['OK']}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Password updated!"
          duration={2000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default ChangePass;