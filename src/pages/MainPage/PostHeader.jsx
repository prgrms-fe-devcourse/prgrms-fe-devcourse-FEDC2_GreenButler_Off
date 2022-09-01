import styled from '@emotion/styled';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile, Modal } from 'components';
import { useUserContext } from 'contexts/UserContext';
import theme from 'styles/theme';
import useLocalToken from 'hooks/useLocalToken';
import IconButton from 'components/basic/Icon/IconButton';
import { MORE } from 'utils/constants/icons/names';

const PostHeader = ({ post, isDetailPage }) => {
  const {
    _id: postId,
    author: { _id, image, fullName },
  } = post;
  const { currentUser, onDeletePost } = useUserContext();
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [localToken] = useLocalToken();

  const handleClickProfile = () => {
    navigate(`/user/${_id}`, {
      state: {
        userId: _id,
      },
    });
  };

  const handleClickMore = () => {
    setIsModal(true);
  };

  const handleUpdate = () => {
    setIsModal(false);
    navigate(`/post/edit/${postId}`, {
      state: {
        post,
      },
    });
  };

  const handleDelete = async () => {
    setIsModal(false);
    if (localToken && postId) {
      await onDeletePost(postId);
      navigate(-1);
    }
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const isMyPost = () => {
    return _id === currentUser.id && isDetailPage;
  };

  return (
    <>
      <Header>
        <Profile src={image} userName={fullName} onClick={handleClickProfile} />
        {isMyPost && (
          <>
            <IconButton name={MORE} size={20} onClick={handleClickMore} />
            <Modal visible={isModal} onClose={handleCloseModal}>
              <Modal.Custom>
                <Buttons>
                  <UpdatePostButton onClick={handleUpdate}>수정</UpdatePostButton>
                  <DeletePostButton onClick={handleDelete}>삭제</DeletePostButton>
                </Buttons>
              </Modal.Custom>
            </Modal>
          </>
        )}
      </Header>
    </>
  );
};

const Header = styled.header`
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Buttons = styled.div`
  background-color: ${theme.color.mainWhite};
  position: absolute;
  bottom: 0%;
  width: 100%;
  border-radius: 15px 15px 0 0;

  & > button {
    width: 100%;
    font-size: 24px;
    line-height: 29px;
  }

  @media screen and (max-width: 500px) {
    width: 100vw;
  }
`;

const UpdatePostButton = styled.button`
  padding-top: 44px;
  padding-bottom: 9.5px;

  @media screen and (max-width: 500px) {
    padding-top: 24px;
  }
`;

const DeletePostButton = styled.button`
  padding-top: 9.5px;
  padding-bottom: 35px;
  color: ${theme.color.mainRed};

  @media screen and (max-width: 500px) {
    padding-bottom: 20px;
  }
`;

export default PostHeader;
