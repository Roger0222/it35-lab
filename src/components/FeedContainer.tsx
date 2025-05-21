import { useState, useEffect } from 'react';
import {
  IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard,
  IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonAlert, IonText, IonAvatar, IonCol, IonGrid, IonRow,
  IonIcon, IonPopover, IonItem
} from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { pencil, trash, ellipsisVertical } from 'ionicons/icons';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>('https://ionicframework.com/docs/img/demos/avatar.svg');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
          setUserAvatarUrl(userData.user_avatar_url || userAvatarUrl);
        }
      }
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('post_created_at', { ascending: false });
      if (!error) setPosts(data as Post[]);
    };

    fetchUser();
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!postContent || !user || !username) return;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user avatar:', userError);
      return;
    }

    const avatarUrl = userData?.user_avatar_url || userAvatarUrl;

    const { data, error } = await supabase
      .from('posts')
      .insert([{ post_content: postContent, user_id: user.id, username, avatar_url: avatarUrl }])
      .select('*');

    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
    }

    setPostContent('');
  };

  const deletePost = async (post_id: string) => {
    await supabase.from('posts').delete().match({ post_id });
    setPosts(posts.filter(post => post.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;

    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');

    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle className="ion-text-center" style={{ color: 'black' }}>Feed</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding" style={{ backgroundColor: '#f3f4f6', color: 'black' }}>
          {user ? (
            <>
              <IonCard style={{ background: '#ffffff', border: '1px solid #ccc', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)', color: 'black' }}>
                <IonCardContent>
                  <IonGrid>
                    <IonRow className="ion-align-items-center">
                      <IonCol size="auto">
                        <IonAvatar>
                          <img src={userAvatarUrl} alt="User Avatar" />
                        </IonAvatar>
                      </IonCol>
                      <IonCol>
                        <IonInput
                          value={postContent}
                          onIonChange={e => setPostContent(e.detail.value!)}
                          placeholder="What's on your mind?"
                          fill="outline"
                          style={{ color: 'black' }}
                        />
                      </IonCol>
                    </IonRow>
                    <IonRow className="ion-justify-content-end ion-padding-top">
                      <IonButton onClick={createPost}>Post</IonButton>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>

              {posts.map(post => (
                <IonCard key={post.post_id} style={{ background: '#ffffff', border: '1px solid #ccc', marginTop: '16px', color: 'black' }}>
                  <IonCardHeader>
                    <IonGrid>
                      <IonRow className="ion-align-items-center">
                        <IonCol size="auto">
                          <IonAvatar>
                            <img src={post.avatar_url} alt="Avatar" />
                          </IonAvatar>
                        </IonCol>
                        <IonCol>
                          <IonCardTitle style={{ color: 'black' }}>{post.username}</IonCardTitle>
                          <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                        </IonCol>
                        <IonCol size="auto">
                          <IonButton
                            fill="clear"
                            onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}
                          >
                            <IonIcon icon={ellipsisVertical} />
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardHeader>

                  <IonCardContent>
                    <IonText style={{ color: 'black' }}>{post.post_content}</IonText>
                  </IonCardContent>

                  <IonPopover
                    isOpen={popoverState.open && popoverState.postId === post.post_id}
                    event={popoverState.event}
                    onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                  >
                    <IonItem button onClick={() => { startEditingPost(post); setPopoverState({ open: false, event: null, postId: null }); }}>
                      <IonIcon icon={pencil} slot="start" />
                      Edit
                    </IonItem>
                    <IonItem button lines="none" onClick={() => { deletePost(post.post_id); setPopoverState({ open: false, event: null, postId: null }); }}>
                      <IonIcon icon={trash} slot="start" color="danger" />
                      <IonText color="danger">Delete</IonText>
                    </IonItem>
                  </IonPopover>
                </IonCard>
              ))}
            </>
          ) : (
            <IonLabel style={{ color: 'black' }}>Loading...</IonLabel>
          )}
        </IonContent>

        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar color="light">
              <IonTitle>Edit Post</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding" style={{ color: 'black' }}>
            <IonInput
              value={postContent}
              onIonChange={e => setPostContent(e.detail.value!)}
              placeholder="Edit your post..."
              fill="outline"
              style={{ color: 'black' }}
            />
          </IonContent>
          <IonFooter className="ion-padding">
            <IonButton expand="block" onClick={savePost}>Save</IonButton>
            <IonButton expand="block" color="medium" onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
          </IonFooter>
        </IonModal>

        <IonAlert
          isOpen={isAlertOpen}
          onDidDismiss={() => setIsAlertOpen(false)}
          header="Success"
          message="Post updated successfully!"
          buttons={['OK']}
        />
      </IonPage>
  );
};

export default FeedContainer;
