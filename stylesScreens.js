import {StyleSheet} from 'react-native';

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },
        row: {
          flexDirection: 'row',
          flex: 1,
          padding: 15,
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
      item: {
          paddingHorizontal: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          fontSize: 18,
          height: 44,
      },
      itemRight: {
          paddingHorizontal: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: 10,
          fontSize: 18,
          height: 44,
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
        backgroundColor: '#F9F9F9',
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 16,
      },
      titleFlatlist: {
        fontSize: 24,
      },
        
      });
export default styles;
