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
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useAppSelector } from '../hooks/reduxHooks';

import { SIZE } from '../utils/Constants';

type IActionSheetProps = {
  visible: boolean;
  onClose: (arg0: boolean) => void;
  actionItems: string[];
  title?: string;
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
          onItemPressed(index);
          onClose(false);
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
            <Text style={[styles.titleText, titleStyle]}>{title}</Text>
          </View>
        )}
        <FlatList
          data={actionItems}
          keyExtractor={(_, index) => index.toString()}
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
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    padding: 5,
  },
  titleContainer: {
    width: SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Poppins_500Medium',
    color: 'gray',
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
  },
  itemText: {
    fontFamily: 'Poppins_400Regular',
    color: 'gray',
    fontSize: 15,
  },
  iconContainer: {
    marginLeft: 5,
    marginRight: 10,
  },
});
