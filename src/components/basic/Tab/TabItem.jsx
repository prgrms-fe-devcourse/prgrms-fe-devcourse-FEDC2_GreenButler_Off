import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Text from '../Text';
import theme from 'styles/theme';

const { mainGreen, borderLight, fontBlack, fontNormal } = theme.color;

const TabItemWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  color: ${({ active }) => (active ? fontBlack : fontNormal)};
  border-bottom: 2px solid ${({ active }) => (active ? mainGreen : borderLight)};
  flex: 1;
  cursor: pointer;
`;

const TabItem = ({ title, active, onClick, ...props }) => {
  const fontStyle = {
    fontWeight: active ? 500 : 'normal',
  };
  return (
    <TabItemWrapper active={active} onClick={onClick} {...props}>
      <Text fontSize={20} block style={{ ...fontStyle }}>
        {title}
      </Text>
    </TabItemWrapper>
  );
};

TabItem.defaultProps = {
  __TYPE: 'Tab.Item',
};

TabItem.propTypes = {
  __TYPE: PropTypes.oneOf(['Tab.Item']),
};

export default TabItem;