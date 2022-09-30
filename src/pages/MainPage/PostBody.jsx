import { css } from '@emotion/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Image, Text } from 'components';
import theme from 'styles/theme';
import { setLike, setDisLike } from 'utils/apis/postApi';
import { setNotification } from 'utils/apis/userApi';
import useLocalToken from 'hooks/useLocalToken';
import useScrollPosition from 'hooks/useScrollPosition';
import { useUserContext } from 'contexts/UserContext';
import { IMAGE_URLS } from 'utils/constants/images';
import displayedAt from 'utils/functions/displayedAt';
import IconButton from 'components/basic/Icon/IconButton';
import { COMMENT, HEART, HEART_RED } from 'utils/constants/icons/names';
import { LIKE } from 'utils/constants/notificationTypes';
import LoginRequireModal from 'components/Modal/customs/LoginRequireModal';
import { mutate } from 'swr';
import { swrOptions } from 'utils/apis/swrOptions';

const PostBody = ({ index, post, isDetailPage = false }) => {
  const { _id: postId, image, likes, comments, createdAt, author } = post || {};
  const { content, tags } = JSON.parse(post?.title);
  const [onHeart, setOnHeart] = useState(false);
  const [heartCount, setHeartCount] = useState(likes.length);
  const likeId = useRef('');
  const [isShown, setIsShown] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [token] = useLocalToken();
  const { currentUser } = useUserContext();
  const [, setCurrentPostIndex] = useScrollPosition();
  const navigate = useNavigate();

  useEffect(() => {
    const myLikeIndex = likes.findIndex(({ user }) => user === currentUser.id);
    if (myLikeIndex > -1) {
      setOnHeart(true);
      likeId.current = likes[myLikeIndex]._id;
    } else {
      setOnHeart(false);
      likeId.current = '';
    }
  }, [currentUser, likes.length]);

  useEffect(() => {
    setHeartCount(likes.length);
  }, [likes.length]);

  const navigateToDetailPage = () => {
    if (isDetailPage) {
      return;
    }
    setCurrentPostIndex(index + 1);
    navigate(`/post/detail/${postId}`, {
      state: {
        post,
        index,
      },
    });
  };

  const handleClickHeart = async () => {
    if (!token) {
      setModalOn(true);
      return;
    }

    setOnHeart(!onHeart);
    if (!onHeart) {
      setHeartCount(heartCount + 1);
      if (token && postId) {
        const like = await setLike(token, postId).then((res) => res.data);
        likeId.current = like._id;
        if (currentUser.id !== author._id) {
          await setNotification(token, LIKE, likeId.current, author._id, postId);
        }
      }
    } else {
      setHeartCount(heartCount - 1);
      if (token && likeId.current) {
        await setDisLike(token, likeId.current).then((res) => res.data);
        likeId.current = '';
      }
    }
  };

  const handleClickTag = (tag) => {
    setCurrentPostIndex(index + 1);
    navigate(`/tag/${tag.slice(1)}`, {
      state: {
        tag,
      },
    });
  };

  const handleClickMore = () => {
    setIsShown(true);
  };

  const handleCloseModal = () => {
    setModalOn(false);
  };

  const PrefetchPostData = () => {
    !isDetailPage && mutate(`/posts/${postId}`, () => swrOptions.fetcher(`/posts/${postId}`));
  };

  return (
    <Container>
      <ImageWrapper
        onClick={navigateToDetailPage}
        isDetailPage={isDetailPage}
        onMouseEnter={PrefetchPostData}
        onTouchStart={PrefetchPostData}
      >
        <Image
          src={image ? image : IMAGE_URLS.POST_DEFAULT_IMG}
          defaultImageUrl={IMAGE_URLS.POST_DEFAULT_IMG}
          width="100%"
          height="100%"
        />
      </ImageWrapper>
      <Contents>
        <IconButtons>
          <IconButton
            name={onHeart ? HEART_RED : HEART}
            size={22}
            style={IconButtonStyle}
            onClick={handleClickHeart}
          >
            <Text fontSize={16} style={IconButtonTextStyle}>
              {heartCount}
            </Text>
          </IconButton>
          <IconButton name={COMMENT} size={22} onClick={navigateToDetailPage}>
            <Text fontSize={16} style={IconButtonTextStyle}>
              {comments.length}
            </Text>
          </IconButton>
        </IconButtons>
        <TextContainer>
          <Paragraph isDetailPage={isDetailPage} isShown={isShown}>
            {content}
          </Paragraph>
          {!isDetailPage && content?.length > 50 && !isShown && (
            <MoreText onClick={handleClickMore}>더보기</MoreText>
          )}
        </TextContainer>
        <Tags>
          {tags.map((tag, i) => (
            <Tag key={i} onClick={() => handleClickTag(tag)}>
              {tag[0] === '#' ? tag : `#${tag}`}
            </Tag>
          ))}
        </Tags>
        <DateText>{displayedAt(createdAt)}</DateText>
      </Contents>
      <LoginRequireModal visible={modalOn} onClose={handleCloseModal} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  color: ${theme.color.fontBlack};
`;

const ImageWrapper = styled.div`
  width: 500px;
  height: 500px;
  margin-left: -20px;
  margin-right: -20px;
  cursor: ${({ isDetailPage }) => (isDetailPage ? undefined : 'pointer')};

  @media screen and (max-width: 500px) {
    width: 100vw;
    height: 100vw;
  }
`;

const Contents = styled.div`
  padding: 18px 0;
`;

const IconButtons = styled.div`
  display: flex;
`;

const IconButtonStyle = {
  marginRight: '16px',
  color: theme.color.fontBlack,
};

const IconButtonTextStyle = {
  fontSize: '16px',
  color: theme.color.fontBlack,
  marginLeft: '8px',
  PointerEvent: 'none',
  lineHeight: '19px',
  transform: 'translateY(-1px)',
};

const TextContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 15px;
  margin-bottom: 18px;
`;

const Paragraph = styled.span`
  display: inline-block;
  width: 84%;
  line-height: 28px;
  font-size: 20px;
  word-break: keep-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  flex: 1;

  ${({ isDetailPage, isShown }) =>
    !isDetailPage &&
    !isShown &&
    css`
      max-height: 56px;
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    `};
`;

const MoreText = styled.button`
  font-size: 16px;
  padding: 0;
  margin-left: 2px;
  color: ${theme.color.fontNormal};
`;

const Tags = styled.div``;

const Tag = ({ children, ...props }) => {
  const style = {
    height: '29px',
    color: theme.color.mainGreen,
    fontSize: '16px',
    borderRadius: '15px',
    border: `1px solid ${theme.color.mainGreen}`,
    padding: '0px 13px',
    marginRight: '4px',
    marginBottom: '5px',
  };
  return (
    <button style={style} {...props}>
      {children}
    </button>
  );
};

const DateText = ({ children, ...props }) => {
  const style = {
    display: 'block',
    marginTop: '13px',
    marginBottom: '18px',
  };
  return (
    <Text fontSize={16} color={theme.color.fontNormal} style={style} {...props}>
      {children}
    </Text>
  );
};

export default PostBody;
