import { StatusBar } from 'expo-status-bar';
import React from 'react';

import Move from './component/move';

//request permission to use bluetooth

//we are going to show in our app all the bluetooths devices that are available

export default function App() {
  return (
    <Move />
  );
}

