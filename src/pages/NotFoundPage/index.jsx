import theme from 'styles/theme';
import styled from '@emotion/styled';
import { IMAGE_URLS } from 'utils/constants/images';
import { Image, Button, Text } from 'components';
import { Link } from 'react-router-dom';

const NotfoundWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${theme.color.backgroundGreen};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ContentWrapper = styled.div`
  width: 80%;
  height: 330px;
  background-color: ${theme.color.mainWhite};
  border-radius: 15px;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Title = styled(Text)`
  text-align: center;
  margin-top: 18px;
`;

const Description = styled(Text)`
  margin-top: 14px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  padding: 50px 40px;
`;

const NotFoundPage = () => {
  return (
    <>
      <NotfoundWrapper>
        <ContentWrapper>
          <Inner>
            <Image width={55} height={55} src={IMAGE_URLS.FLOWERPOT} />
            <Title block fontSize={26} strong>
              페이지를 찾을 수 없습니다.
            </Title>
            <Description block fontSize={16} color={theme.color.fontDark}>
              올바른 URL을 입력하였는지 확인해 주세요.
            </Description>
          </Inner>
          <Link to="/">
            <ButtonWrapper>
              <Button fontSize="18px" height="60px">
                홈으로 이동하기
              </Button>
            </ButtonWrapper>
          </Link>
        </ContentWrapper>
      </NotfoundWrapper>
    </>
  );
};

export default NotFoundPage;
