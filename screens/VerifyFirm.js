import { Box, Button, HStack, Input, NativeBaseProvider, ScrollView, Select, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, ImageBackground, Keyboard, Platform, Pressable, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, APP_VERSION, BASE_URL, OS_TYPE, } from '../auth_provider/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';
import i18n from '../assets/language/i18n';

const VerifyFirmScreen = ({ navigation }) => {

    const { t } = useTranslation();

    const [loading, setLoading] = React.useState(false);
    const [currentLanguage, setLanguage] = React.useState('Eng');

    const [sapCode, setSapCode] = React.useState("");

    useEffect(() => {
        AsyncStorage.getItem('language').then(val => {
            if (val != null) {
                setLanguage(val);
                i18n
                    .changeLanguage(val)
                    .then(() => setLoading(false))
                    .catch(err => console.log(err));
            } else {
                i18n
                    .changeLanguage(currentLanguage)
                    .then(() => console.log())
                    .catch(err => console.log());
            }
        });
    }, []);

    const onVerify = () => {
        Keyboard.dismiss();
        if (sapCode.trim() == '') {
            Toast.show({ description: t("Please enter SAP Code") });
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("APIkey", `${API_KEY}`);
            formdata.append("externalID", sapCode);
            fetch(`${BASE_URL}/verify_firm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    console.log("verify_firm:", responseJson);
                    if (responseJson.bstatus == 1) {
                        Toast.show({ description: responseJson.message });
                        AsyncStorage.setItem('firmData', JSON.stringify(responseJson));
                        navigation.replace('Registration');
                    } else {
                        Toast.show({ description: responseJson.message });
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    //console.log("verify_firm Error:", error);
                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                });
        }
    }

    const goLogin = () => {
        navigation.replace('Welcome');
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
                                    <VStack alignItems="center" justifyContent="center" style={{ width: '100%' }}>
                                        <Text my={2} fontSize="lg" fontWeight="bold" color="#222222" style={{ textTransform: 'uppercase' }}>{t("Verify Firm")}</Text>
                                        <Text textAlign="center" fontSize="sm" fontWeight="normal" color="#888888" mb={2}>{t("Please enter your registered SAP code. We need to verify your firm name")}...</Text>
                                        <Stack space={3} style={{ width: '100%', marginVertical: 20 }}>
                                            <View style={styles.inputbox}>
                                                <Input size="lg" onChangeText={(text) => setSapCode(text)} variant="unstyled" InputLeftElement={<Icon name="qr-code-outline" size={20} color="#f04e23" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Dealer SAP Code") + " *"} />
                                            </View>
                                            <Button style={styles.custbtn} backgroundColor={"#42bb52"} onPress={() => onVerify()} marginY={2}>
                                                <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Verify")}</Text>
                                            </Button>
                                        </Stack>
                                    </VStack>
                                </VStack>
                            </ScrollView>
                        </ImageBackground>
                    </View>
                </VStack>
                <VStack style={{ height: 90 }} justifyContent={"center"} alignItems={"center"}>
                    <Text fontSize="sm" fontWeight="bold" color="#999999">{t("Already have an account")}?</Text>
                    <Pressable onPress={() => goLogin()}><Text fontSize="lg" fontWeight="bold" color="#ed2f42">{t("Login Now")}</Text></Pressable>
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

export default VerifyFirmScreen;