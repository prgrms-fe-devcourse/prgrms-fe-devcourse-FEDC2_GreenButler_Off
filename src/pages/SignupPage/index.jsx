import { Text, Modal, PageWrapper, SignupForm } from 'components';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useLocalStorage from 'hooks/useLocalStorage';
import {
  MODAL_SIGNUP_TITLE,
  MODAL_SIGNUP_DESCRIPTION,
  MODAL_SIGNUP_FAIL_TITLE,
  MODAL_SIGNUP_FAIL_DESCRIPTION,
  MODAL_SIGNUP_FAIL_NETWORK,
  MODAL_SIGNUP_FAIL_EMAIL,
} from 'utils/constants/messages';

import { useUserContext } from 'contexts/UserContext';

const SignupWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 111px;
`;

const StyledText = styled(Text)`
  font-weight: 500;
`;

const SignupPage = () => {
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { onSignup } = useUserContext();

  const closeModal = () => {
    setShowModal(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const onClick = () => {
    navigate('/');
  };

  const handleSubmit = async ({ email, fullName, password }) => {
    try {
      const res = await onSignup({
        email,
        fullName,
        password,
      });
      setShowLoginModal(true);
    } catch (e) {
      e.message = 'SignupError';
      if (e.code === 'ERR_BAD_REQUEST') {
        setDescription(MODAL_SIGNUP_FAIL_EMAIL);
      } else if (e.code === 'ERR_NETWORK') {
        setDescription(MODAL_SIGNUP_FAIL_NETWORK);
      }
      setShowModal(true);
      throw e;
    }
  };
  return (
    <PageWrapper>
      <SignupWrapper>
        <StyledText fontSize={30}>회원가입</StyledText>
        <SignupForm onSubmit={handleSubmit}></SignupForm>
        <Modal visible={showLoginModal} onClose={closeLoginModal}>
          <Modal.Content
            title={MODAL_SIGNUP_TITLE}
            description={MODAL_SIGNUP_DESCRIPTION}
            onClose={closeLoginModal}
          ></Modal.Content>
          <Modal.Button onClick={onClick}>확인</Modal.Button>
        </Modal>
        <Modal visible={showModal} onClose={closeModal}>
          <Modal.Content
            title={MODAL_SIGNUP_FAIL_TITLE}
            description={description ? description : MODAL_SIGNUP_FAIL_DESCRIPTION}
            onClose={closeModal}
          ></Modal.Content>
          <Modal.Button onClick={closeModal}>확인</Modal.Button>
        </Modal>
      </SignupWrapper>
    </PageWrapper>
  );
};

export default SignupPage;
