import { Text, View, Pressable } from "react-native";
import Header from './Header'
import Footer from './Footer'
import styles from '../style/style'
import { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import { NBR_OF_SCOREBOARD, SCOREBOARD_KEY } from "../constants/Game";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default Scoreboard = ( { navigation } ) => {

    const [scores, setScores] = useState([])
    const [sortedScores, setSortedScores] = useState([])
    
    useEffect (() => {
        const unsubsribe = navigation.addListener('focus', () => {
            getScoreboardData()
        })
        return unsubsribe
    }, [navigation])

    useEffect (() => {
        setSortedScores(scores.sort((a, b) => b.points - a.points))
    }, [scores])


    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY)
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue)
                setScores(tmpScores)
            }
        }
        catch (e) {
            console.log('Read error: ' + e)
        }
    }

    const clearScoreboard = async() => {
        try {
            await AsyncStorage.clear()
            setScores([])
        }
        catch (e) {
            console.log('Clear error: ' + e)
        }
    }

    return (
        <>
            <Header/>
            <View style={styles.scoreboard}>
                <DataTable.Row>
                    <DataTable.Cell><Text></Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.label}>Name</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.label}>Date</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.label}>Time</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.label}>Points</Text></DataTable.Cell>
                </DataTable.Row>
                {   scores.length === 0 ? 
                    <Text style={styles.points}>Scoreboard is empty</Text>
                    :
                    sortedScores.map((player, index) => (
                        index < NBR_OF_SCOREBOARD && 
                        <DataTable.Row key={player.key}>
                            <DataTable.Cell><Text style={styles.systemtext}>{index + 1}.</Text></DataTable.Cell>
                            <DataTable.Cell><Text style={styles.systemtext}>{player.name}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.data}><Text style={styles.systemtext}>{player.date}</Text></DataTable.Cell>
                            <DataTable.Cell><Text style={styles.systemtext}>{player.time}</Text></DataTable.Cell>
                            <DataTable.Cell><Text style={styles.systemtext}>{player.points}</Text></DataTable.Cell>
                        </DataTable.Row>
                    ))
                } 
            </View>
            <View style={styles.scoreboard}>
                <Pressable
                style={styles.scorebutton}
                onPress={() => clearScoreboard()}>
                    <Text style={styles.label}>CLEAR SCOREBOARD</Text>
                </Pressable>
            </View>
            <Footer/>
        </>
    )
}