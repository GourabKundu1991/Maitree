import { Button, HStack, Input, NativeBaseProvider, ScrollView, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, ImageBackground, Keyboard, Platform, Pressable, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, APP_VERSION, BASE_URL, OS_TYPE } from '../auth_provider/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import i18n from '../assets/language/i18n';

const ForgotPassScreen = ({ navigation }) => {

    const { t } = useTranslation();

    const [loading, setLoading] = React.useState(false);

    const [show, setShow] = React.useState(false);

    const handleClick = () => setShow(!show);

    const [username, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [serverToken, setServerToken] = React.useState("");
    const [currentLanguage, setLanguage] = React.useState('Eng');

    useEffect(() => {
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
    }, []);

    const onSubmit = () => {
        Keyboard.dismiss();
        if (username.trim() == '') {
            Toast.show({ description: t("Please enter Username") });
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("user_name", username);
            formdata.append("APIkey", `${API_KEY}`);
            fetch(`${BASE_URL}/forgot_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    console.log("forgot_password:", responseJson);
                    if (responseJson.bstatus == 1) {
                        Toast.show({ description: responseJson.message });
                    } else {
                        Toast.show({ description: responseJson.message });
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log("forgot_password Error:", error);
                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                });
        }
    }

    const goLogin = () => {
        navigation.replace('Login');
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
                                    <Text my={2} fontSize="lg" fontWeight="bold" color="#222222" style={{ textTransform: 'uppercase' }}>{t("Forgot Password")}</Text>
                                    <Text textAlign="center" fontSize="sm" fontWeight="normal" color="#888888" mb={2}>{t("Please enter your Username, so we can help you recover your password")}...</Text>
                                    <Stack space={3} style={{ width: '100%', marginVertical: 20 }}>
                                        <View style={styles.inputbox}>
                                            <Input size="lg" onChangeText={(text) => setUserName(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#f04e23" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Username") + " *"} />
                                        </View>
                                    </Stack>
                                    <Button style={styles.custbtn} backgroundColor={"#42bb52"} onPress={() => onSubmit()} marginY={2}>
                                        <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Submit")}</Text>
                                    </Button>
                                </VStack>
                            </ScrollView>
                        </ImageBackground>
                    </View>
                </VStack>
                <VStack style={{ height: 90 }} justifyContent={"center"} alignItems={"center"}>
                    <Text fontSize="sm" fontWeight="bold" color="#999999">{t("Login with Username")}</Text>
                    <Pressable onPress={() => goLogin()}><Text fontSize="lg" fontWeight="bold" color="#ed2f42">{t("Username Login")}</Text></Pressable>
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

export default ForgotPassScreen;