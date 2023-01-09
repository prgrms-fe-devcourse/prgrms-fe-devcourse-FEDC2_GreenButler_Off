import styled from '@emotion/styled';
import { useUserContext } from 'contexts/UserContext';
import { Text, PageWrapper, Input, Modal } from 'components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import theme from 'styles/theme';
import { MODAL_CHANGE_PASSWORD_TITLE } from 'utils/constants/messages';

const MyInfoEditPage = () => {
  const { onChangePassword } = useUserContext();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [confirmInvalid, setConfirmInvalid] = useState(false);
  const [errors, setErrors] = useState({});
  const [isModal, setIsModal] = useState(false);

  const onClose = () => {
    setIsModal(false);
  };

  const regex = /\S{8,10}/;

  const validate = (e) => {
    const { value, name } = e.target;

    const newErrors = {};
    if (name === 'password') {
      if (value.length > 10) {
        e.target.value = value.slice(0, 10);
      }
      if (!regex.test(value)) {
        newErrors.password = '! 8-10자 사이로 공백없이 입력해주세요';
        setPasswordInvalid(true);
      }
      setPassword(e.target.value);
    }
    if (name === 'confirm') {
      if (value.length > 10) {
        e.target.value = value.slice(0, 10);
      }
      if (password !== e.target.value) {
        newErrors.confirm = '! 비밀번호와 일치하지 않습니다.';
        setConfirmInvalid(true);
      }
    }

    setErrors(newErrors);
    !newErrors.password && setPasswordInvalid(false);
    !newErrors.confirm && setConfirmInvalid(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password && !passwordInvalid && !confirmInvalid) {
      onChangePassword(password);
      setIsModal(true);
    }
  };
  return (
    <PageWrapper header prev complete onComplete={handleSubmit}>
      <UserContainer>
        <UserInfo>
          <Text
            style={{
              marginTop: 5,
              marginLeft: 20,
              textAlign: 'left',
            }}
            fontWeight={500}
            fontSize={26}
            block={true}
          >
            비밀번호를 설정해주세요
          </Text>
          <UserEditForm>
            <Input
              label="변경할 비밀번호"
              style={{ marginTop: 5 }}
              type="password"
              name="password"
              inValid={passwordInvalid}
              onChange={validate}
            ></Input>
            {errors.password ? (
              <ErrorText>{errors.password}</ErrorText>
            ) : (
              <ErrorText style={{ color: theme.color.fontNormal }}>
                * 8-10자 사이로 공백없이 입력해주세요
              </ErrorText>
            )}
            <Input
              label="비밀번호 확인"
              style={{ marginTop: 20 }}
              type="password"
              name="confirm"
              inValid={confirmInvalid}
              onChange={validate}
            ></Input>
            {errors.confirm && <ErrorText>{errors.confirm}</ErrorText>}
          </UserEditForm>
        </UserInfo>
        {isModal && (
          <Modal visible={isModal} onClose={onClose}>
            <Modal.Content title={MODAL_CHANGE_PASSWORD_TITLE} onClose={onClose} />
            <Modal.Button
              onClick={() => {
                onClose();
                navigate(-1);
              }}
            >
              확인
            </Modal.Button>
          </Modal>
        )}
      </UserContainer>
    </PageWrapper>
  );
};

export default MyInfoEditPage;

const UserContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: white;
`;

const UserInfo = styled.div`
  text-align: center;
  margin: 50px auto 0 auto;
  position: relative;
`;

const UserEditForm = styled.form`
  margin: 10px 5px 0 5px;
  padding: 22px 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 20px 0 0 0;
  padding-bottom: 90px;
`;

const ErrorText = styled.span`
  text-align: left;
  margin-top: 10px;
  margin-left: 10px;
  font-size: 14px;
  color: ${theme.color.mainRed};
`;
