import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, NativeBaseProvider, Pressable, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const ProfileDetailsScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [profileDetails, setProfileDetails] = React.useState("");
    const [aadhaarDetails, setAadhaarDetails] = React.useState("");
    const [aadhaarFront, setAadhaarFront] = React.useState("");
    const [aadhaarBack, setAadhaarBack] = React.useState("");
    const [panDetails, setPanDetails] = React.useState("");
    const [panImage, setPanImage] = React.useState("");
    const [gstDetails, setGstDetails] = React.useState("");
    const [gstImage, setGstImage] = React.useState("");

    const [zoomImage, setZoomImage] = React.useState(false);
    const [imagePath, setImagePath] = React.useState("");

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
                        //console.log("Profile:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setProfileDetails(responseJson.profile);
                            setAadhaarDetails(responseJson.ekyc.aadhaar);
                            setAadhaarFront(responseJson.profile.BaseUrl + responseJson.ekyc.aadhaar.front_image);
                            setAadhaarBack(responseJson.profile.BaseUrl + responseJson.ekyc.aadhaar.back_image);
                            setPanDetails(responseJson.ekyc.pan);
                            setPanImage(responseJson.profile.BaseUrl + responseJson.ekyc.pan.front_image);
                            setGstDetails(responseJson.ekyc.gst);
                            setGstImage(responseJson.profile.BaseUrl + responseJson.ekyc.gst.front_image);
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

    const openImage = (path) => {
        console.log(path);
        setImagePath(path);
        setTimeout(function () {
            setZoomImage(true);
        }, 500);
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Profile Details")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <VStack>
                            <Box style={styles.productbox}>
                                {profileDetails.firstName != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("First Name")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.firstName}</Text>
                                    </HStack>
                                )}
                                {profileDetails.lastName != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Last Name")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.lastName}</Text>
                                    </HStack>
                                )}
                                <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                    <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Member ID")}:</Text>
                                    <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{profileDetails.ID}</Text>
                                </HStack>
                                {profileDetails.tier != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Tier")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{profileDetails.tier}</Text>
                                    </HStack>
                                )}
                                {profileDetails.mobile != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Mobile")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.mobile}</Text>
                                    </HStack>
                                )}
                                {profileDetails.dob != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("DOB")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.dob}</Text>
                                    </HStack>
                                )}
                                {profileDetails.addrLine1 != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Address Line 1")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.addrLine1}</Text>
                                    </HStack>
                                )}
                                {profileDetails.addrLine2 != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Address Line 2")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.addrLine2}</Text>
                                    </HStack>
                                )}
                                {profileDetails.addrLine3 != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Address Line 3")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.addrLine3}</Text>
                                    </HStack>
                                )}
                                {profileDetails.State != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("State")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.State}</Text>
                                    </HStack>
                                )}
                                {profileDetails.district != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("District")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.district}</Text>
                                    </HStack>
                                )}
                                {profileDetails.Pin != "" && (
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Pincode")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.Pin}</Text>
                                    </HStack>
                                )}
                            </Box>
                            {aadhaarDetails.value != "" && (
                                <Box style={styles.productbox}>
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Aadhaar No")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{aadhaarDetails.value}</Text>
                                    </HStack>
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Aadhaar Front Image")}:</Text>
                                        <Pressable onPress={() => openImage(aadhaarFront)}><Image source={aadhaarFront ? { uri: aadhaarFront } : require('../assets/images/noimage.png')} style={{ width: 60, height: 60 }} resizeMode='cover' /></Pressable>
                                    </HStack>
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Aadhaar Back Image")}:</Text>
                                        <Pressable onPress={() => openImage(aadhaarBack)}><Image source={aadhaarBack ? { uri: aadhaarBack } : require('../assets/images/noimage.png')} style={{ width: 60, height: 60 }} resizeMode='cover' /></Pressable>
                                    </HStack>
                                </Box>
                            )}
                            {panDetails.value != "" && (
                                <Box style={styles.productbox}>
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Pan Number")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{panDetails.value}</Text>
                                    </HStack>
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Pan Image")}:</Text>
                                        <Pressable onPress={() => openImage(panImage)}><Image source={panImage ? { uri: panImage } : require('../assets/images/noimage.png')} style={{ width: 60, height: 60 }} resizeMode='cover' /></Pressable>
                                    </HStack>
                                </Box>
                            )}
                            {gstDetails.value != "" && (
                                <Box style={styles.productbox}>
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("GST Number")}:</Text>
                                        <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{gstDetails.value}</Text>
                                    </HStack>
                                    <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                        <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("GST Image")}:</Text>
                                        <Pressable onPress={() => openImage(gstImage)}><Image source={gstImage ? { uri: gstImage } : require('../assets/images/noimage.png')} style={{ width: 60, height: 60 }} resizeMode='cover' /></Pressable>
                                    </HStack>
                                </Box>
                            )}
                        </VStack>
                    </Box>
                </ScrollView>
            </Box>
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
            {zoomImage && (
                <VStack flex={1} style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 99, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: imagePath }} style={{ width: '90%', height: 400, marginBottom: 20, resizeMode: 'contain' }} />
                    <TouchableOpacity onPress={() => setZoomImage(false)}>
                        <Icon name="close-circle-outline" size={32} color="#ffffff" />
                    </TouchableOpacity>
                </VStack>
            )}
        </NativeBaseProvider >
    )
}

const styles = StyleSheet.create({
    productbox: { borderRadius: 20, width: '96%', margin: '2%', backgroundColor: '#f6f6f6', padding: 15, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' }
});

export default ProfileDetailsScreen;
