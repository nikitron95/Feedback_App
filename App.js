import { useState, useEffect } from "react"
import { Text, View, StyleSheet, Button, Alert, TextInput } from "react-native"
import { BarCodeScanner } from "expo-barcode-scanner"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from "expo-linking"

const restaurants = {
  1: "Restuarant Movie Bar",
  2: "Restaurant Bal's Take Away",
}

// Dummy QuestionPage Component
function Feedback({ route, navigation }) {
  // Assume you're getting the ID from the route, which you'll use to fetch or display questions
  const { id } = route.params
  // Holen Sie den Restaurant-Namen basierend auf der ID
  const restaurantName = restaurants[id] || "Unbekanntes Restaurant"
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [food, setFood] = useState("")
  const [rating, setRating] = useState("")
  const [serviceComment, setServiceComment] = useState("")

  // Zur Überprüfung ob es gesendet wurde und gespeichert hat
  const handleSubmit = () => {
    console.log("Feedback gesendet:")
    console.log("Name:", name)
    console.log("Alter:", age)
    console.log("Gegessenes Essen:", food)
    console.log("Bewertung:", rating)
    console.log("Service-Kommentare:", serviceComment)
    Alert.alert("Feedback gesendet", "Vielen Dank für Ihr Feedback!")
  }

  return (
    // Your question component here
    <View style={styles.container}>
      <Text style={styles.restaurantName}>{restaurantName}</Text>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ihren Namen eingeben"
        />
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Alter:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Ihr Alter eingeben"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Gegessenes Essen:</Text>
        <TextInput
          style={styles.input}
          value={food}
          onChangeText={setFood}
          placeholder="Was haben Sie gegessen?"
        />
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Bewertung (1-10):</Text>
        <TextInput
          style={styles.input}
          value={rating}
          onChangeText={(text) => {
            const num = parseInt(text, 10)
            if (num >= 1 && num <= 10) {
              setRating(text)
            } else if (text === "") {
              setRating("")
            }
          }} // Ermöglicht nur Zahlen von 1 bis 9
          placeholder="Bewertung"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Service-Kommentare:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]} // Erhöhen der Höhe für das mehrzeilige TextInput
          value={serviceComment}
          onChangeText={setServiceComment}
          placeholder="Ihre Kommentare zum Service"
          multiline
        />
      </View>
      <Button title="Feedback senden" onPress={handleSubmit} />
    </View>
  )
}

const Stack = createStackNavigator()

function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  const handleBarCodeScanned = ({ type, data }) => {
    // Assuming the QR data is a URL with a pattern like "myapp://questions?id=123"
    let match = Linking.parse(data)
    console.log(match, data)

    if (
      match.scheme === "myapp" &&
      // match.path === "questions" &&
      match.queryParams.id
    ) {
      navigation.navigate("Feedback", { id: match.queryParams.id })
    } else {
      Alert.alert("QR Code does not contain valid data")
    }
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Scanner">
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Feedback" component={Feedback} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50, // Etwas Abstand von der oberen Kante
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    width: "80%", // 80% der Containerbreite
  },
  tableCell: {
    fontSize: 18,
  },
  input: {
    borderBottomWidth: 1, // Fügt eine Unterstreichung hinzu
    flex: 1, // Ermöglicht es, den verfügbaren Platz innerhalb der tableRow zu füllen
    marginLeft: 10, // Fügt einen kleinen Abstand nach links hinzu
    paddingVertical: 5, // Ein bisschen vertikaler Padding
  },
})
