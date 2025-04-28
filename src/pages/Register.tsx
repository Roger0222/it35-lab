import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonTitle,
  IonModal,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonAlert
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';

// Reusable Alert Component
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

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleOpenVerificationModal = () => {
    if (!email.endsWith("@nbsc.edu.ph")) {
      setAlertMessage("Only @nbsc.edu.ph emails are allowed to register.");
      setShowAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      setShowAlert(true);
      return;
    }

    setShowVerificationModal(true);
  };

  const doRegister = async () => {
    setShowVerificationModal(false);

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw new Error("Account creation failed: " + error.message);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const { error: insertError } = await supabase.from("users").insert([
        {
          username,
          user_email: email,
          user_firstname: firstName,
          user_lastname: lastName,
          user_password: hashedPassword,
        },
      ]);

      if (insertError) {
        throw new Error("Failed to save user data: " + insertError.message);
      }

      setShowSuccessModal(true);
    } catch (err) {
      if (err instanceof Error) {
        setAlertMessage(err.message);
      } else {
        setAlertMessage("An unknown error occurred.");
      }
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ backgroundColor: '#121212' }}>
        <div style={{ marginTop: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '22px',
            marginBottom: '20px'
          }}>
            Create your account
          </h1>

          <IonInput
            label="Username"
            labelPlacement="floating"
            fill="outline"
            type="text"
            placeholder="Enter a unique username"
            value={username}
            onIonChange={e => setUsername(e.detail.value!)}
            style={{
              marginTop: '10px',
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa',
              '--color': '#ffffff',
              width: '100%',
              maxWidth: '400px'
            }}
          />
          <IonInput
            label="First Name"
            labelPlacement="floating"
            fill="outline"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onIonChange={e => setFirstName(e.detail.value!)}
            style={{
              marginTop: '10px',
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa',
              '--color': '#ffffff',
              width: '100%',
              maxWidth: '400px'
            }}
          />
          <IonInput
            label="Last Name"
            labelPlacement="floating"
            fill="outline"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onIonChange={e => setLastName(e.detail.value!)}
            style={{
              marginTop: '10px',
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa',
              '--color': '#ffffff',
              width: '100%',
              maxWidth: '400px'
            }}
          />
          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="youremail@nbsc.edu.ph"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            style={{
              marginTop: '10px',
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa',
              '--color': '#ffffff',
              width: '100%',
              maxWidth: '400px'
            }}
          />
          <IonInput
            label="Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Enter password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            style={{
              marginTop: '10px',
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa',
              '--color': '#ffffff',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>
          <IonInput
            label="Confirm Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onIonChange={e => setConfirmPassword(e.detail.value!)}
            style={{
              marginTop: '10px',
              color: '#ffffff',
              '--placeholder-color': '#a1a1aa',
              '--color': '#ffffff',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>

          <IonButton onClick={handleOpenVerificationModal} expand="full" shape='round' style={{ marginTop: '20px', maxWidth: '400px' }}>
            Register
          </IonButton>

          <IonButton routerLink="/it35-lab" expand="full" fill="clear" shape="round" style={{
            color: '#3880ff',
            textTransform: 'none',
            fontSize: '14px',
            marginTop: '10px',
            maxWidth: '400px'
          }}>
            Already have an account? <b>Sign in</b>
          </IonButton>
        </div>

        {/* Verification Modal */}
        <IonModal isOpen={showVerificationModal} onDidDismiss={() => setShowVerificationModal(false)}>
          <IonContent className="ion-padding" style={{ backgroundColor: '#121212' }}>
            <IonCard className="ion-padding" style={{ marginTop: '25%', backgroundColor: '#1e1e1e', color: '#ffffff' }}>
              <IonCardHeader>
                <IonCardTitle>User Registration Details</IonCardTitle>
                <hr />
                <IonCardSubtitle>Username</IonCardSubtitle>
                <IonCardTitle>{username}</IonCardTitle>

                <IonCardSubtitle>Email</IonCardSubtitle>
                <IonCardTitle>{email}</IonCardTitle>

                <IonCardSubtitle>Name</IonCardSubtitle>
                <IonCardTitle>{firstName} {lastName}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent></IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '5px' }}>
                <IonButton fill="clear" onClick={() => setShowVerificationModal(false)} color="medium">Cancel</IonButton>
                <IonButton color="primary" onClick={doRegister}>Confirm</IonButton>
              </div>
            </IonCard>
          </IonContent>
        </IonModal>

        {/* Success Modal */}
        <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
          <IonContent className="ion-padding" style={{ backgroundColor: '#121212', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <IonTitle style={{ color: '#ffffff' }}>Registration Successful 🎉</IonTitle>
            <IonText style={{ color: '#a1a1aa', textAlign: 'center', marginTop: '10px' }}>
              <p>Your account has been created successfully.</p>
              <p>Please check your email address.</p>
            </IonText>
            <IonButton routerLink="/it35-lab" routerDirection="back" color="primary" style={{ marginTop: '20px' }}>
              Go to Login
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Reusable AlertBox Component */}
        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

      </IonContent>
    </IonPage>
  );
};

export default Register;
