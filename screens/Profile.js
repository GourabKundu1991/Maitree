import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actionsheet, Avatar, Box, HStack, NativeBaseProvider, Stack, Text, Toast, VStack, useDisclose } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const ProfileScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [profileDetails, setProfileDetails] = React.useState("");
    const [profilePic, setProfilePic] = React.useState("");
    const [pointDetails, setPointDetails] = React.useState("");

    const { isOpen, onOpen, onClose } = useDisclose();

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
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/profile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Profile:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setProfileDetails(responseJson.profile);
                            setProfilePic(responseJson.profile.BaseUrl + responseJson.profile.profile_pic);
                            setPointDetails(responseJson.points);
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
                        //console.log("Profile Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }


    const openProfilePicker = (type) => {
        onClose();
        if (type == "library") {
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    includeBase64: true,
                    maxHeight: 1500,
                    maxWidth: 1500,
                },
                (response) => {
                    //console.log(response);
                    if (response.assets != undefined) {
                        saveProfileImage(response.assets[0].base64);
                    }
                },
            )
        } else if (type == "camera") {
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
                        saveProfileImage(response.assets[0].base64);
                    }
                },
            )
        }
    }

    const saveProfileImage = (imageBase) => {
        setLoading(true);
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("profileimage", imageBase);
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/change_profile_image`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.log("Profile Pic:", responseJson);
                        if (responseJson.bstatus == 1) {
                            Toast.show({ description: responseJson.message });
                            getAllData();
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
                        //console.log("Profile Pic Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Login');
            }
        });
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Profile")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box bg={colorTheme.normal} style={{ paddingBottom: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' }}>
                        <VStack mt="4" justifyContent="center" alignItems="center">
                            <Text color="#ffffff" fontSize="xl" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.firstName} {profileDetails.lastName}</Text>
                            <Text color="#eeeeee" fontSize="md" textAlign="center" fontWeight="medium" textTransform="capitalize">( {profileDetails.mobile} )</Text>
                            <Box position="relative" marginY={2}>
                                <Avatar style={styles.avatar} w={110} h={110} source={profilePic ? { uri: profilePic } : require('../assets/images/avatar.png')}></Avatar>
                                <TouchableOpacity style={[styles.avatarCamera, { backgroundColor: "#000000" }]} onPress={onOpen}>
                                    <Icon name="camera" size={24} color="#ffffff" />
                                </TouchableOpacity>
                                <Actionsheet isOpen={isOpen} onClose={onClose}>
                                    <Actionsheet.Content>
                                        <Text color="#666666" fontSize="md" textAlign="center">{t("Select Image Source")}</Text>
                                        <Actionsheet.Item onPress={() => openProfilePicker("library")}>{t("Load from Library")}</Actionsheet.Item>
                                        <Actionsheet.Item onPress={() => openProfilePicker("camera")}>{t("Use Camera")}</Actionsheet.Item>
                                        <Actionsheet.Item onPress={() => openProfilePicker("cancel")}>{t("Cancel")}</Actionsheet.Item>
                                    </Actionsheet.Content>
                                </Actionsheet>
                            </Box>
                            <VStack alignItems="center" w="100%" space={2} mb={5}>
                                <Stack borderWidth={1} borderColor="#ffffff" borderRadius={30} w="70%" padding="1" overflow="hidden">
                                    <Text color="#eeeeee" fontSize="sm" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Available for Redemption")}</Text>
                                    <Text color="#ffffff" fontSize="lg" textAlign="center" fontWeight="bold" textTransform="capitalize">{pointDetails != "" ? pointDetails.available_point : 0}</Text>
                                </Stack>
                            </VStack>
                        </VStack>
                    </Box>
                    <VStack paddingX={10} paddingY={6}>
                        <TouchableOpacity style={styles.listview} onPress={() => navigation.navigate('ProfileDetails')}>
                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                <Text color="#111111" fontSize="md" textAlign="center" fontWeight="medium">{t("Profile Details")}</Text>
                                <Icon name="chevron-forward" size={26} color="#999999" />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listview} onPress={() => navigation.navigate('PointStatement')}>
                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                <Text color="#111111" fontSize="md" textAlign="center" fontWeight="medium">{t("Point Statement")}</Text>
                                <Icon name="chevron-forward" size={26} color="#999999" />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listview} onPress={() => navigation.navigate('From16List')}>
                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                <Text color="#111111" fontSize="md" textAlign="center" fontWeight="medium">{t("TDS Certificate")}</Text>
                                <Icon name="chevron-forward" size={26} color="#999999" />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listview} onPress={() => navigation.navigate('GiftVouchers')}>
                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                <Text color="#111111" fontSize="md" textAlign="center" fontWeight="medium">{t("Gift Vouchers")}</Text>
                                <Icon name="chevron-forward" size={26} color="#999999" />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listview} onPress={() => navigation.navigate('ChangePassword')}>
                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                <Text color="#111111" fontSize="md" textAlign="center" fontWeight="medium">{t("Change Password")}</Text>
                                <Icon name="chevron-forward" size={26} color="#999999" />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listview} onPress={() => navigation.navigate('Language')}>
                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                <Text color="#111111" fontSize="md" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Language Change")}</Text>
                                <Icon name="chevron-forward" size={26} color="#999999" />
                            </HStack>
                        </TouchableOpacity>
                    </VStack>
                </ScrollView>
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
    avatar: { elevation: 10, marginVertical: 20, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 10, borderColor: "#ffffff", borderWidth: 4, backgroundColor: '#ffffff' },
    avatarCamera: { position: 'absolute', bottom: 18, right: 0, width: 38, height: 38, borderRadius: 40, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    listview: { marginVertical: 6, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#ffffff', borderRadius: 30, overflow: 'hidden', borderColor: '#cccccc', borderWidth: 2 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default ProfileScreen;
