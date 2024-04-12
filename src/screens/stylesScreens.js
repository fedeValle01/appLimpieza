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
  scrollViewHome: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewRotation: {
    marginTop: 5,
    flexDirection: "row", 
    justifyContent: "space-between", 
    backgroundColor: "#f2f3f3", 
    padding: 8, 
    marginBottom: 4,
    borderRadius: 10,
  },
  titleRotation: {
    fontSize: 25,
    color: "#4044c9",
    marginBottom: 5
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
    paddingHorizontal: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#252850",
    margin: 3,
  },
  input: {
    height: 20,
    borderWidth: 1,
    border: '#aaa',
    padding: 5,
    width: 100
    },
  btnRight: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  circle: {
    alignSelf: "center",
    marginRight: -20
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
  viewSeccionColors: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#00fff6",
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  viewSeccion: {
    position: "relative",
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#00fff6",
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  item: {
    position: "relative",
    right: 0,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  navItem: {
    fontSize: 20
  },
  check: {
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    textAlign: "right",
  },
  pSector: {
    fontSize: 13,
    lineHeight: 21,
    fontStyle: 'italic',
    letterSpacing: 0.25,
    color: "#eef",
  },
  pActive: {
    fontSize: 13,
    lineHeight: 21,
    fontStyle: 'italic',
    letterSpacing: 0.25,
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
    maxWidth: '60%',
    marginRight: 70,
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
  input: {
    height: 150,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    alignContent: 'flex-start',
    textAlignVertical: 'top'
  },
  titleMain: {
    color: '#3e3944',
    fontSize: 32,
    fontWeight: '40',
    textAlign: 'center'
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
