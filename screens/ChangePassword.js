import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, Input, NativeBaseProvider, ScrollView, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, StatusBar, View, Keyboard, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL, CONTACT_HIER_ID, ORG_ID, PROGRAM_ID } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const ChangePasswordScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [oldPass, setOldPass] = React.useState("");
    const [newPass, setNewPass] = React.useState("");
    const [cnfNewPass, setCnfNewPass] = React.useState("");

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
        setLoading(false);
    }

    const onRequest = () => {
        Keyboard.dismiss();
        if (oldPass.trim() == "") {
            Toast.show({ description: t("Please enter Old Password") });
        } else if (newPass.trim() == "") {
            Toast.show({ description: t("Please enter New Password") });
        } else if (cnfNewPass.trim() == "") {
            Toast.show({ description: t("Please enter Confirm New Password") });
        } else if (newPass != cnfNewPass) {
            Toast.show({ description: t("New Password and Confirm New Password not Matched") });
        } else {
            setLoading(true);
            AsyncStorage.getItem('userToken').then(val => {
                if (val != null) {
                    let formdata = new FormData();
                    formdata.append("old_password", oldPass);
                    formdata.append("new_password", newPass);
                    formdata.append("confirm_password", cnfNewPass);
                    formdata.append("token", JSON.parse(val).token);
                    formdata.append("APIkey", `${API_KEY}`);
                    formdata.append("orgId", JSON.parse(val).org_id);
                    fetch(`${BASE_URL}/changepassword`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formdata
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            //console.log("Change Pass Request:", responseJson);
                            if (responseJson.bstatus == 1) {
                                Toast.show({ description: responseJson.message });
                                setTimeout(function () {
                                    setLoading(false);
                                    navigation.goBack();
                                }, 1000);
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
                            //console.log("Change Pass Request Error:", error);
                            Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                        });
                } else {
                    setLoading(false);
                    AsyncStorage.clear();
                    navigation.navigate('Welcome');
                }
            });
        }
    }

    return (
        <NativeBaseProvider>
            <StatusBar barStyle="light-content" backgroundColor={colorTheme.normal} />
            <Box flex={1} bg={"#ffffff"}>
                <HStack style={{ height: 60 }} bg={colorTheme.normal} justifyContent="space-between" alignItems="center" paddingX="4" paddingY="3" space={2}>
                    <HStack alignItems={'center'} space={8}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="chevron-back" size={28} color="#ffffff" />
                        </TouchableOpacity>
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Change Password")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <VStack style={{ paddingVertical: 50, paddingHorizontal: 30 }} alignItems="center" justifyContent="center">
                            <Stack space={3} style={{ width: '100%', marginBottom: 30 }}>
                                <View style={styles.inputbox}>
                                    <Input size="lg" type="password" onChangeText={(text) => setOldPass(text)} variant="unstyled" InputLeftElement={<Icon name="key-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Old Password") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" type="password" onChangeText={(text) => setNewPass(text)} variant="unstyled" InputLeftElement={<Icon name="key-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("New Password") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" type="password" onChangeText={(text) => setCnfNewPass(text)} variant="unstyled" InputLeftElement={<Icon name="key-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Confirm New Password") + " *"} />
                                </View>
                            </Stack>
                            <Button style={styles.custbtn} backgroundColor={colorTheme.dark} onPress={() => onRequest()} marginY={2}>
                                <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Save")}</Text>
                            </Button>
                        </VStack>
                    </Box>
                </ScrollView>
            </Box>
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
        </NativeBaseProvider >
    )
}

const styles = StyleSheet.create({
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { width: '100%', borderRadius: 30, overflow: 'hidden', height: 48 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default ChangePasswordScreen;
