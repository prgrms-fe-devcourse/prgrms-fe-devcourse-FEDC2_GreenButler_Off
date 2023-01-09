import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, UploadImage, TagAddForm, PageWrapper, FixedContainer, Modal } from 'components';
import { PostTextArea } from 'components';
import useLocalToken from 'hooks/useLocalToken';
import { imageToFile } from 'utils/functions/converter';
import theme from 'styles/theme';
import { useUserContext } from 'contexts/UserContext';
import { MODAL_UPLOAD_IMAGE_TITLE, MODAL_UPLOAD_POST_TITLE } from 'utils/constants/messages';

const { headerHeight } = theme.value;

const PageFixed = styled(PageWrapper)`
  position: fixed;
  overflow: auto;
  height: calc(100% - ${headerHeight});
  width: 100%;
  max-width: 500px;
  bottom: 100px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const page = {
  create: {
    name: 'create',
    title: '게시물 등록',
  },
  edit: {
    name: 'edit',
    title: '게시물 수정',
  },
};

const PostEditPage = () => {
  const [tags, setTags] = useState([]);
  const [BinaryImg, setBinaryImg] = useState('');
  const [content, setContent] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [token, setValue] = useLocalToken();
  const [defaultImg, setDefaultImg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = location.pathname.split('/')[2]; // 페이지 구분

  const { id } = useParams();

  const { onAddPost, onEditPost } = useUserContext();

  const injectState = (post) => {
    const title = JSON.parse(post.title);

    setContent(title.content);
    setTags(title.tags);
    setDefaultImg(post.image);
  };

  const onAddTag = useCallback(
    (value) => {
      const tag = `#${value}`;
      if (tags.length < 5) {
        setTags([...tags, tag]);
      }
    },
    [tags],
  );

  const onRemoveTag = useCallback(
    (index) => {
      const updateTags = tags.filter((_, itemIndex) => itemIndex !== index);
      setTags(updateTags);
    },
    [tags],
  );

  const onClickSubmitBtn = async () => {
    if (!token) {
      return;
    }

    if (!defaultImg && !BinaryImg) {
      setModalMessage(MODAL_UPLOAD_IMAGE_TITLE);
      setIsModal(true);
      return;
    }

    if (!content) {
      setModalMessage(MODAL_UPLOAD_POST_TITLE);
      setIsModal(true);
      return;
    }

    setIsLoading(true);

    const title = JSON.stringify({ content, tags });
    const ImageBlob = BinaryImg ? imageToFile(BinaryImg) : null;

    if (currentPage === page.create.name) {
      await onAddPost(title, ImageBlob);
    }

    if (currentPage === page.edit.name) {
      await onEditPost(id, title, ImageBlob);
    }

    navigate('/');
    setIsLoading(false);
  };

  const onChangeFile = useCallback((src) => {
    setBinaryImg(src);
  }, []);

  const onChangeContent = useCallback((value) => {
    setContent(value);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsModal(false);
  }, []);

  useEffect(() => {
    if (currentPage === 'edit') {
      location.state?.post ? injectState(location.state.post) : navigate('/');
      // state로 받은 post가 없다면 홈으로 이동
    }
  }, [currentPage, location.state?.post]);

  return (
    <>
      <PageFixed title={page[currentPage].title} header prev>
        <UploadImage onChange={onChangeFile} defaultImage={defaultImg} />
        <TagAddForm onAddTag={onAddTag} onRemoveTag={onRemoveTag} tags={tags} />
        <PostTextArea
          onChange={onChangeContent}
          placeholder="내 식물의 성장 글을 작성해주세요."
          value={content}
          rows={10}
        ></PostTextArea>

        <Modal visible={isModal} onClose={onCloseModal}>
          <Modal.Content title={modalMessage} />
          <Modal.Button onClick={onCloseModal}>확인</Modal.Button>
        </Modal>
      </PageFixed>
      <FixedContainer bottom style={{ padding: 15 }}>
        <Button onClick={onClickSubmitBtn} disabled={isLoading}>
          {page[currentPage].title}
        </Button>
      </FixedContainer>
    </>
  );
};

export default PostEditPage;
