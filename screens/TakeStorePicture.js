import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, NativeBaseProvider, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, View, Image, PermissionsAndroid, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

const TakeStorePictureScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [locationInfo, setLocationInfo] = React.useState("");
    const [showBtn, setShowBtn] = React.useState("");

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true);
            AsyncStorage.getItem('language').then(val => {
                if (val != null) {
                    setLanguage(val);
                    i18n
                        .changeLanguage(val)
                        .then(() => console.log(val))
                        .catch(err => console.log(err));
                } else {
                    i18n
                        .changeLanguage(currentLanguage)
                        .then(() => console.log())
                        .catch(err => console.log());
                }
            });
            AsyncStorage.getItem('userToken').then(val => {
                if (val != null) {
                    setColorTheme(JSON.parse(val).info.theme_color);
                    Events.publish('colorTheme', val.info.theme_color);
                }
            });
            getAllData();
        });
        return unsubscribe;
    }, []);

    const getAllData = () => {
        if (Platform.OS === 'ios') {
            const auth = Geolocation.requestAuthorization("whenInUse");
            if (auth === "granted") {
                // do something if granted...
            }
        }

        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
        }

        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/check_location_image_info`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("check_location_image_info:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLocationInfo(responseJson.have_location_info);
                            setShowBtn(responseJson.show_button);
                            setLoading(false);
                        } else {
                            Toast.show({ description: responseJson.message });
                            setTimeout(function () {
                                setLoading(false);
                                if (responseJson.message == "Session is expired") {
                                    AsyncStorage.clear();
                                    navigation.navigate('Welcome');
                                }
                            }, 1000);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        //console.log("check_location_image_info Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onTakeImage = () => {
        setLoading(true);
        launchCamera(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 1500,
                maxWidth: 1500,
            },
            (response) => {
                //console.log(response.assets);
                if (response.assets != undefined) {
                    if (PermissionsAndroid.RESULTS.GRANTED === "granted") {
                        Geolocation.getCurrentPosition(
                            (position) => {
                                console.log(position);
                                onStoreLocation(position.coords.latitude, position.coords.longitude, position.coords.accuracy, response.assets[0].base64);
                            },
                            (error) => {
                                // See error code charts below.
                                console.log(error.code, error.message);
                            },
                            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                        );
                    }
                }
            },
        )
    }

    const onStoreLocation = (latitude, longitude, accuracy, storeImage) => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("locationImage", storeImage);
                formdata.append("locationLat", latitude);
                formdata.append("locationLong", longitude);
                formdata.append("accuracy", accuracy);
                fetch(`${BASE_URL}/store_location_info`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("store_location_info:", responseJson);
                        if (responseJson.bstatus == 1) {
                            Alert.alert(
                                responseJson.status,
                                responseJson.message,
                                [
                                    {
                                        text: t("Ok"), onPress: () => {
                                            navigation.goBack();
                                        }
                                    }
                                ],
                            );
                            setLoading(false);
                            /* setTimeout(function () {
                                setLoading(false);
                                navigation.goBack();
                            }, 1000); */
                        } else {
                            Toast.show({ description: responseJson.message });
                            setTimeout(function () {
                                setLoading(false);
                                if (responseJson.message == "Session is expired") {
                                    AsyncStorage.clear();
                                    navigation.navigate('Welcome');
                                }
                            }, 1000);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.log("store_location_info Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    return (
        <NativeBaseProvider>
            <StatusBar barStyle="light-content" backgroundColor={colorTheme.normal} />
            <Box flex={1} bg={"#ffffff"}>
                <HStack style={{ height: 60 }} bg={colorTheme.normal} justifyContent="space-between" alignItems="center" paddingX="4" paddingY="3" space={2}>
                    <HStack alignItems={'center'} space={8}>
                        {locationInfo == 0 ?
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <Icon name="menu" size={28} color="#ffffff" />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="chevron-back" size={28} color="#ffffff" />
                            </TouchableOpacity>
                        }
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Shop Image & Location")}</Text>
                    </HStack>
                </HStack>
                <VStack space={5} flex={1} padding={5} justifyContent={'center'} alignItems={'center'}>
                    <Image source={require('../assets/images/storeimage.png')} style={{ width: '90%', height: 350, objectFit: 'contain' }} />
                    <Button disabled={showBtn != "yes"} style={[styles.custbtn, { opacity: showBtn == "yes" ? 1 : 0.6 }]} backgroundColor={"#42bb52"} onPress={() => onTakeImage()} marginY={2}>
                        <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Get Location Image")}</Text>
                    </Button>
                    <Text fontSize="xs" color="#666666" textAlign={'center'} paddingX={10}>**{t("You must have to allow the permissions for GPS and Camera - GPS will be used to plot your outlet on Google map")}</Text>
                    <Text fontSize="xs" color="#666666" textAlign={'center'} paddingX={10}>**{t("Dealer shop image to have Dealer Shop Name clearly visible in the image")}</Text>
                </VStack>
            </Box>
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
        </NativeBaseProvider>

    )
}

const styles = StyleSheet.create({
    custbtn: { width: '90%', borderRadius: 30, overflow: 'hidden', height: 48 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default TakeStorePictureScreen;
