import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5A3C8',
  },
  header: {
    marginTop: 30,
    marginBottom: 0,
    backgroundColor: '#ED0D92',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 0,
    backgroundColor: '#ED0D92',
    flexDirection: 'row',
    position: 'absolute', left: 0, bottom: 0, right: 0
  },
  title: {
    fontFamily: 'Agbalumo',
    color: '#fff',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: '#F5A3C8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 150
  },
  scoreboard: {
    backgroundColor:'#F5A3C8',
    paddingTop: 25,
    paddingBottom: 25
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 25,
    marginTop: 10
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 15,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#E9CA01",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color:"#2B2B52",
    fontSize: 20
  },
  home: {
    alignItems:'center',
    backgroundColor: '#F5A3C8',
    width: 'auto',
    height: 'auto',
    paddingBottom: 500,
    paddingTop: 100
  },
  guide: {
    alignItems:'center',
    backgroundColor: '#F5A3C8',
    paddingTop: 50,
    paddingBottom: 150
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 0,
    textAlign:'center',
    width: 150
  },
  resetButton: {
    flexDirection: "row",
    padding: 5,
    marginBottom: 50,
    backgroundColor: "#73CED6",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'right',
  },
  data: {
    marginRight: 15
  },
  scorebutton: {
    flexDirection: "row",
    alignSelf: 'center',
    padding: 15,
    marginBottom: 500,
    backgroundColor: "#73CED6",
    width: 200,
    borderRadius: 15,
    justifyContent: 'center',
  },
  points: {
    textAlign: 'center',
    fontFamily: 'serif'
  },
  label: {
    fontFamily: 'Agbalumo'
  },
  systemtext: {
    fontFamily: 'serif'
  }
});