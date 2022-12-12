import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  TextStyle,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useAppSelector } from '../hooks/reduxHooks';

import { SIZE } from '../utils/Constants';

type IActionSheetProps = {
  visible: boolean;
  onClose: (arg0: boolean) => void;
  actionItems: string[];
  title?: string;
  numberOfLinesTitle: number;
  cancelButtonIndex?: number;
  modalStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  titleStyle?: TextStyle;
  itemIcons: React.ComponentProps<typeof MaterialIcons>['name'][];
  onItemPressed: (arg0: number) => void;
};

type IActionListItemProps = {
  item: string;
  index: number;
};

const ActionSheet = ({
  visible,
  onClose,
  actionItems,
  title,
  numberOfLinesTitle,
  cancelButtonIndex,
  modalStyle,
  itemStyle,
  itemTextStyle,
  titleStyle,
  itemIcons,
  onItemPressed,
}: IActionSheetProps) => {
  const ActionListItem = ({ item, index }: IActionListItemProps) => {
    const { colors } = useAppSelector((state) => state.theme.theme);
    return (
      <TouchableOpacity
        style={[styles.itemStyle, itemStyle]}
        onPress={() => {
          onClose(false);
          if (Platform.OS === 'ios') {
            setTimeout(() => {
              onItemPressed(index);
            }, 1000);
          } else {
            onItemPressed(index);
          }
        }}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={itemIcons[index]}
            size={24}
            color={index === cancelButtonIndex ? '#ff453a' : colors.secondary}
          />
        </View>
        <Text
          style={[
            styles.itemText,
            itemTextStyle,
            cancelButtonIndex &&
              cancelButtonIndex === index && { color: '#ff453a' },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          onClose(false);
        }}
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={[styles.modalBody, modalStyle]}>
        {title && (
          <View style={styles.titleContainer}>
            <Text
              style={[styles.titleText, titleStyle]}
              ellipsizeMode="middle"
              numberOfLines={numberOfLinesTitle}
            >
              {title}
            </Text>
          </View>
        )}
        <FlatList
          data={actionItems}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <ActionListItem item={item} index={index} />
          )}
        />
      </View>
    </Modal>
  );
};

export default ActionSheet;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBody: {
    width: SIZE,
    position: 'absolute',
    bottom: 0,
    borderRadius: 10,
  },
  titleContainer: {
    width: SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  titleText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  itemStyle: {
    width: SIZE,
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  itemText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
  },
  iconContainer: {
    marginRight: 10,
  },
});
