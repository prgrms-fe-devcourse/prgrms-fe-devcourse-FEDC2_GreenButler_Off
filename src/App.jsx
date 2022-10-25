import ContextProviders from 'contexts';
import DefaultTemplate from 'template/DefaultTemplate';
import Router from 'routes/Router';
import { SWRConfig } from 'swr';
import { swrOptions } from 'utils/apis/swrOptions';

const App = () => {
  return (
    <SWRConfig value={swrOptions}>
      <ContextProviders>
        <DefaultTemplate>
          <Router />
        </DefaultTemplate>
      </ContextProviders>
    </SWRConfig>
  );
};

export default App;
