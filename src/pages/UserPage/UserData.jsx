import React, { useEffect, useState, useCallback } from 'react';
import { Text, Avatar, Button, Image, Modal } from 'components';
import { useUserContext } from 'contexts/UserContext';
import theme from 'styles/theme';
import { IMAGE_URLS } from 'utils/constants/images';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useLocalToken from 'hooks/useLocalToken';

import {
  followButtonStyle,
  followingButtonStyle,
  fullNameStyle,
  UserInfo,
  UserDetailWrapper,
  UserDetail,
  NickName,
} from './style';
import {
  MODAL_FOLLOW_DESCRIPTION,
  MODAL_FOLLOW_TITLE,
  MODAL_UNFOLLOW_DESCRIPTION,
  MODAL_UNFOLLOW_TITLE,
} from 'utils/constants/messages';

const UserData = ({ user, pageUserId, userLevel }) => {
  const [token] = useLocalToken();
  const { currentUser, onFollow, onUnfollow } = useUserContext();
  const followData = currentUser.following.filter((follow) => follow.user === pageUserId);
  const [isFollow, setIsFollow] = useState(false);
  const [isFollowModal, setIsFollowModal] = useState(false);
  const [isUnFollowModal, setIsUnFollowModal] = useState(false);
  const [followers, setFollowers] = useState();
  const isFollowButton = token && currentUser.id !== pageUserId && isFollow;
  const isUnfollowButton = token && currentUser.id !== pageUserId && !isFollow;

  useEffect(() => {
    setIsFollow(followData.length === 0 ? false : true);
  }, [followData]);

  useEffect(() => {
    setFollowers(user.followers.length);
  }, [user]);

  const navigate = useNavigate();

  const onCloseFollow = () => {
    setIsFollowModal(false);
  };

  const onCloseUnFollow = () => {
    setIsUnFollowModal(false);
  };

  const handleFollow = useCallback(() => {
    if (!isFollow) {
      onFollow({ userId: pageUserId, followId: '' });
      setIsFollowModal(true);
      setIsFollow(true);
      setFollowers(followers + 1);
    }
    setIsFollow(true);
  }, [pageUserId, isFollow, onFollow, followers]);

  const handleUnFollow = useCallback(() => {
    if (followData.length !== 0) {
      onUnfollow({ unfollowId: followData[0]._id });
      setIsFollow(false);
      if (followers > 0) {
        setFollowers(followers - 1);
      }
    }
    setIsUnFollowModal(false);
  }, [followData, onUnfollow, followers]);

  return (
    <UserInfo>
      <Avatar
        size={136}
        style={{
          cursor: 'pointer',
        }}
        src={user.image || IMAGE_URLS.PROFILE_IMG}
        onClick={() => currentUser.id === pageUserId && navigate('/user/MyInfo')}
      />
      <NickName>
        {userLevel.image && <Image src={userLevel.image} width={30} block={true} />}
        <Text style={fullNameStyle} fontWeight={700}>
          {user.fullName}
        </Text>
      </NickName>
      <UserDetailWrapper>
        <UserDetail>
          <Text fontSize={16} color={theme.color.fontNormal}>
            게시물
          </Text>
          <Text fontSize={20} fontWeight={700}>
            {user.posts.length}
          </Text>
        </UserDetail>
        <UserDetail onClick={() => navigate(`/user/follow/${pageUserId}`)}>
          <Text fontSize={16} color={theme.color.fontNormal}>
            팔로워
          </Text>
          <Text fontSize={20} fontWeight={700}>
            {followers && followers}
          </Text>
        </UserDetail>
        <UserDetail onClick={() => navigate(`/user/follow/${pageUserId}`)}>
          <Text fontSize={16} color={theme.color.fontNormal}>
            팔로잉
          </Text>
          <Text fontSize={20} fontWeight={700}>
            {user.following.length}
          </Text>
        </UserDetail>
      </UserDetailWrapper>

      {isFollowButton && (
        <Button
          width={100}
          height={30}
          borderRadius={10}
          fontSize="16px"
          style={{ ...followingButtonStyle }}
          onClick={() => setIsUnFollowModal(true)}
          borderColor={theme.color.borderNormal}
          backgroundColor={theme.color.mainWhite}
          color={theme.color.fontNormal}
          borderWidth={1}
        >
          팔로잉
        </Button>
      )}
      {isUnfollowButton && (
        <Button
          width={100}
          height={30}
          borderRadius={10}
          fontSize="16px"
          style={{ ...followButtonStyle }}
          onClick={handleFollow}
        >
          팔로우
        </Button>
      )}

      <Modal visible={isFollowModal} onClose={onCloseFollow}>
        <Modal.Content
          title={MODAL_FOLLOW_TITLE}
          description={MODAL_FOLLOW_DESCRIPTION}
          onClose={onCloseFollow}
        />
        <Modal.Button onClick={onCloseFollow}>확인</Modal.Button>
      </Modal>

      <Modal visible={isUnFollowModal} onClose={onCloseUnFollow}>
        <Modal.Content
          title={MODAL_UNFOLLOW_TITLE}
          description={MODAL_UNFOLLOW_DESCRIPTION}
          onClose={onCloseUnFollow}
        />
        <Modal.Button
          onClick={() => {
            handleUnFollow();
          }}
        >
          확인
        </Modal.Button>
        <Modal.Button
          onClick={onCloseUnFollow}
          backgroundColor={theme.color.backgroundNormal}
          color="#000"
        >
          취소
        </Modal.Button>
      </Modal>
    </UserInfo>
  );
};

export default React.memo(UserData);

UserData.propTypes = {
  user: PropTypes.object,
  pageUserId: PropTypes.string,
};
