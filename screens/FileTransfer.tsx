import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';

import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

import { io, Socket } from 'socket.io-client';

import { useAppSelector } from '../hooks/reduxHooks';
import { fileItem, fileRequestMessage } from '../types';

import { SIZE } from '../utils/Constants';

const FileTransfer: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [socket, setSocket] = useState<Socket>(io());
  const [socketURL, setSocketURL] = useState('http://localhost:3000');
  const [roomID, setRoomID] = useState('1234');
  const [state, setState] = useState(false);

  const connectServer = () => {
    if (!socket.connected) {
      const newSocket = io(socketURL);
      setSocket(newSocket);
      setTimeout(() => {
        setState((prev) => !prev);
      }, 500);
    }
  };

  useEffect(() => {
    return () => socket.close();
  }, []);

  useEffect(() => {
    socket.on('connected', (data) => {
      console.log(data);
    });
  }, [socket]);

  const joinRoom = () => {
    socket.emit('joinRoom', { room: roomID, device: 'phone' });
    socket.on('welcome', (msg) => {
      setState((prev) => !prev);
    });
    socket.on('request', (msg: fileRequestMessage) => {
      const baseDir =
        msg.basedir === 'docdir'
          ? FileSystem.documentDirectory
          : FileSystem.cacheDirectory;
      const path = baseDir + msg.path;
      FileSystem.readDirectoryAsync(path)
        .then((files) => {
          const filesProms = files.map((fileName) =>
            FileSystem.getInfoAsync(path + '/' + fileName)
          );
          Promise.all(filesProms).then((results) => {
            let tempfiles: fileItem[] = results.map((file) =>
              Object({
                ...file,
                name: file.uri.split('/').pop(),
                selected: false,
              })
            );
            socket.emit('respond', { path, files: tempfiles });
          });
        })
        .catch((err) => console.log(err));
    });

    socket.on('readfile', (msg: fileRequestMessage) => {
      console.log(msg);
      const baseDir =
        msg.basedir === 'docdir'
          ? FileSystem.documentDirectory
          : FileSystem.cacheDirectory;
      const path = baseDir + msg.path;
      FileSystem.readAsStringAsync(path, {
        encoding: 'base64',
      })
        .then((file) => {
          transferChunks(file, 1024 * 100, file.length, socket);
        })
        .catch((err) => console.log(err));
    });
  };

  const transferChunks = (
    data: string,
    bufferSize: number,
    totalSize: number,
    socket: Socket
  ) => {
    let chunk = data.slice(0, bufferSize);
    data = data.slice(bufferSize, data.length);
    socket.emit('respondfile', { file: chunk, size: totalSize });
    if (data.length !== 0) {
      transferChunks(data, bufferSize, totalSize, socket);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={{ color: colors.primary }}>
          Socket Status: {socket.connected ? 'Connected' : 'Disconnected'}
        </Text>
        <Text style={{ color: colors.primary }}>Socket URL: {socketURL}</Text>
        <Text style={{ color: colors.primary }}>Socket ID: {socket.id}</Text>
        <View style={styles.roomIDContainer}>
          <Text style={{ color: colors.primary }}>Room ID:</Text>
          <TextInput
            style={[
              styles.roomInput,
              { borderColor: colors.primary, color: colors.primary },
            ]}
            onChangeText={setRoomID}
            value={roomID}
          />
        </View>
        <Button title="Connect" onPress={connectServer} />
        <Button title="Join Room" onPress={joinRoom} />
        <Button
          title="Disconnect"
          onPress={() => {
            socket.close();
            setTimeout(() => {
              setState((prev) => !prev);
            }, 500);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    padding: 10,
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  roomInput: {
    height: 40,
    width: SIZE * 0.5,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  roomIDContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default FileTransfer;
