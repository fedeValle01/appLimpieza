import {StyleSheet} from 'react-native';

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#cdcdcd',
          alignItems: 'center',
          justifyContent: 'center',

        },    
        dropdown: {
          backgroundColor: 'white',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.5,
          marginTop: 20,
          width: 250,
      },
      icon: {
          marginRight: 5,
          width: 18,
          height: 18,
      },
      row: {
        marginTop: 3,
        flexDirection: 'row',
        flex: 1,
      },
      item: {
          paddingHorizontal: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          fontSize: 18,
          height: 44,
      },
      
      check: {
          paddingHorizontal: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
          textAlign: 'right',
      },
      textItem: {
          flex: 1,
          fontSize: 16,
      },
      shadow: {
          shadowColor: '#000',
          shadowOffset: {
          width: 0,
          height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
      },
      scrollView: {
        
        backgroundColor: 'pink',
        marginHorizontal: 20,
        width: "80%",
      },
      text: {
        fontSize: 42,
        textAlign: 'center',
      },
      itemFlatlist: {
        width: 250,
        backgroundColor: '#ffa500',
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 16,

      },
      titleFlatlist: {
        fontSize: 19,
        color: "2b2b2b",
      },
      titleHeader: {
        fontSize: 40,
        fontWeight: '40',
        color : "#27a4f2",

      },
      subtitleSection: {
        fontSize: 25,
        fontWeight: '45',
        color: "#4b0081",
      },
      SectionHeader: {
        fontSize: 25,
        backgroundColor: "#cdcdcd",
        color: "#1f1f1f",
        marginTop: 25,
      },
      
      });
export default styles;