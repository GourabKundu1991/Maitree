import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, NativeBaseProvider, ScrollView, Select, Stack, Text, VStack, View ,} from 'native-base';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, ImageBackground, Linking, Platform, Pressable, StatusBar, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { API_KEY, OS_TYPE, APP_VERSION, BASE_URL } from '../auth_provider/Config';
import i18n from '../assets/language/i18n';

const WelcomeScreen = ({ navigation }) => {

    const [loading, setLoading] = React.useState(false);

    const { t } = useTranslation();
    const [languageList, SetLanguageList] = React.useState([
        { "name": "English", "language_code": "Eng" },
        { "name": "Hindi", "language_code": "Hn" },
        { "name": "Bengali", "language_code": "Bn" },
        { "name": "Odia", "language_code": "Od" }
    ]);
    const [currentLanguage, setLanguage] = React.useState('Eng');

    const [versionFound, setVersionFound] = React.useState(false);
    const [storeUrl, setStoreUrl] = React.useState("");

    useEffect(() => {
        setLoading(true);
        let formdata = new FormData();
        formdata.append("APIkey", `${API_KEY}`);
        formdata.append("app_ver", `${APP_VERSION}`);
        formdata.append("os_type", `${OS_TYPE}`);
        fetch(`${BASE_URL}/app_version_check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formdata
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Version Check:", responseJson);
                setLoading(false);
                if (responseJson.version_details.update_available == 0) {
                    AsyncStorage.getItem('userToken').then(val => {
                        if (val != null) {
                            navigation.replace('Home');
                        }
                    });
                } else {
                    AsyncStorage.clear();
                    setStoreUrl(responseJson.version_details.store_url);
                    setVersionFound(true);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log("Version Check Error:", error);
            });

        AsyncStorage.getItem('language').then(val => {
            if (val != null) {
                setLanguage(val);
                i18n
                    .changeLanguage(val)
                    .then(() => console.log(val))
                    .catch(err => console.log(err));
            } else {
                i18n
                    .changeLanguage("Eng")
                    .then(() => console.log())
                    .catch(err => console.log());
            }
        });
    }, []);

    const onSaveLang = (langval) => {
        setLanguage(langval);
        AsyncStorage.setItem('language', langval);
        i18n
            .changeLanguage(langval)
            .then(() => setLoading(true))
            .catch(err => console.log(err));
        setTimeout(function () {
            setLoading(false);
        }, 500);
    }

    const onContinue = () => {
        Linking.openURL(storeUrl);
    }

    const goLogin = () => {
        navigation.navigate('Login');
    }

    const goOtp = () => {
        navigation.navigate('Otp');
    }

    const goRegistration = () => {
        navigation.navigate('VerifyFirm');
    }

    return (

        <NativeBaseProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <ImageBackground source={require('../assets/images/bg.jpg')} imageStyle={{ resizeMode: 'cover', top: 0, left: 0 }} style={styles.bgimage}>
                <HStack style={{ height: 70 }} justifyContent="space-between" alignItems="center" paddingX="4" paddingY="3" space={2}></HStack>
                <VStack flex={1} alignItems="center" justifyContent="center">
                    <View style={styles.fromContainer}>
                        <ImageBackground source={require('../assets/images/whitebg.png')} imageStyle={{ resizeMode: 'cover', top: 0, left: 0 }} style={styles.mainContainer}>
                            <ScrollView>
                                <VStack style={{ paddingVertical: 50, paddingHorizontal: 30 }} alignItems="center" justifyContent="center">
                                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                                    <Text mb={2} fontSize="lg" fontWeight="bold" color="#666666">{t("Select Language")}</Text>
                                    <Stack space={3} style={{ width: '100%', marginTop: 5, marginBottom: 30 }}>
                                        <View style={styles.inputbox}>
                                            <Select variant="none" size="lg"
                                                InputLeftElement={<Image source={require('../assets/images/language.png')} style={{ width: 22, objectFit: 'contain', marginLeft: 15, textAlign: 'center' }} />}
                                                selectedValue={currentLanguage}
                                                onValueChange={value => onSaveLang(value)}
                                                style={{ paddingLeft: 20, height: 48 }}
                                                _selectedItem={{
                                                    backgroundColor: '#eeeeee',
                                                    endIcon: <Icon name="checkmark-circle" size={20} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                                }}>
                                                {languageList.map((item, index) =>
                                                    <Select.Item key={index} label={item.name} value={item.language_code} />
                                                )}
                                            </Select>
                                        </View>
                                    </Stack>
                                    {/* <Button style={styles.custbtn} backgroundColor={"#42bb52"} onPress={() => goLogin()} marginY={2}>
                                        <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Login with Username")}</Text>
                                    </Button>
                                    <Text fontSize="sm" fontWeight="normal" color="#999999">{t("Or Continue With")}</Text> */}
                                    <Button style={styles.custbtn} backgroundColor={"#ed2f42"} onPress={() => goOtp()} marginY={2}>
                                        <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Continue")}</Text>
                                    </Button>
                                </VStack>
                            </ScrollView>
                        </ImageBackground>
                    </View>
                </VStack>
                <VStack style={{ height: 90 }} justifyContent={"center"} alignItems={"center"}>
                    <Text fontSize="sm" fontWeight="bold" color="#999999">{t("Don't have an account?")}</Text>
                    <Pressable onPress={() => goRegistration()}><Text fontSize="lg" fontWeight="bold" color="#ed2f42">{t("New Dealer Registration")}</Text></Pressable>
                </VStack>
            </ImageBackground>
            {versionFound && (
                <View style={styles.spincontainer}>
                    <LinearGradient
                        colors={['#ffffff', '#cccccc']}
                        start={{ x: 0.5, y: 0 }}
                        style={{ width: 280, borderRadius: 15, overflow: 'hidden' }}
                    >
                        <VStack space={1} w="100%" paddingY="10" paddingX="5" alignItems="center" justifyContent="center">
                            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                            <Text mt={5} mb={3} fontSize="xl" fontWeight="bold" color="#111111">{t("Update Warning")}!</Text>
                            <Text textAlign="center" fontSize="sm" fontWeight="medium" color="#111111" mb={3}>{t("App need Update to the Latest Version. Please click on Update Now button to Continue")}...</Text>
                            <Button size="sm" backgroundColor={"#ed2f42"} style={{ width: 180, borderRadius: 30, overflow: 'hidden' }} onPress={() => onContinue()} marginY={4}>
                                <Text color="#ffffff" fontSize="md" fontWeight="medium">{t("Update Now")}</Text>
                            </Button>
                        </VStack>
                    </LinearGradient>
                </View>
            )}
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    bgimage: { flex: 1 },
    fromContainer: { width: '80%', backgroundColor: '#ffffff', borderRadius: 30, overflow: 'hidden', borderColor: '#dddddd', borderWidth: 1, borderTopWidth: 0, elevation: 10, shadowColor: '#777777', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 10 },
    mainContainer: { width: '100%', justifyContent: 'center', alignItems: 'center' },
    logo: { width: 180, height: 180, resizeMode: 'contain', marginVertical: 20 },
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { width: '100%', borderRadius: 30, overflow: 'hidden', height: 48 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default WelcomeScreen;