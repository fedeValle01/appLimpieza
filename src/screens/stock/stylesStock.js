import { StyleSheet } from "react-native";

const stylesStock = StyleSheet.create({
    textPrice: {
        fontSize: 13,
        lineHeight: 21,
        fontStyle: 'italic',
        letterSpacing: 0.25,
        color: "#606060",
    },
    viewItem: {
        padding: 5,
        marginVertical: 4,
        marginHorizontal: 16,
    },
    input: {
        height: 30,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200
        },
    inputMultiline: {
        height: 150,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200,
        alignContent: 'flex-start',
        textAlignVertical: 'top'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
export default stylesStock;