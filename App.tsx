import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import Main from './screens/Main';
import { store } from './store';

LogBox.ignoreLogs(['componentWillMount', 'componentWillReceiveProps']);

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;
