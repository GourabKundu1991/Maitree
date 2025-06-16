import { Button, HStack, Input, NativeBaseProvider, ScrollView, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, ImageBackground, Keyboard, Platform, Pressable, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, APP_VERSION, BASE_URL, OS_TYPE } from '../auth_provider/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import i18n from '../assets/language/i18n';

const LoginScreen = ({ navigation }) => {

    const { t } = useTranslation();

    const [loading, setLoading] = React.useState(false);

    const [show, setShow] = React.useState(false);

    const handleClick = () => setShow(!show);

    const [username, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [serverToken, setServerToken] = React.useState("");
    const [currentLanguage, setLanguage] = React.useState('Eng');

    useEffect(() => {
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
        getServerKey();
    }, []);

    async function getServerKey() {
        let fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log("login token:", fcmToken);
            setServerToken(fcmToken);
            setLoading(false);
        }
    }

    const onLogin = () => {
        Keyboard.dismiss();
        if (username.trim() == '') {
            Toast.show({ description: t("Please enter Username") });
        } else if (password == '') {
            Toast.show({ description: t("Please enter Password") });
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("userName", username);
            formdata.append("passwd", password);
            formdata.append("APIkey", `${API_KEY}`);
            formdata.append("app_ver", `${APP_VERSION}`);
            formdata.append("os_type", `${OS_TYPE}`);
            formdata.append("language_code", currentLanguage);
            formdata.append("device_token", serverToken);
            console.log(formdata);
            fetch(`${BASE_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    console.log("Login:", responseJson);
                    if (responseJson.bstatus == 1) {
                        Toast.show({ description: t("Successfully Login..") });
                        AsyncStorage.setItem('userToken', JSON.stringify(responseJson));
                        navigation.replace('Home');
                    } else {
                        Toast.show({ description: responseJson.message });
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log("Login Error:", error);
                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                });
        }
    }

    const goOtp = () => {
        navigation.replace('Otp');
    }

    return (
        <NativeBaseProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <ImageBackground source={require('../assets/images/bg.jpg')} imageStyle={{ resizeMode: 'cover', top: 0, left: 0 }} style={styles.bgimage}>
                <HStack style={{ height: 70 }} justifyContent="space-between" alignItems="center" paddingX="4" paddingY="3" space={2}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 60 }}>
                        <Icon name="chevron-back" size={26} color="#ffffff" />
                    </TouchableOpacity>
                </HStack>
                <VStack flex={1} alignItems="center" justifyContent="center">
                    <View style={styles.fromContainer}>
                        <ImageBackground source={require('../assets/images/whitebg.png')} imageStyle={{ resizeMode: 'cover', top: 0, left: 0 }} style={styles.mainContainer}>
                            <ScrollView>
                                <VStack style={{ paddingVertical: 50, paddingHorizontal: 30 }} alignItems="center" justifyContent="center">
                                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                                    <Text my={2} fontSize="lg" fontWeight="bold" color="#222222" style={{ textTransform: 'uppercase' }}>{t("Login")}</Text>
                                    <Text textAlign="center" fontSize="sm" fontWeight="normal" color="#888888" mb={2}>{t("Please enter Username and Password to login farther continue")}...</Text>
                                    <Stack space={3} style={{ width: '100%', marginVertical: 20 }}>
                                        <View style={styles.inputbox}>
                                            <Input size="lg" onChangeText={(text) => setUserName(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#f04e23" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Username") + " *"} />
                                        </View>
                                        <View style={styles.inputbox}>
                                            <Input size="lg" onChangeText={(text) => setPassword(text)} type={show ? "text" : "password"} variant="unstyled" InputLeftElement={<Icon name="lock-closed-outline" size={20} color="#f04e23" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Password") + " *"} InputRightElement={<Icon name={show ? "eye-outline" : "eye-off-outline"} size={20} color="#000000" style={{ width: 25, textAlign: 'center', marginRight: 10 }} onPress={handleClick} />} />
                                        </View>
                                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => navigation.navigate('ForgotPass')}>
                                            <Text color="#666666" fontSize="sm" fontWeight="bold">{t("Forgot Password")}?</Text>
                                        </TouchableOpacity>
                                    </Stack>
                                    <Button style={styles.custbtn} backgroundColor={"#42bb52"} onPress={() => onLogin()} marginY={2}>
                                        <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Login")}</Text>
                                    </Button>
                                </VStack>
                            </ScrollView>
                        </ImageBackground>
                    </View>
                </VStack>
                <VStack style={{ height: 90 }} justifyContent={"center"} alignItems={"center"}>
                    <Text fontSize="sm" fontWeight="bold" color="#999999">{t("Login with Phone Number")}</Text>
                    <Pressable onPress={() => goOtp()}><Text fontSize="lg" fontWeight="bold" color="#ed2f42">{t("Login with OTP")}</Text></Pressable>
                </VStack>
            </ImageBackground>
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
    logo: { width: 150, height: 150, resizeMode: 'contain', marginVertical: 20 },
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { width: '100%', borderRadius: 30, overflow: 'hidden', height: 48 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default LoginScreen;