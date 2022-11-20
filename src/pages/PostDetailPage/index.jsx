import styled from '@emotion/styled';
import PostItem from 'pages/MainPage/PostItem';
import { Avatar, Modal, PageWrapper } from 'components';
import IconButton from 'components/basic/Icon/IconButton';
import theme from 'styles/theme';
import { useRef, useState } from 'react';
import useLocalToken from 'hooks/useLocalToken';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from 'contexts/UserContext';
import { setNotification } from 'utils/apis/userApi';
import displayedAt from 'utils/functions/displayedAt';
import { MORE } from 'utils/constants/icons/names';
import { COMMENT } from 'utils/constants/notificationTypes';
import LoginRequireModal from 'components/Modal/customs/LoginRequireModal';
import useSWR from 'swr';

const PostDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputHeight, setInputHeight] = useState('30px');
  const inputRef = useRef(null);
  const [localToken] = useLocalToken();
  const { currentUser, onAddComment, onDeleteComment } = useUserContext();
  const [loginModalOn, setLoginModalOn] = useState(false);
  const [commentModalOn, setCommentModalOn] = useState(false);
  const commentIdToDelete = useRef('');

  const postId = location.pathname.split('/')[3];
  const { data: post, mutate } = useSWR(`/posts/${postId}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localToken) {
      setLoginModalOn(true);
      return;
    }
    if (!inputRef.current.value) {
      return;
    }
    const newComment = await onAddComment(post._id, inputRef.current.value);
    mutate({
      ...post,
      comments: [...post.comments, newComment],
    });
    setInputHeight('30px');
    inputRef.current.value = '';
    if (currentUser.id !== post.author._id) {
      await setNotification(localToken, COMMENT, newComment._id, post.author._id, post._id);
    }
  };

  const handleResizeInputHeight = () => {
    const { value, scrollHeight } = inputRef.current;
    if (value.length === 0) {
      setInputHeight('30px');
      return;
    }
    setInputHeight(scrollHeight + 'px');
  };

  const handleClickAvatar = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleClickMore = (commentId) => {
    setCommentModalOn(true);
    commentIdToDelete.current = commentId;
  };

  const handleDeleteComment = async () => {
    setCommentModalOn(false);
    if (commentIdToDelete.current) {
      await onDeleteComment(commentIdToDelete.current);
      mutate({
        ...post,
        comments: post.comments.filter(({ _id }) => _id !== commentIdToDelete.current),
      });
    }
  };

  const handleCloseModal = () => {
    setLoginModalOn(false);
    setCommentModalOn(false);
  };

  return (
    <>
      {post && (
        <PageWrapper header nav prev title={post.author.fullName + '님의 게시물'}>
          <Container>
            <PostItem post={post} isDetailPage={true} index={location.state?.index} />
            <CommentInputForm onSubmit={handleSubmit}>
              <CommentInput
                ref={inputRef}
                height={inputHeight}
                onChange={handleResizeInputHeight}
                placeholder="댓글을 입력해주세요."
              />
              <SubmitButton />
            </CommentInputForm>
            <CommentList>
              {post.comments
                .map(({ _id: commentId, author: { _id, image, fullName }, comment, createdAt }) => (
                  <CommentItem key={commentId}>
                    <UserAvatar src={image} onClick={() => handleClickAvatar(_id)} />
                    <Content>
                      <MetaInformation>
                        <UserNameText>{fullName}</UserNameText>
                        <DateText>{displayedAt(createdAt)}</DateText>
                      </MetaInformation>
                      <CommentText>{comment}</CommentText>
                    </Content>
                    {_id === currentUser.id && (
                      <IconButton
                        name={MORE}
                        size={20}
                        style={MoreButtonStyle}
                        onClick={() => handleClickMore(commentId)}
                      />
                    )}
                  </CommentItem>
                ))
                .reverse()}
            </CommentList>
          </Container>
          {commentModalOn && (
            <Modal visible={commentModalOn} onClose={handleCloseModal}>
              <Modal.Custom>
                <DeleteCommentButton onClick={handleDeleteComment}>삭제</DeleteCommentButton>
              </Modal.Custom>
            </Modal>
          )}
          {loginModalOn && <LoginRequireModal visible={loginModalOn} onClose={handleCloseModal} />}
        </PageWrapper>
      )}
    </>
  );
};

const Container = styled.div``;

const CommentInputForm = styled.form`
  display: flex;
  align-items: center;
  margin: 13px 0;
  padding: 12px;
  padding-left: 22px;
  border-radius: 15px;
  border: 1px solid ${theme.color.borderNormal};
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: ${({ height }) => height};
  color: ${theme.color.fontBlack};
  font-size: 18px;
  resize: none;
  overflow: hidden;

  &::placeholder {
    color: ${theme.color.fontNormal};
  }
`;

const SubmitButton = ({ ...props }) => {
  const style = {
    color: theme.color.mainWhite,
    backgroundColor: theme.color.mainGreen,
    fontSize: '18px',
    fontWeight: 500,
    padding: '10px 16px',
    borderRadius: '12px',
    marginLeft: '10px',
    alignSelf: 'flex-end',
    whiteSpace: 'nowrap',
  };
  return (
    <button style={style} {...props}>
      등록
    </button>
  );
};

const CommentList = styled.ul`
  margin: 10px 0;
`;

const CommentItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 20px 25px 20px 0;
  position: relative;
`;

const Content = styled.div`
  margin: 0 10px;
  transform: translateY(8px);
`;

const UserAvatar = ({ src, onClick }) => {
  const style = {
    cursor: 'pointer',
  };
  return (
    <div onClick={onClick} style={style}>
      <Avatar src={src} size={60} />
    </div>
  );
};

const MetaInformation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const UserNameText = styled.span`
  font-size: 18px;
  font-weight: bold;
  line-height: 19px;
`;

const DateText = styled.span`
  color: ${theme.color.fontNormal};
  font-size: 14px;
  line-height: 15px;
  margin-left: 6px;
  word-wrap: break-word;
`;

const CommentText = styled.p`
  font-size: 16px;
  line-height: 24px;
  word-break: break-all;
  white-space: pre-wrap;
`;

const MoreButtonStyle = {
  position: 'absolute',
  top: '23px',
  right: '0',
};

const DeleteCommentButton = styled.button`
  background-color: ${theme.color.mainWhite};
  color: ${theme.color.mainRed};
  position: absolute;
  bottom: 0;
  width: 100%;
  font-size: 24px;
  line-height: 29px;
  padding: 35px 0;
  border-radius: 15px 15px 0 0;

  @media screen and (max-width: 500px) {
    width: 100vw;
    padding: 22px 0;
    font-size: 22px;
  }
`;

export default PostDetailPage;
