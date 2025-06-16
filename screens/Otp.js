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

const OtpScreen = ({ navigation }) => {

    const { t } = useTranslation();

    const [loading, setLoading] = React.useState(false);

    const [phoneNum, setPhoneNum] = React.useState('');
    const [otp, setOtp] = React.useState('');

    const [otpVerification, setOtpVerification] = React.useState(false);
    const [currentLanguage, setLanguage] = React.useState('Eng');

    const [orgId, setOrgId] = React.useState('');
    const [orgPop, setOrgPop] = React.useState(false);
    const [orgList, setOrgList] = React.useState([]);

    const [serverToken, setServerToken] = React.useState("");

    useEffect(() => {
        setLoading(true);
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
        getServerKey();
    }, []);

    async function getServerKey() {
        let fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log("login token:", fcmToken);
            setServerToken(fcmToken);
        }
        setLoading(false);
    }

    const sendOtp = () => {
        Keyboard.dismiss()
        if (phoneNum.trim() == '') {
            Toast.show({ description: t("Please enter Phone Number") });
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("mobileNumber", phoneNum);
            formdata.append("APIkey", `${API_KEY}`);
            formdata.append("orgId", orgId);
            fetch(`${BASE_URL}/get_login_otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    console.log("Get OTP:", responseJson);
                    if (responseJson.bstatus == 1) {
                        setOtpVerification(true);
                        setOrgId(responseJson.orgId);
                        if (responseJson.otp != "") {
                            setOtp(Number(responseJson.otp));
                        }
                        /* if (responseJson.status_code == 'duplicate') {
                            setOrgList(responseJson.org_list);
                            setOrgPop(true);
                        } else {
                            
                        } */
                        Toast.show({ description: responseJson.message });
                    } else {
                        Toast.show({ description: responseJson.message });
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log("OTP Error:", error);
                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                });
        }
    }

    const onVerify = () => {
        Keyboard.dismiss();
        if (otp == '') {
            Toast.show({ description: t("Please enter OTP Number") });
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("mobileNumber", phoneNum);
            formdata.append("APIkey", `${API_KEY}`);
            formdata.append("orgId", orgId);
            formdata.append("otpVal", otp);
            formdata.append("app_ver", `${APP_VERSION}`);
            formdata.append("os_type", `${OS_TYPE}`);
            formdata.append("language_code", currentLanguage);
            formdata.append("device_token", serverToken);
            fetch(`${BASE_URL}/validate_login_otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    //console.log("Verify OTP:", responseJson);
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
                    console.log("Verify OTP Error:", error);
                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                });
        }
    }

    const goLogin = () => {
        navigation.replace('Login');
    }

    const onContinue = () => {
        if (orgId == '') {
            Toast.show({ description: t("Please select Organization") });
        } else {
            setOrgPop(false);
            onVerify();
        }
    }

    const goRegistration = () => {
        navigation.navigate('VerifyFirm');
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
                                    {!otpVerification ?
                                        <VStack alignItems="center" justifyContent="center" style={{ width: '100%' }}>
                                            <Text my={2} fontSize="lg" fontWeight="bold" color="#222222" style={{ textTransform: 'uppercase' }}>{t("OTP Login")}</Text>
                                            <Text textAlign="center" fontSize="sm" fontWeight="normal" color="#888888" mb={2}>{t("Please enter your Registered Phone Number to farther continue")}...</Text>
                                            <Stack space={3} style={{ width: '100%', marginVertical: 20 }}>
                                                <View style={styles.inputbox}>
                                                    <Input size="lg" keyboardType='number-pad' maxLength={10} onChangeText={(text) => setPhoneNum(text)} variant="unstyled" InputLeftElement={<Icon name="phone-portrait-outline" size={20} color="#f04e23" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Phone Number") + " *"} />
                                                </View>
                                                <Button style={styles.custbtn} backgroundColor={"#42bb52"} onPress={() => sendOtp()} marginY={2}>
                                                    <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Continue")}</Text>
                                                </Button>
                                            </Stack>
                                        </VStack>
                                        :
                                        <VStack alignItems="center" justifyContent="center" style={{ width: '100%' }}>
                                            <Text my={2} fontSize="lg" fontWeight="bold" color="#222222" style={{ textTransform: 'uppercase' }}>{t("Verify OTP")}</Text>
                                            <Text textAlign="center" fontSize="sm" fontWeight="normal" color="#888888" mb={2}>{t("Enter OTP code from the phone we just sent you")}...</Text>
                                            <Stack space={3} style={{ width: '100%', marginVertical: 20 }}>
                                                <View style={styles.inputbox}>
                                                    <Input size="lg" onChangeText={(text) => setOtp(text)} value={otp.toString()} keyboardType='number-pad' maxLength={6} variant="unstyled" InputLeftElement={<Icon name="key-outline" size={20} color="#f04e23" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Enter OTP") + " *"} />
                                                </View>
                                                <Button style={styles.custbtn} backgroundColor={"#42bb52"} onPress={() => onVerify()}>
                                                    <Text color="#ffffff" fontSize="md" fontWeight="medium">{t("Verify OTP")}</Text>
                                                </Button>
                                                <TouchableOpacity style={{ alignSelf: 'center', marginVertical: 5 }} onPress={() => sendOtp()}>
                                                    <Text color="#f04e23" fontSize="md" fontWeight="bold" textAlign="center">{t("Resend OTP")}?</Text>
                                                </TouchableOpacity>
                                            </Stack>
                                        </VStack>
                                    }
                                </VStack>
                            </ScrollView>
                        </ImageBackground>
                    </View>
                </VStack>
                {/* <VStack style={{ height: 90 }} justifyContent={"center"} alignItems={"center"}>
                    <Text fontSize="sm" fontWeight="bold" color="#999999">{t("Login with Username")}</Text>
                    <Pressable onPress={() => goLogin()}><Text fontSize="lg" fontWeight="bold" color="#ed2f42">{t("Username Login")}</Text></Pressable>
                </VStack> */}
                <VStack style={{ height: 90 }} justifyContent={"center"} alignItems={"center"}>
                    <Text fontSize="sm" fontWeight="bold" color="#999999">{t("Don't have an account?")}</Text>
                    <Pressable onPress={() => goRegistration()}><Text fontSize="lg" fontWeight="bold" color="#ed2f42">{t("New Dealer Registration")}</Text></Pressable>
                </VStack>
            </ImageBackground>
            {orgPop && (
                <View style={styles.spincontainer}>
                    <LinearGradient
                        colors={['#ffffff', '#cccccc']}
                        start={{ x: 0.5, y: 0 }}
                        style={{ width: 280, borderRadius: 15, overflow: 'hidden' }}
                    >
                        <VStack space={1} w="100%" paddingY="10" paddingX="5" alignItems="center" justifyContent="center">
                            <Text mt={5} mb={3} fontSize="xl" fontWeight="bold" color="#111111">{t("Organization")}!</Text>
                            <Text textAlign="center" fontSize="sm" fontWeight="medium" color="#111111" mb={3}>{t("Please Select Organization and click on Continue")}...</Text>
                            <View style={styles.inputbox}>
                                <Select variant="none" size="lg"
                                    placeholder="Select Organization *"
                                    selectedValue={orgId}
                                    onValueChange={value => setOrgId(value)}
                                    style={{ paddingLeft: 20, height: 48 }}
                                    _selectedItem={{
                                        backgroundColor: '#eeeeee',
                                        endIcon: <Icon name="checkmark-circle" size={20} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                    }}>
                                    {orgList.map((item, index) =>
                                        <Select.Item key={index} label={item.org_name} value={item.org_id} />
                                    )}
                                </Select>
                            </View>
                            <Button size="sm" backgroundColor={"#111111"} style={{ width: 180, borderRadius: 30, overflow: 'hidden' }} onPress={() => onContinue()} marginY={4}>
                                <Text color="#ffffff" fontSize="md" fontWeight="medium">{t("Continue")}</Text>
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
    logo: { width: 150, height: 150, resizeMode: 'contain', marginVertical: 20 },
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { width: '100%', borderRadius: 30, overflow: 'hidden', height: 48 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default OtpScreen;