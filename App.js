import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';



export default function App() {

  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState(null);

  const apiKey = '65de52db8f41f792491013daxa1d575';

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${apiKey}`);
      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        const { lat, lon } = result;
        console.log('sijainti', lat, lon);
        const latitudeValue = parseFloat(lat);
        const longitudeValue = parseFloat(lon);
        setCoordinates({ latitude: latitudeValue, longitude: longitudeValue });
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
        </MapView>
      )}

<TextInput
      style={styles.input}
      placeholder="Syötä osoite"
      value={address}
      onChangeText={(text) => setAddress(text)}
    />
    <Button title="Hae koordinaatit" onPress={handleSearch} />
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
