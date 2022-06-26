import { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import theme from 'styles/theme';
import { IMAGE_URLS } from 'utils/constants/images';
import { Modal } from 'components';

const { backgroundGreen, mainWhite } = theme.color;
const { POST_ADD_IMG } = IMAGE_URLS;

const ImageWrapper = styled.div`
  margin-left: -20px;
  margin-right: -20px;
`;

const ImageLoad = styled.div`
  width: 100%;
  background-color: ${backgroundGreen};
  position: relative;
  cursor: pointer;

  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ImageInner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const UploadImage = ({ onChange, defaultImage, ...props }) => {
  const [imageSrc, setImageSrc] = useState(defaultImage);
  const fileInputRef = useRef(null);
  const [isModal, setIsModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const handleFileChange = (e) => {
    const fileBlob = e.target.files[0];

    if (fileBlob.size > 1024 * 1024) {
      setModalMsg(`현재 파일 용량 : ${Math.round((fileBlob.size / 1024 / 1024) * 100) / 100}MB`);
      setIsModal(true);
      return;
    }

    if (fileBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(fileBlob);
      reader.onload = () => {
        setImageSrc(reader.result);
        onChange(reader.result);
      };
    }
  };

  const onCloseModal = () => {
    setIsModal(false);
  };

  useEffect(() => {
    setImageSrc(defaultImage);
  }, [defaultImage]);

  const ImageStyle = {
    backgroundImage: `url(${imageSrc ? imageSrc : POST_ADD_IMG}`,
    backgroundColor: imageSrc && mainWhite,
  };

  return (
    <ImageWrapper>
      <ImageLoad onClick={() => fileInputRef.current.click()} style={{ ...props.style }}>
        <ImageInner style={{ ...ImageStyle }} />
      </ImageLoad>
      <FileInput
        ref={fileInputRef}
        type="file"
        id="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Modal visible={isModal} onClose={onCloseModal}>
        <Modal.Content
          title="1MB 이하 파일만 등록해 주세요!"
          description={modalMsg}
        ></Modal.Content>
        <Modal.Button onClick={onCloseModal}>확인</Modal.Button>
      </Modal>
    </ImageWrapper>
  );
};

UploadImage.propTypes = {
  onChange: PropTypes.func,
  defaultImage: PropTypes.string,
};

export default UploadImage;
