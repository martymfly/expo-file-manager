import React, { useState } from 'react';

import Dialog from 'react-native-dialog';

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
  return (
    <Dialog.Container
      contentStyle={{ backgroundColor: colors.background2 }}
      visible={visible}
    >
      <Dialog.Title style={{ color: colors.primary }}>
        Add New Folder
      </Dialog.Title>
      <Dialog.Input
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
