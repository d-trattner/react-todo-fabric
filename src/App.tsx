import React from 'react';
import './App.css';

import Core from './components/Core'

export default class App extends React.Component<{}, {}> {

  public render(): JSX.Element {
    return (
      <Core></Core>
    );
  }
}
