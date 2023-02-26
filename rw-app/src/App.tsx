import React from 'react';
import MainMenu from './MainMenu';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './AppInsights';

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <MainMenu />
    );
  }
}

export default withAITracking(reactPlugin, App);
