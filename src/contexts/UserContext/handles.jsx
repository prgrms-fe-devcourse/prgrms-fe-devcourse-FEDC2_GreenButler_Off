import useLocalToken from 'hooks/useLocalToken';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  login,
  logout,
  signup,
  changeUserName,
  changeProfile,
  changePassword,
  Follow,
  unFollow,
  setNotification,
} from 'utils/apis/userApi';
import {
  channelId,
  addPost,
  updatePost,
  deletePost,
  getUserPosts,
  addComment,
  deleteComment,
} from 'utils/apis/postApi';
import { objectToForm } from 'utils/functions/converter';

const useHandles = () => {
  const [localToken, setLocalToken] = useLocalToken();
  const navigate = useNavigate();

  const handleGetCurrentUser = useCallback(async () => {
    const user = await getCurrentUser(localToken).then((res) => res.data);
    if (!user?._id) {
      alert('인증에 실패했습니다. 로그인 화면으로 이동합니다.');
      setLocalToken('');
      localStorage.clear();
      navigate('/login', { replace: true });
      return;
    }
    return user;
  }, [navigate, localToken, setLocalToken]);

  const handleLogin = useCallback(
    async (inputData) => {
      setLocalToken('');
      localStorage.clear();
      const res = await login(inputData);
      if (res.data.token) {
        setLocalToken(res.data.token); 
        navigate('/', { replace: true }); 
      }
      return { user: res.data.user, token: res.data.token };
    },
    [navigate, setLocalToken],
  );

  const handleSignup = useCallback(
    async (inputData) => {
      setLocalToken('');
      localStorage.clear();
      const { data, error } = await signup(inputData);
      if (data.token) {
        setLocalToken(data.token); 
        await login(inputData);
      }
      return data;
    },
    [navigate, setLocalToken],
  );

  const handleLogout = useCallback(async () => {
    if (localToken) {
      await logout(localToken);
    }
    setLocalToken('');
    localStorage.clear();
    navigate('/login', { replace: true }); 
  }, [navigate, localToken, setLocalToken]);

  const handlechangeUserName = useCallback(
    async (fullName, username) => {
      if (localToken && fullName) {
        await changeUserName(localToken, fullName, username);
      }
    },
    [localToken],
  );

  const handlechangeProfile = useCallback(
    async ({ image }) => {
      const byteString = atob(image.split(',')[1]);

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ia], {
        type: 'image/jpeg',
      });

      const formData = new FormData();
      formData.append('isCover', false);
      formData.append('image', blob);

      if (localToken && image) {
        await changeProfile(localToken, formData);
      }
    },
    [localToken],
  );

  const handlechangePassword = useCallback(
    async (password) => {
      if (localToken && password) {
        await changePassword(localToken, password);
      }
    },
    [localToken],
  );

  const handlefollow = useCallback(
    async (userId) => {
      if (localToken && userId) {
        const { data } = await Follow(localToken, userId);
        await setNotification(localToken, 'FOLLOW', data._id, data.user, null);
        return data;
      }
    },
    [localToken],
  );

  const handleUnFollow = useCallback(
    async (followId) => {
      if (localToken && followId) {
        await unFollow(localToken, followId);
      }
    },
    [localToken],
  );

  const handleAddPost = useCallback(
    async (title, image) => {
      const formData = await objectToForm({ title, image, channelId });
      return await addPost(localToken, formData).then((res) => res.data);
    },
    [localToken],
  );

  const handleEditPost = useCallback(
    async (postId, title, image) => {
      const formData = await objectToForm({ postId, title, image, channelId });
      await updatePost(localToken, formData).then((res) => res.data);
      return await getUserPosts(postId).then((res) => res.data);
    },
    [localToken],
  );

  const handleDeletePost = useCallback(
    async (postId) => {
      return await deletePost(localToken, postId).then((res) => res.data);
    },
    [localToken],
  );

  const handleAddComment = useCallback(
    async (postId, value) => {
      return await addComment(localToken, postId, value).then((res) => res.data);
    },
    [localToken],
  );

  const handleDeleteComment = useCallback(
    async (commentId) => {
      return await deleteComment(localToken, commentId);
    },
    [localToken],
  );

  return {
    handleGetCurrentUser,
    handleLogin,
    handleSignup,
    handleLogout,
    handlechangeUserName,
    handlechangeProfile,
    handlechangePassword,
    handlefollow,
    handleUnFollow,
    handleAddPost,
    handleEditPost,
    handleDeletePost,
    handleAddComment,
    handleDeleteComment,
  };
};

export default useHandles;
