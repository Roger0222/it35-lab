import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonToast,
  useIonRouter,
  IonText,
  IonProgressBar
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const ChangePass: React.FC = () => {
  const navigation = useIonRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    value: 0,
    label: '',
    color: ''
  });

  useEffect(() => {
    if (newPassword) {
      const strength = calculatePasswordStrength(newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        value: 0,
        label: '',
        color: ''
      });
    }
  }, [newPassword]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special chars
    
    // Determine strength level
    if (strength <= 2) {
      return { value: 0.25, label: 'Very Weak', color: 'danger' };
    } else if (strength <= 4) {
      return { value: 0.5, label: 'Weak', color: 'warning' };
    } else if (strength <= 6) {
      return { value: 0.75, label: 'Strong', color: 'success' };
    } else {
      return { value: 1, label: 'Very Strong', color: 'primary' };
    }
  };

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

          {newPassword && (
            <div style={{ 
              width: '100%', 
              maxWidth: '400px',
              marginTop: '-10px'
            }}>
              <IonProgressBar 
                value={passwordStrength.value} 
                color={passwordStrength.color}
                style={{ height: '4px' }}
              />
              <IonText 
                color={passwordStrength.color}
                style={{ 
                  fontSize: '12px',
                  display: 'block',
                  textAlign: 'right',
                  marginTop: '4px'
                }}
              >
                {passwordStrength.label}
              </IonText>
            </div>
          )}

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
              maxWidth: '400px',
              marginTop: '10px'
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

          <div style={{ 
            width: '100%', 
            maxWidth: '400px',
            marginTop: '-10px',
            color: '#a1a1aa',
            fontSize: '12px'
          }}>
            <p>Password should contain:</p>
            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
              <li style={{ color: newPassword.length >= 8 ? '#3880ff' : '#a1a1aa' }}>
                At least 8 characters
              </li>
              <li style={{ color: /[A-Z]/.test(newPassword) ? '#3880ff' : '#a1a1aa' }}>
                One uppercase letter
              </li>
              <li style={{ color: /[0-9]/.test(newPassword) ? '#3880ff' : '#a1a1aa' }}>
                One number
              </li>
              <li style={{ color: /[^A-Za-z0-9]/.test(newPassword) ? '#3880ff' : '#a1a1aa' }}>
                One special character
              </li>
            </ul>
          </div>

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