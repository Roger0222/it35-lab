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

const ForgotPassword: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false); // Toggle between email and password fields

  const handleResetPassword = async () => {
    if (!isResetMode) {
      // Email submission phase
      if (!email) {
        setAlertMessage("Please enter your email address");
        setShowAlert(true);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAlertMessage("Please enter a valid email address");
        setShowAlert(true);
        return;
      }

      setIsLoading(true);
      
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/it35-lab/update-password`,
        });

        if (error) throw error;

        setShowToast(true);
        setAlertMessage("Password reset link sent. Check your email to proceed.");
        setShowAlert(true);
        setEmail('');
      } catch (error: any) {
        setAlertMessage(error.message || "Failed to send reset link.");
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Password update phase
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
            {isResetMode ? 'Set New Password' : 'Reset Password'}
          </h1>

          <p style={{
            color: '#a1a1aa',
            fontSize: '14px',
            margin: '0 0 20px 0',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            {isResetMode 
              ? 'Enter your new password below' 
              : 'Enter your email to receive a reset link'}
          </p>

          {!isResetMode ? (
            <IonInput
              label="Email"
              labelPlacement="floating"
              fill="outline"
              type="email"
              placeholder="Enter your email"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              style={{
                color: '#ffffff',
                '--placeholder-color': '#a1a1aa',
                '--color': '#ffffff',
                width: '100%',
                maxWidth: '400px'
              }}
            />
          ) : (
            <>
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
            </>
          )}

          <IonButton
            onClick={handleResetPassword}
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
            {isLoading 
              ? 'PROCESSING...' 
              : isResetMode ? 'UPDATE PASSWORD' : 'SEND RESET LINK'}
          </IonButton>

          {!isResetMode && (
            <IonButton
              onClick={() => setIsResetMode(true)}
              fill="clear"
              style={{
                color: '#3880ff',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 'normal',
                '--background-activated': 'transparent'
              }}
            >
              Already have a reset code? <b>Set Password</b>
            </IonButton>
          )}

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

        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={isResetMode ? "Password updated!" : "Reset link sent!"}
          duration={2000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;