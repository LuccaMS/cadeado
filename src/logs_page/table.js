import React from 'react';
import { View, Text, StyleSheet,ScrollView } from 'react-native';

const TableRow = ({ datetime, state, smartphone_name }) => (
  <View style={styles.row}>
    <Text style={styles.cell}>{datetime}</Text>
    <Text style={styles.cell}>{state}</Text>
    <Text style={styles.cell}>{smartphone_name}</Text>
  </View>
);

const Table = ({ data }) => (
  //the user also should be able to scroll down the table
  <ScrollView>
  <View style={styles.table}>
    <View style={styles.header}>
      <Text style={styles.headerCell}>Date</Text>
      <Text style={styles.headerCell}>State</Text>
      <Text style={styles.headerCell}>Smartphone</Text>
    </View>
    {data.map((row, index) => (
      <TableRow key={index} {...row} />
    ))}
  </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#000',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#000',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#000',
  },
});

export default Table;