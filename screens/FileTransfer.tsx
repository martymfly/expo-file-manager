import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { io, Socket } from 'socket.io-client';

import { useAppSelector } from '../hooks/reduxHooks';
import {
  fileItem,
  fileRequestMessage,
  newFileTransfer,
  newFolderRequest,
} from '../types';

import { base64reg, SIZE } from '../utils/Constants';
import { MaterialIcons } from '@expo/vector-icons';

const FileTransfer: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [socket, setSocket] = useState<Socket>(io());
  const [socketURL, setSocketURL] = useState('');
  const [roomID, setRoomID] = useState('1234');
  const [_, setState] = useState(false);
  const fileChunk = React.useRef('');

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
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    socket.on('connected', (data) => {
      console.log(data);
    });
  }, [socket]);

  const handleScan = ({ _, data }) => {
    setScanned(true);
    setSocketURL(data);
  };

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
      const baseDir =
        msg.basedir === 'docdir'
          ? FileSystem.documentDirectory
          : FileSystem.cacheDirectory;
      const path = baseDir + msg.path;
      FileSystem.readAsStringAsync(path, {
        encoding: 'base64',
      })
        .then((file) => {
          transferChunks(file, 1024 * 300, file.length, socket);
        })
        .catch((err) => console.log(err));
    });

    socket.on('newfolder', (msg: newFolderRequest) => {
      const newFolderURI =
        FileSystem.documentDirectory + '/' + msg.path + '/' + msg.name;
      FileSystem.getInfoAsync(newFolderURI).then((res) => {
        if (!res.exists) {
          FileSystem.makeDirectoryAsync(newFolderURI);
        }
      });
    });

    socket.on('sendfile', (msg: newFileTransfer) => {
      fileChunk.current += msg.file;
      if (msg.file.length === msg.size) {
        const base64Data = fileChunk.current.replace(base64reg, '');
        const newFilePath =
          FileSystem.documentDirectory + '/' + msg.path + '/' + msg.name;
        FileSystem.getInfoAsync(newFilePath).then((res) => {
          if (!res.exists) {
            FileSystem.writeAsStringAsync(newFilePath, base64Data, {
              encoding: 'base64',
            });
          }
        });
        fileChunk.current = '';
      }
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
      {!scanned && hasPermission && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleScan}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'Poppins_400Regular',
              }}
            >
              Socket Status:
            </Text>
          </View>
          <View style={styles.rowRight}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'Poppins_400Regular',
              }}
            >
              {socket.connected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'Poppins_400Regular',
              }}
            >
              Socket URL:
            </Text>
          </View>
          <View style={styles.rowRight}>
            <TextInput
              style={[
                styles.roomInput,
                {
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontFamily: 'Poppins_400Regular',
                },
              ]}
              onChangeText={setSocketURL}
              value={socketURL}
            />
            <TouchableOpacity
              style={styles.scanIcon}
              onPress={() => setScanned((prev) => !prev)}
            >
              <MaterialIcons
                name="qr-code-scanner"
                size={36}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'Poppins_400Regular',
              }}
            >
              Room ID:
            </Text>
          </View>
          <View style={styles.rowRight}>
            <TextInput
              style={[
                styles.roomInput,
                {
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontFamily: 'Poppins_400Regular',
                },
              ]}
              onChangeText={setRoomID}
              value={roomID}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'Poppins_400Regular',
              }}
            >
              Socket ID:
            </Text>
          </View>
          <View style={styles.rowRight}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'Poppins_400Regular',
              }}
            >
              {socket.id}
            </Text>
          </View>
        </View>

        <Button title="Join Room" onPress={joinRoom} />
        <Button title="Connect" onPress={connectServer} />
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
  row: {
    width: SIZE,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  rowLeft: {
    width: '30%',
    height: 40,
    padding: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  rowRight: {
    width: '70%',
    height: 40,
    padding: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  roomInput: {
    height: 40,
    width: SIZE * 0.65,
    borderBottomWidth: 0.5,
    padding: 5,
  },
  roomIDContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scanIcon: {
    position: 'absolute',
    right: 20,
  },
});

export default FileTransfer;
