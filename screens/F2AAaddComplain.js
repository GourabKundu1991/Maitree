import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actionsheet, Box, Button, HStack, Input, NativeBaseProvider, Pressable, ScrollView, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, StatusBar, View, Keyboard, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL, CONTACT_HIER_ID, ORG_ID, PROGRAM_ID, f2a_ownership_token } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const F2AAaddComplainScreen = ({ navigation, route }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [explaination, setExplaination] = React.useState("");

    const [productimage, setProductimage] = React.useState("");
    const [memberCode, setMemberCode] = React.useState("");
    const [reviewUpdate, setReviewUpdate] = React.useState("");
    const [orderId, setOrderId] = React.useState("");
    const [orderItemId, setOrderItemId] = React.useState("");

    const [currentPrgm, setCurrentPrgm] = React.useState("");
    const [isPicker, setIsPicker] = React.useState(false);

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
                    setLoading(false);
                    setColorTheme(JSON.parse(val).info.theme_color);
                    setCurrentPrgm(JSON.parse(val).currentlySelectedProgram);
                    Events.publish('colorTheme', val.info.theme_color);
                }
            });
        });
        return unsubscribe;
    }, []);

    const onRequest = () => {
        Keyboard.dismiss();
        if (route.params.complain_type == 'Damage' && productimage == "") {
            Toast.show({ description: "Please upload Product Image" });
        } else if (currentPrgm !== route.params.prgmId && memberCode.trim() == "") {
            Toast.show({ description: "Please enter Member Code" });
        } else if (explaination.trim() == "") {
            Toast.show({ description: t("Please enter yor explaination") });
        } else {
            setLoading(true);
            AsyncStorage.getItem('userToken').then(val => {
                if (val != null) {
                    let formdata = new FormData();
                    formdata.append("token", JSON.parse(val).token);
                    formdata.append("APIkey", `${API_KEY}`);
                    formdata.append("orgId", JSON.parse(val).org_id);
                    formdata.append("category_id", route.params.cateId);
                    formdata.append("summary", explaination);
                    formdata.append("member_code", memberCode);
                    formdata.append("c_file", productimage);
                    formdata.append("review_update", reviewUpdate);
                    formdata.append("order_id", orderId);
                    formdata.append("order_item_id", orderItemId);
                    formdata.append("is_auto_closed", 0);
                    formdata.append("f2a_ownership_token", `${f2a_ownership_token}`);
                    fetch(`${BASE_URL}/register_complaint_ticket`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formdata
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            //console.log("register_complaint_ticket:", responseJson);
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
                            //console.log("register_complaint_ticket Error:", error);
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

    const onPickerOpen = () => {
        setIsPicker(true);
    }
    const onPickerClose = () => {
        setIsPicker(false);
    }

    const openProfilePicker = (type) => {
        onPickerClose();
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
                        setProductimage(response.assets[0].base64);
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
                        setProductimage(response.assets[0].base64);
                    }
                },
            )
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t(route.params.page_title)}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <VStack style={{ paddingVertical: 20, paddingHorizontal: 20 }} space={4}>
                            {route.params.complain_type == "Damage" && (
                                <Stack width={"100%"} space={2}>
                                    <HStack alignItems="center" space={0}>
                                        <Icon name="attach-outline" size={20} color={colorTheme.dark} />
                                        <Text color={colorTheme.dark} fontSize="sm">{t("Attach Image")} *</Text>
                                    </HStack>
                                    <View style={styles.inputbox}>
                                        <Image source={productimage != "" ? { uri: 'data:image/jpeg;base64,' + productimage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 120 }} />
                                        <Pressable onPress={() => onPickerOpen()} bg={"#ff3705"} position="absolute" bottom="2" right="2" width="45" height="45" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                            <Icon name="camera" size={26} color="#ffffff" />
                                        </Pressable>
                                    </View>
                                </Stack>
                            )}
                            {currentPrgm != route.params.prgmId && (
                                <View style={[styles.inputbox, { paddingHorizontal: 10 }]}>
                                    <Input size="lg" onChangeText={(text) => setMemberCode(text)} variant="unstyled" placeholder={t("Enter Member Code") + " *"} />
                                </View>
                            )}
                            <View style={[styles.inputbox, { padding: 10 }]}>
                                <Input size="lg" height={150} multiline textAlignVertical='top' onChangeText={(text) => setExplaination(text)} variant="unstyled" placeholder={t("Explain your problem") + " *"} />
                            </View>
                            <Button style={styles.custbtn} backgroundColor={colorTheme.dark} onPress={() => onRequest()} marginY={2}>
                                <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Submit Query")}</Text>
                            </Button>
                        </VStack>
                    </Box>
                </ScrollView>
            </Box>
            <Actionsheet isOpen={isPicker} onClose={onPickerClose}>
                <Actionsheet.Content>
                    <Text color="#666666" fontSize="md" textAlign="center">{t("Select Image Source")}</Text>
                    <Actionsheet.Item onPress={() => openProfilePicker("library")}>{t("Load from Library")}</Actionsheet.Item>
                    <Actionsheet.Item onPress={() => openProfilePicker("camera")}>{t("Use Camera")}</Actionsheet.Item>
                    <Actionsheet.Item onPress={() => openProfilePicker("cancel")}>{t("Cancel")}</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
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

export default F2AAaddComplainScreen;
