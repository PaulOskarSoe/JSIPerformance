import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import {Colors} from '../../theme';

type architectures = 'jsi' | 'bridge';

type IArchtectureTabs = {
  onChange?: (val: architectures) => void;
};

const ArchitectureTabs: FC<IArchtectureTabs> = ({onChange}) => {
  const [architecture, setArchitecture] = useState<architectures>('jsi');

  return (
    <View style={styles.architecureTabs}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          onChange && onChange('jsi');
          setArchitecture('jsi');
        }}
        style={architecture === 'jsi' ? styles.activeTab : styles.tab}>
        <Text
          style={
            architecture === 'jsi' ? styles.activeTabText : styles.tabText
          }>
          JSI
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          onChange && onChange('bridge');
          setArchitecture('bridge');
        }}
        style={architecture === 'bridge' ? styles.activeTab : styles.tab}>
        <Text
          style={
            architecture === 'bridge' ? styles.activeTabText : styles.tabText
          }>
          BRIDGE
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ArchitectureTabs;

const styles = StyleSheet.create({
  architecureTabs: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  activeTab: {
    width: '50%',

    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    lineHeight: 30,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 30,
  },
  tab: {
    width: '50%',
    borderBottomWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
