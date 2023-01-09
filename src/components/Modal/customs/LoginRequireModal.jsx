import { Modal } from 'components';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from 'styles/theme';
import {
  MODAL_TITLE_LOGIN_REQUIRED,
  MODAL_DESCRIPTION_LOGIN_REQUIRED,
} from 'utils/constants/messages';

const LoginRequireModal = ({ visible, onClose }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Content
        title={MODAL_TITLE_LOGIN_REQUIRED}
        description={MODAL_DESCRIPTION_LOGIN_REQUIRED}
      />
      <Modal.Button onClick={handleClick}>예</Modal.Button>
      <Modal.Button onClick={onClose} style={modalButtonStyle}>
        아니오
      </Modal.Button>
    </Modal>
  );
};

const modalButtonStyle = {
  color: theme.color.fontBlack,
  backgroundColor: theme.color.backgroundNormal,
};

export default LoginRequireModal;
