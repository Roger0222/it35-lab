import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader,
  IonBackButton, IonButtons, IonItem, IonText, IonCol, IonGrid,
  IonRow, IonInputPasswordToggle, IonImg, IonAvatar, IonCard, IonCardContent,
  useIonViewWillEnter
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

const EditAccount: React.FC = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useIonViewWillEnter(() => {
    const fetchSessionAndData = async () => {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.session) {
        setAlertMessage('You must be logged in to access this page.');
        setShowAlert(true);
        history.push('/it35-lab/login');
        return;
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_firstname, user_lastname, user_avatar_url, user_email, username')
        .eq('user_email', session.session.user.email)
        .single();

      if (userError || !user) {
        setAlertMessage('User data not found.');
        setShowAlert(true);
        return;
      }

      setFirstName(user.user_firstname || '');
      setLastName(user.user_lastname || '');
      setAvatarPreview(user.user_avatar_url);
      setEmail(user.user_email);
      setUsername(user.username || '');
    };

    fetchSessionAndData();
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarLoaded(false);
    }
  };

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      setAlertMessage("Passwords don't match.");
      setShowAlert(true);
      return;
    }

    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.session) {
      setAlertMessage('Error fetching session or no session available.');
      setShowAlert(true);
      return;
    }

    const user = session.session.user;

    if (!user.email) {
      setAlertMessage('Error: User email is missing.');
      setShowAlert(true);
      return;
    }

    const { error: passwordError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (passwordError) {
      setAlertMessage('Incorrect current password.');
      setShowAlert(true);
      return;
    }

    let avatarUrl = avatarPreview;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        setAlertMessage(`Avatar upload failed: ${uploadError.message}`);
        setShowAlert(true);
        return;
      }

      const { data } = supabase.storage.from('user-avatars').getPublicUrl(filePath);
      avatarUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        user_firstname: firstName,
        user_lastname: lastName,
        user_avatar_url: avatarUrl,
        username: username,
      })
      .eq('user_email', user.email);

    if (updateError) {
      setAlertMessage(updateError.message);
      setShowAlert(true);
      return;
    }

    if (password) {
      const { error: passwordUpdateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (passwordUpdateError) {
        setAlertMessage(passwordUpdateError.message);
        setShowAlert(true);
        return;
      }
    }

    setAlertMessage('Account updated successfully!');
    setShowAlert(true);
    history.push('/it35-lab/app');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/it35-lab/app" />
        </IonButtons>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard className="ion-no-margin ion-padding">
          <IonCardContent>
            <IonText color="primary">
              <h2 style={{ fontWeight: 600 }}>Edit Account</h2>
            </IonText>

            <IonGrid>
              <IonRow className="ion-justify-content-center ion-margin-top">
                <IonCol className="ion-text-center">
                  {avatarPreview && (
                    <IonAvatar
                      style={{
                        width: '150px',
                        height: '150px',
                        margin: 'auto',
                        opacity: avatarLoaded ? 1 : 0,
                        transition: 'opacity 0.6s ease-in-out',
                      }}
                    >
                      <IonImg
                        src={avatarPreview}
                        onIonImgDidLoad={() => setAvatarLoaded(true)}
                        style={{ objectFit: 'cover' }}
                      />
                    </IonAvatar>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <IonButton expand="block" onClick={() => fileInputRef.current?.click()} className="ion-margin-top" fill="outline">
                    Upload Avatar
                  </IonButton>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonInput
                    label="Username"
                    type="text"
                    labelPlacement="floating"
                    fill="outline"
                    value={username}
                    placeholder="Enter username"
                    onIonChange={(e) => setUsername(e.detail.value!)}
                  />
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6">
                  <IonInput
                    label="First Name"
                    type="text"
                    labelPlacement="floating"
                    fill="outline"
                    value={firstName}
                    placeholder="Enter First Name"
                    onIonChange={(e) => setFirstName(e.detail.value!)}
                  />
                </IonCol>
                <IonCol size="6">
                  <IonInput
                    label="Last Name"
                    type="text"
                    labelPlacement="floating"
                    fill="outline"
                    value={lastName}
                    placeholder="Enter Last Name"
                    onIonChange={(e) => setLastName(e.detail.value!)}
                  />
                </IonCol>
              </IonRow>

              <IonRow className="ion-margin-top">
                <IonText color="medium"><h3>Change Password</h3></IonText>
                <IonCol size="12">
                  <IonInput
                    label="New Password"
                    type="password"
                    labelPlacement="floating"
                    fill="outline"
                    value={password}
                    placeholder="Enter New Password"
                    onIonChange={(e) => setPassword(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="12">
                  <IonInput
                    label="Confirm Password"
                    type="password"
                    labelPlacement="floating"
                    fill="outline"
                    value={confirmPassword}
                    placeholder="Confirm New Password"
                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonCol>
              </IonRow>

              <IonRow className="ion-margin-top">
                <IonText color="medium"><h3>Confirm Changes</h3></IonText>
                <IonCol size="12">
                  <IonInput
                    label="Current Password"
                    type="password"
                    labelPlacement="floating"
                    fill="outline"
                    value={currentPassword}
                    placeholder="Enter Current Password"
                    onIonChange={(e) => setCurrentPassword(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonButton expand="block" shape="round" className="ion-margin-top" onClick={handleUpdate}>
              Update Account
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditAccount;
