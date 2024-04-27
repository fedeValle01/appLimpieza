import { StyleSheet } from "react-native";

const styleModal = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      titleDate: {
        fontSize: 30,
        color: "#efe",
        marginBottom: 20,
        textDecorationLine: "underline",
        textDecorationColor: "0f0",
      },
      modalView: {
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
      },
      button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#2196F3',
      },
      buttonControlStock: {
        backgroundColor: '#E4952B',
      },
      buttonClose: {
        backgroundColor: '#2196F3',
        paddingLeft: 30,
        paddingRight: 30
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
});
export default styleModal;