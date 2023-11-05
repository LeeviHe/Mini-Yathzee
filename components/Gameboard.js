import { Pressable, Text, View } from "react-native";
import Header from './Header'
import Footer from './Footer'
import styles from '../style/style'
import { useEffect, useState, useSyncExternalStore } from "react";
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS, BONUS_POINTS_LIMIT, SCOREBOARD_KEY} from "../constants/Game";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Container, Row, Col} from "react-native-flex-grid";
import AsyncStorage from '@react-native-async-storage/async-storage'

let board = []

export default Gameboard = ( { navigation, route } ) => {

    const [playerName, setPlayerName] = useState('')
    const [NbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
    const [status, setStatus] = useState('Throw dices')
    const [bonusStatus, setBonusStatus] = useState('Bonus points will earned at ' + BONUS_POINTS_LIMIT + ' points')

    const [gameEndStatus, setGameEndStatus] = useState(false)
    const [bonusAchieved, setBonusAchieved] = useState(false)

    // Mitkä nopat ovat kiinnitetty
    const [selectedDices, setSelectedDices] = 
        useState(new Array(NBR_OF_DICES).fill(false))
    // Noppien silmäluvut
    const [diceSpots, setDiceSpots] = 
        useState(new Array(NBR_OF_DICES).fill(0))
    // Onko silmäluvulle valittu pisteet
    const [selectedDicePoints, setSelectedDicePoints] = 
        useState(new Array(MAX_SPOT).fill(false))
    // Kerätyt pisteet
    const [dicePointsTotal, setDicePointsTotal] = 
        useState(new Array(MAX_SPOT).fill(0))
    //Tulostaulun pisteet
    const [scores, setScores] = useState([])
    //Total points
    const [totalPoints, setTotalPoints] = useState(0)
    const [totalWithBonus, setTotalWithBonus] = useState(0)

    useEffect (() => {
        setPlayerName('')
    }, [route.params.player])

    useEffect (() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player)
            restartGame()
        }
    }, [playerName])

    useEffect (() => {
        const unsubsribe = navigation.addListener('focus', () => {
            getScoreboardData()
        })
        return unsubsribe
    }, [navigation])

    useEffect (() => {
        checkBonusPoints()
    }, [totalPoints, gameEndStatus])



    const dicesRow = []
    for ( let dice = 0 ; dice < NBR_OF_DICES; dice++) {
        dicesRow.push(
            <Col  key={"dice" + dice}>
                <Pressable 
                    key={"dice" + dice}
                    onPress={() => selectDice(dice)}>
                        <MaterialCommunityIcons
                            name={board[dice]}
                            key={"dice" + dice}
                            size={50}
                            color={getDiceColor(dice)}>
                        </MaterialCommunityIcons>
                </Pressable>
            </Col>
        )
    }

    const pointsRow = []
    for ( let spot = 0 ; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col  key={"pointsRow" + spot}>
                <Text style={styles.points} key={"pointsRow" + spot}>{getSpotTotal(spot)}</Text>
            </Col>
        )
    }

    const pointsToSelectRow = []
    for ( let diceButton = 0 ; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable
                    key={"buttonsRow" + diceButton}
                    onPress={() => selectDicePoints(diceButton)}
                    >
                        <MaterialCommunityIcons
                            style={styles.points}
                            name={"numeric-" + (diceButton + 1 + "-circle")}
                            key={"buttonsRow" + diceButton}
                            size={35}
                            color={getDicePointsColor(diceButton)}
                            >
                        </MaterialCommunityIcons>
                </Pressable>
            </Col>
        )
    }

    const selectDice = (i) => {
        if (NbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices]
            dices[i] = selectedDices[i] ? false : true
            setSelectedDices(dices)
        }
        else {
            setStatus('You have to throw dices first.')
        }
    }

    const selectDicePoints = async(i) => {
        if (NbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints]
            let points = [...dicePointsTotal]
            if (!selectedPoints[i]) {
                selectedPoints[i] = true
                let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0)
                points[i] = nbrOfDices * (i + 1)  
            } else {
                setStatus('You already selected points for ' + (i + 1))
                return points [i]
            }
            setDicePointsTotal(points)
            setSelectedDicePoints(selectedPoints)
            setNbrOfThrowsLeft(NBR_OF_THROWS)
            selectedDices.fill(false)
            setTotalPoints(totalPoints + points[i])
            setStatus('New round! Throw dices to continue.')
            if (selectedPoints.every(x => x === true)) {
                setStatus('Game over. All points have been selected')
                setGameEndStatus(true)
                setNbrOfThrowsLeft(0)
            }
            checkBonusPoints()
            return points[i]  
        }
        else {
            setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points')
        }
    }

    const savePlayerPoints = async() => {
        const newKey = scores.length + 1
        const date = new Date()
        const playerPoints = {
            key: newKey,
            name: playerName,
            date: date.toLocaleDateString(),
            time:  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            points: totalWithBonus
        }
        if (gameEndStatus) {
            try {
                const newScore = [...scores, playerPoints]
                const jsonValue = JSON.stringify(newScore)
                
                await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue)
                alert('Points saved!')
            }
            catch (e) {
                console.log('Save error: ' + e)
            }
        } else (
            alert('Game still ongoing. Finish the game to save points.')
        )
    }

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

    const throwDices = () => {
        if (NbrOfThrowsLeft === 0 && !gameEndStatus) {
            setStatus('Select your points before the next throw')
            return 1;
        }
        else if (NbrOfThrowsLeft === 0 && gameEndStatus === true) {
            setStatus('Game over. All points have been selected.')
            return 1
        }
        let spots = [...diceSpots]
        for ( let i= 0; i < NBR_OF_DICES ; i++ ) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1)
                board[i] = 'dice-' + randomNumber
                spots[i] = randomNumber
            }
        }
        setNbrOfThrowsLeft(NbrOfThrowsLeft-1)
        setDiceSpots(spots)
        setStatus('Select and throw dices again')
    }

    function checkBonusPoints() {
        let points = totalPoints
        let calc = Number(BONUS_POINTS_LIMIT)-Number(points)
        if (totalPoints >= BONUS_POINTS_LIMIT && !gameEndStatus) {
            setBonusStatus('You have achieved bonus points! (50) They will be added at the end of the game.')
            setBonusAchieved(true)
        } else if (totalPoints >= BONUS_POINTS_LIMIT && gameEndStatus) {
            setBonusStatus('You have achieved bonus points! (50) They have been added to your total points!')
            setBonusAchieved(true)
            setTotalWithBonus(totalPoints + BONUS_POINTS)
        } else if (!bonusAchieved && !gameEndStatus){
           setBonusStatus('You are ' + calc + ' points away from bonus points (50)' )
        } else if (!bonusAchieved && gameEndStatus) {
            setBonusStatus('You did not reach any bonus points.')
            setTotalWithBonus(totalPoints)
        }
        
    }

    function restartGame() {
        if (gameEndStatus) {
            setGameEndStatus(false)
            setBonusAchieved(false)
            setTotalPoints(0)
            setTotalWithBonus(0)
            setBonusStatus('Bonus points will earned at ' + BONUS_POINTS_LIMIT + ' points')
            setStatus('Throw dices')
            setNbrOfThrowsLeft(NBR_OF_THROWS)
            diceSpots.fill(0)
            dicePointsTotal.fill(0)
            selectedDicePoints.fill(false)
        } else if (!gameEndStatus && playerName === '') {
            setGameEndStatus(false)
            setBonusAchieved(false)
            setTotalPoints(0)
            setTotalWithBonus(0)
            setBonusStatus('Bonus points will earned at ' + BONUS_POINTS_LIMIT + ' points')
            setStatus('Throw dices')
            setNbrOfThrowsLeft(NBR_OF_THROWS)
            diceSpots.fill(0)
            dicePointsTotal.fill(0)
            selectedDicePoints.fill(false)
        }
        else {
            alert('Game still ongoing!')
        }
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i]
    }
    function getDiceColor(i) {
        return selectedDices[i] ? "#0E000A" : '#ED0D92'
    }

    function getDicePointsColor(i) {
        return selectedDicePoints[i] ? "#0E000A" : '#ED0D92'
    }
    return (
        <>
            <Header/>
            <View style={styles.gameboard}>
                <Text style={styles.systemtext}>{status}</Text>
                <Container fluid>
                    <Row>{dicesRow}</Row>
                </Container>
                <Text style={styles.systemtext}>Throws left: {NbrOfThrowsLeft}</Text>
                <Pressable
                    style={styles.button}
                    onPress={() => throwDices()}>
                    <Text style={styles.label}>THROW DICES</Text>
                </Pressable>
                <Container fluid>
                    <Row>{pointsRow}</Row>
                </Container>
                <Container fluid>
                    <Row>{pointsToSelectRow}</Row>
                </Container>
                {bonusAchieved && gameEndStatus ? <Text style={styles.systemtext}>Total: {totalWithBonus}</Text> : <Text style={styles.systemtext}>Total: {totalPoints}</Text>}
                <Text style={styles.systemtext}>{bonusStatus}</Text>
                <Pressable
                    style={styles.button}
                    onPress= {() => savePlayerPoints()}>
                        <Text style={styles.label}>SAVE POINTS</Text>
                </Pressable>
                <Pressable
                    style={styles.resetButton}
                    onPress={() => restartGame()}>
                    <Text style={styles.label}>Restart game</Text> 
                </Pressable>
                <MaterialCommunityIcons name={'cat'} size={50} color={'#ED0D92'}/>
                <Text style={styles.label}>Player: {playerName}</Text>
            </View>
            <Footer/>
        </>
    )
}