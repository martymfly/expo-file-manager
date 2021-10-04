import React, { useState } from 'react';
import Dialog from 'react-native-dialog';
import { useAppSelector } from '../../hooks/reduxHooks';

type DownloadDialogProps = {
  visible: boolean;
  handleDownload: (name: string) => void;
  setDownloadDialog: (visible: boolean) => void;
};
export const DownloadDialog = ({
  visible,
  handleDownload,
  setDownloadDialog,
}: DownloadDialogProps) => {
  const [downloadUrl, setDownloadUrl] = useState('');
  const { colors } = useAppSelector((state) => state.theme.theme);
  return (
    <Dialog.Container
      contentStyle={{ backgroundColor: colors.background2 }}
      visible={visible}
    >
      <Dialog.Title style={{ color: colors.primary }}>
        Enter Download URL
      </Dialog.Title>
      <Dialog.Input
        style={{ color: colors.primary }}
        value={downloadUrl}
        onChangeText={(text) => setDownloadUrl(text)}
      ></Dialog.Input>
      <Dialog.Button
        label="Cancel"
        onPress={() => {
          setDownloadDialog(false);
          setDownloadUrl('');
        }}
      />
      <Dialog.Button
        label="OK"
        onPress={() => {
          handleDownload(downloadUrl);
          setDownloadDialog(false);
          setDownloadUrl('');
        }}
      />
    </Dialog.Container>
  );
};
