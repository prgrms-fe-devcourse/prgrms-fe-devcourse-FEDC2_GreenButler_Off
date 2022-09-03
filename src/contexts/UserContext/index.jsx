import { useContext, useCallback, useReducer, useMemo, createContext } from 'react';
import { reducer, initialUserData } from './reducer';
import useLocalToken from 'hooks/useLocalToken';
import useHandles from './handles';
import {
  LOGIN,
  SIGNUP,
  LOGOUT,
  KEEP_LOGIN,
  FOLLOW,
  UNFOLLOW,
  LOADING_ON,
  LOADING_OFF,
  CHANGE_PROFILE,
  CHANGE_FULLNAME,
  LIKE,
  DISLIKE,
  ADD_POST,
  EDIT_POST,
  DELETE_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
} from './types';

export const UserContext = createContext(initialUserData);
export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [{ currentUser, isLoading }, dispatch] = useReducer(reducer, initialUserData); 
  const [localToken] = useLocalToken(); 
  const {
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
  } = useHandles();

  const onLogin = useCallback(
    async (data) => {
      dispatch({ type: LOADING_ON });
      const { user, token } = await handleLogin(data);
      if (token) {
        dispatch({ type: LOGIN, payload: user }); 
      }
      dispatch({ type: LOADING_OFF });
    },
    [handleLogin],
  );

  const onSignup = useCallback(
    async (data) => {
      dispatch({ type: LOADING_ON });
      const res = await handleSignup(data);

      if (res.token) {
        dispatch({ type: SIGNUP, payload: res.user }); 
      }
      dispatch({ type: LOADING_OFF });
    },
    [handleSignup],
  );

  const onLogout = useCallback(async () => {
    dispatch({ type: LOADING_ON });
    handleLogout();
    dispatch({ type: LOGOUT }); 
    dispatch({ type: LOADING_OFF });
  }, [handleLogout]);

  const onFollow = useCallback(
    async (payload = { userId: '', followId: '' }) => {
      const data = await handlefollow(payload.userId);
      dispatch({ type: FOLLOW, payload: data });
    },
    [handlefollow],
  );

  const onUnfollow = useCallback(
    (payload = { unfollowId: '' }) => {
      handleUnFollow(payload.unfollowId);
      dispatch({ type: UNFOLLOW, payload });
    },
    [handleUnFollow],
  );

  const onChangeFullName = useCallback(
    (payload = { fullName: '', username: '' }) => {
      const { fullName, username } = payload;
      handlechangeUserName(fullName, username);
      dispatch({ type: CHANGE_FULLNAME, payload });
    },
    [handlechangeUserName],
  );

  const onChangeProfile = useCallback(
    (payload = { image: '' }) => {
      handlechangeProfile(payload);
      dispatch({ type: CHANGE_PROFILE, payload });
    },
    [handlechangeProfile],
  );

  const onChangePassword = useCallback(
    async (password) => {
      handlechangePassword(password);
    },
    [handlechangePassword],
  );

  const onLike = useCallback((like) => {
    dispatch({ type: LIKE, payload: like });
  }, []);

  const onDisLike = useCallback((like) => {
    dispatch({ type: DISLIKE, payload: like });
  }, []);

  const onKeepLoggedIn = useCallback(async () => {
    const user = await handleGetCurrentUser();
    dispatch({ type: KEEP_LOGIN, payload: user });
  }, [handleGetCurrentUser]);

  const onAddPost = useCallback(
    async (title, image) => {
      const post = await handleAddPost(title, image);
      dispatch({ type: ADD_POST, payload: post });
    },
    [handleAddPost],
  );

  const onEditPost = useCallback(
    async (postId, title, image) => {
      const posts = await handleEditPost(postId, title, image);
      dispatch({ type: EDIT_POST, payload: posts });
    },
    [handleEditPost],
  );

  const onDeletePost = useCallback(
    async (postId) => {
      const posts = await handleDeletePost(postId);
      dispatch({ type: DELETE_POST, payload: posts });
    },
    [handleDeletePost],
  );

  const onAddComment = useCallback(
    async (postId, value) => {
      const comment = await handleAddComment(postId, value);
      dispatch({ type: ADD_COMMENT, payload: comment._id });
      return comment;
    },
    [handleAddComment],
  );

  const onDeleteComment = useCallback(
    async (commentId) => {
      await handleDeleteComment(commentId);
      dispatch({ type: DELETE_COMMENT, payload: commentId });
    },
    [handleDeleteComment],
  );

  const value = useMemo(() => {
    return {
      currentUser,
      isLoading,
      onLogin,
      onSignup,
      onLogout,
      onFollow,
      onUnfollow,
      onChangeFullName,
      onChangeProfile,
      onChangePassword,
      onLike,
      onDisLike,
      onKeepLoggedIn,
      onAddPost,
      onEditPost,
      onDeletePost,
      onAddComment,
      onDeleteComment,
    };
  }, [
    currentUser,
    isLoading,
    onLogin,
    onSignup,
    onLogout,
    onFollow,
    onUnfollow,
    onChangeFullName,
    onChangeProfile,
    onChangePassword,
    onLike,
    onDisLike,
    onKeepLoggedIn,
    onAddPost,
    onEditPost,
    onDeletePost,
    onAddComment,
    onDeleteComment,
  ]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
