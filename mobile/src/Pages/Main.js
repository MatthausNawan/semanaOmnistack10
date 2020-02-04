import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";

import api from "../services/api";
import { connect, disconnect } from "../services/socket";

const Main = ({ navigation }) => {
  const [devs, setDevs] = useState([]);
  const [currenRegion, setCurrentRegion] = useState(null);
  const [inputTechs, setInputTechs] = useState("");

  useEffect(() => {
    async function loadInicialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }
    loadInicialPosition();
  }, []);

  function setupWebSocket() {
    const { latitude, longitude } = currenRegion;
    connect(latitude, longitude, inputTechs);
  }

  async function loadDevs() {
    const { latitude, longitude } = currenRegion;
    console.log(inputTechs, latitude, longitude);
    const response = await api.get("/search", {
      params: {
        latitude,
        longitude,
        techs: inputTechs
      }
    });
    //console.log(response.data.devs);
    setDevs(response.data.devs);
    setupWebSocket();
  }

  function regionChangeHandle(region) {
    setCurrentRegion(region);
  }

  if (!currenRegion) {
    return null;
  }
  return (
    <>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por Techs"
          autoCapitalize="words"
          autoCorrect={false}
          value={inputTechs}
          onChangeText={setInputTechs}
        />
        <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <MapView
        onRegionChangeComplete={regionChangeHandle}
        initialRegion={currenRegion}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[1],
              longitude: dev.location.coordinates[0]
            }}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: dev.avatar_url
              }}
            ></Image>
            <Callout
              onPress={() => {
                navigation.navigate("Profile", {
                  github_username: dev.github_username
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}></Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#fff"
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: "bold",
    fontSize: 16
  },
  devBio: {
    color: "#666",
    marginTop: 5
  },
  devTechs: {
    marginTop: 4
  },
  searchForm: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row"
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: {
      height: 4,
      width: 4
    },
    elevation: 4
  },
  loadButton: {
    height: 50,
    width: 50,
    backgroundColor: "#8E4DFf",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});
export default Main;
