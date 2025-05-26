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
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');

  // Extract email and token from URL parameters
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const emailParam = urlParams.get('email');
    const tokenParam = urlParams.get('token');

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    if (tokenParam) {
      setToken(tokenParam);
    }

    // Verify token validity (you might need to implement this with your backend)
    verifyToken(emailParam, tokenParam);
  }, []);

  const verifyToken = async (email: string | null, token: string | null) => {
    if (!email || !token) {
      setAlertMessage("Invalid password reset link");
      setShowAlert(true);
      return;
    }

    // Here you would typically verify the token with your backend
    // For Supabase, you might use their password recovery flow instead
    setIsLoading(true);
    try {
      // Example verification (replace with your actual implementation)
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery'
      });

      if (error) throw error;
    } catch (error: any) {
      setAlertMessage("Invalid or expired reset link. Please request a new one.");
      setShowAlert(true);
      navigation.push('/login', 'root', 'replace');
    } finally {
      setIsLoading(false);
    }
  };

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
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength <= 2) return { value: 0.25, label: 'Very Weak', color: 'danger' };
    if (strength <= 4) return { value: 0.5, label: 'Weak', color: 'warning' };
    if (strength <= 6) return { value: 0.75, label: 'Strong', color: 'success' };
    return { value: 1, label: 'Very Strong', color: 'primary' };
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
      // For Supabase password recovery flow
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setShowToast(true);
      setAlertMessage("Password updated successfully!");
      setShowAlert(true);
      
      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigation.push('/it35-lab', 'root', 'replace');
    } catch (error: any) {
      setAlertMessage(error.message || "Password update failed. Please try again.");
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
              width: '150px',
              height: '150px',
              backgroundColor: '#2c2c2e'
            }}
          >
            <IonIcon icon={logoIonic} style={{ fontSize: '120px', color: '#3880ff' }} />
          </IonAvatar>

          <h1 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '22px' }}>
            Set New Password
          </h1>

          {email && (
            <p style={{ color: '#a1a1aa', fontSize: '14px' }}>
              For: {email}
            </p>
          )}

          <IonInput
            label="New Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onIonChange={e => setNewPassword(e.detail.value!)}
            style={{
              width: '100%',
              maxWidth: '400px',
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa'
            }}
          />

          {newPassword && (
            <div style={{ width: '100%', maxWidth: '400px', marginTop: '-10px' }}>
              <IonProgressBar 
                value={passwordStrength.value} 
                color={passwordStrength.color}
                style={{ height: '4px' }}
              />
              <IonText color={passwordStrength.color} style={{ fontSize: '12px' }}>
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
              width: '100%',
              maxWidth: '400px',
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa'
            }}
          />

          <IonButton
            onClick={handlePasswordUpdate}
            expand="full"
            shape="round"
            disabled={isLoading}
            style={{
              width: '100%',
              maxWidth: '400px',
              fontWeight: 'bold',
              '--background': '#3880ff'
            }}
          >
            {isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </IonButton>

          <div style={{ 
            width: '100%', 
            maxWidth: '400px',
            color: '#a1a1aa',
            fontSize: '12px'
          }}>
            <p>Password should contain:</p>
            <ul style={{ paddingLeft: '20px' }}>
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
          message="Password updated successfully!"
          duration={2000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default ChangePass;