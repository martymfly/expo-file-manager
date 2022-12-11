import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import ImageGalleryView from '../screens/ImageGalleryView';
import MiscFileView from '../screens/MiscFileView';
import Browser from '../screens/Browser';
import VideoPlayer from '../screens/VideoPlayer';

type HomeStackParamList = {
  Browser: { folderName: string; prevDir: string };
  ImageGalleryView: { folderName: string; prevDir: string };
  VideoPlayer: { folderName: string; prevDir: string };
  MiscFileView: { folderName: string; prevDir: string };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Browser"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name="Browser"
        options={({ route }) => ({
          title: route?.params?.folderName || 'File Manager',
        })}
        component={Browser}
      />
      <HomeStack.Screen
        name="ImageGalleryView"
        options={({ route }) => ({
          title: route?.params?.prevDir.split('/').pop() || 'Gallery',
          presentation: 'transparentModal',
        })}
        component={ImageGalleryView}
      />
      <HomeStack.Screen
        name="VideoPlayer"
        options={({ route }) => ({
          title: route?.params?.prevDir.split('/').pop() || 'Video',
          presentation: 'transparentModal',
        })}
        component={VideoPlayer}
      />
      <HomeStack.Screen
        name="MiscFileView"
        options={({ route }) => ({
          title: route?.params?.prevDir.split('/').pop() || 'File View',
          presentation: 'transparentModal',
        })}
        component={MiscFileView}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
