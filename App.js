import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


export default function App() {

  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);


  const apiKey = '65de52db8f41f792491013daxa1d575';
  const apiKeyGoogle = 'AIzaSyBD4pUkRctbeG-1sYhEGit_ceJCo6ihx7o';


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoordinates({ latitude, longitude });
    })();
  }, []);

  const handleSearch = async () => {
    try {
      //GEOCODE
      const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${apiKey}`);
      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        const { lat, lon } = result;
        console.log('sijainti', lat, lon);
        const latitudeValue = parseFloat(lat);
        const longitudeValue = parseFloat(lon);
        setCoordinates({ latitude: latitudeValue, longitude: longitudeValue });


        
        // Hae ravintolat läheltä annettuja koordinaatteja
        //GOOGLE; TARVITAAN SIIS GOOGLELLE OMA API KEY
        const restaurantsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitudeValue},${longitudeValue}&radius=1000&type=restaurant&key=${apiKeyGoogle}`
        );
        const restaurantsData = await restaurantsResponse.json();
        console.log(restaurantsData)
        setRestaurants(restaurantsData.results);

      } else {
        console.error('Ei tuloksia');
      }
    } catch (error) {
      console.error('Virhe osoitteen haussa:', error);
    }

    
  };

  return (
    <View style={styles.container}>
    {coordinates && (
        <MapView
          style={{width:400, height:600}}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          }}
          >
          <Marker
            coordinate={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            }}
            title="Hakutulos"
          />

           {/* Ravintolat */}
           {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.place_id}
              coordinate={{
                latitude: restaurant.geometry.location.lat,
                longitude: restaurant.geometry.location.lng,
              }}
              title={restaurant.name}
              description={restaurant.vicinity}
            />
          ))}

        </MapView>
      )}

<TextInput
      style={styles.input}
      placeholder="Syötä osoite"
      value={address}
      onChangeText={(text) => setAddress(text)}
    />
    <Button title="Hae" onPress={handleSearch} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    width: '100%',
  },
});
