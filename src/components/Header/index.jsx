import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Icon, Text, FixedContainer } from 'components';
import theme from 'styles/theme';
import { memo, useEffect } from 'react';
import Badge from 'components/basic/Badge';
import useLocalToken from 'hooks/useLocalToken';
import { useState } from 'react';
import { getNotifications } from 'utils/apis/userApi';

const { headerHeight, pagePadding } = theme.value;
const { borderLight } = theme.color;

const HeaderContainer = styled(FixedContainer)`
  border-bottom: 1px solid ${borderLight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${pagePadding};
`;

const Title = memo(styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
`);

const InnerRight = styled.div`
  position: absolute;
  top: 50%;
  right: ${pagePadding};
  transform: translateY(-50%);
  display: flex;

  & > * {
    margin-left: 20px;
  }
`;

export const Header = ({ prev, title, info, complete, onComplete }) => {
  const navigate = useNavigate();
  const [isSeen, setIsSeen] = useState(true);
  const onClickPrev = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer top height={headerHeight}>
      <div>{prev && <Icon.Button name="ARROW_LEFT" size={20} onClick={onClickPrev} />}</div>

      {title && <Title>{title}</Title>}

      <InnerRight>
        {info && (
          <>
            {
              <Badge dot={isSeen}>
                <Icon.Link to="/user/notification" name="NOTIFICATION" size={30} />
              </Badge>
            }
            <Icon.Link to="/user/myinfo" name="MY_INFO" size={30} />
          </>
        )}
        {complete && (
          <button onClick={onComplete}>
            <Text fontSize={20} fontWeight={500}>
              완료
            </Text>
          </button>
        )}
      </InnerRight>
    </HeaderContainer>
  );
};

export default Header;
