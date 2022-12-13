import React, { useEffect, useRef, useState } from 'react';

import Dialog from 'react-native-dialog';
import { TextInput } from 'react-native-gesture-handler';

import { useAppSelector } from '../../hooks/reduxHooks';

type NewFolderDialogProps = {
  visible: boolean;
  createDirectory: (name: string) => void;
  setFolderDialogVisible: (visible: boolean) => void;
};

export const NewFolderDialog = ({
  visible,
  createDirectory,
  setFolderDialogVisible,
}: NewFolderDialogProps) => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [folderName, setFolderName] = useState('');
  const newFolderInputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        newFolderInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  return (
    <Dialog.Container
      contentStyle={{ backgroundColor: colors.background2 }}
      visible={visible}
    >
      <Dialog.Title style={{ color: colors.primary }}>
        Add New Folder
      </Dialog.Title>
      <Dialog.Input
        textInputRef={newFolderInputRef}
        style={{ color: colors.primary }}
        onChangeText={(text) => setFolderName(text)}
      ></Dialog.Input>
      <Dialog.Button
        label="Cancel"
        onPress={() => setFolderDialogVisible(false)}
      />
      <Dialog.Button
        label="OK"
        onPress={() => {
          createDirectory(folderName);
          setFolderName('');
        }}
      />
    </Dialog.Container>
  );
};
