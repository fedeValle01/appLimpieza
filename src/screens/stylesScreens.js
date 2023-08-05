import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  viewHeader: {
    backgroundColor: "#3c3c3c",
    height: 40,
  },
  viewLogOut: {
    backgroundColor: "#3c3c3c",
    height: 40,
  },
  btnHeader: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  btnUsuario: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#252850",
    margin: 3,
  },
  btnRight: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  txtUser: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  dropdown: {
    backgroundColor: "white",
    borderBottomColor: "gray",
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
    flexDirection: "row",
    flex: 1,
  },
  viewSeccion: {
    marginTop: 3,
    flexDirection: "row",
    flex: 1,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#00fff6",
    marginBottom: 5,
    backgroundColor: "#9b9b9b",
  },
  item: {
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    fontSize: 18,
    height: 44,
  },

  check: {
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    textAlign: "right",
  },
  textHeader: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "440",
    alignContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
  },
  textLogOut: {
    color: "#c81d11",
    fontSize: 30,
    fontWeight: "600",
    alignContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    marginRight: 5,
  },
  textItem: {
    flex: 1,
    fontSize: 15,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
    width: "80%",
  },
  text: {
    fontSize: 42,
    textAlign: "center",
  },
  itemSectionlist: {
    padding: 5,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  viewTitleDate: {
    padding: 5,
    marginVertical: 4,
    marginHorizontal: 16,
    marginTop: 17,
  },
  titleDate: {
    fontSize: 25,
    color: "#111111",
    marginBottom: -15,
    textDecorationLine: "underline",
  },
  titleSectionlist: {
    fontSize: 19,
  },
  titleHeader: {
    fontSize: 40,
    fontWeight: "40",
    color: "#27a4f2",
  },
  subtitleSection: {
    fontSize: 25,
    fontWeight: "45",
    color: "#4b0081",
    textAlign: "center"
  },
  inHouseTitle: {
    fontSize: 25,
    backgroundColor: "#eeeeee",
    color: "#06132f",
    marginTop: 25,
  },
  SectionHeader: {
    fontSize: 25,
    backgroundColor: "#eeeeee",
    color: "#1f1f1f",
    marginTop: 25,
  },
});
export default styles;
