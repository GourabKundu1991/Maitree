import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actionsheet, Avatar, Box, Button, Checkbox, HStack, Input, NativeBaseProvider, Pressable, Select, Stack, Text, Toast, VStack, useDisclose } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView, ImageBackground, Keyboard, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL, CONTACT_HIER_ID, ORG_ID, OS_TYPE, PROGRAM_ID } from '../auth_provider/Config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { color } from 'react-native-reanimated';
import i18n from '../assets/language/i18n';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const UpdateKYCScreen = ({ navigation, route }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");
    const [dataFound, setDataFound] = React.useState("");

    const [lightColor, setLightColor] = React.useState("#cbf75e");
    const [darkColor, setDarkColor] = React.useState("#2BBB86");
    const [cameraColor, setCameraColor] = React.useState("#f04e23");
    const [logoImage, setLogoImage] = React.useState("");

    const [modalVisible, setModalVisible] = React.useState(true);

    const [aadhaarCard, setAadhaarCard] = React.useState("");
    const [aadhaarFrontImage, setAadhaarFrontImage] = React.useState("");
    const [aadhaarBackImage, setAadhaarBackImage] = React.useState("");

    const [panCard, setPanCard] = React.useState("");
    const [panImage, setPanImage] = React.useState("");

    const [gstCard, setGstCard] = React.useState("");
    const [gstImage, setGStImage] = React.useState("");

    const [isAadhaarView, setIsAadhaarView] = React.useState(true);
    const [isPanView, setIsPanView] = React.useState(true);
    const [isGstView, setIsGstView] = React.useState(true);

    const [isPicker, setIsPicker] = React.useState(false);
    const [imageType, setImageType] = React.useState("");

    const [allState, setAllState] = React.useState([]);
    const [allDistrict, setAllDistrict] = React.useState([]);

    const dobdate = new Date();
    const year = dobdate.getFullYear();
    const month = dobdate.getMonth();
    const day = dobdate.getDate();

    const [dob, setDOB] = React.useState("");

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = React.useState("");

    const [address1, setAddress1] = React.useState("");
    const [address2, setAddress2] = React.useState("");
    const [address3, setAddress3] = React.useState("");
    const [pinCode, setPinCode] = React.useState("");
    const [state, setState] = React.useState("");
    const [district, setDistrict] = React.useState("");
    const [city, setCity] = React.useState("");

    const [termsCheck, setTermsCheck] = React.useState(false);

    const showDatePicker = (val) => {
        setDatePickerVisibility(true);
        setDateType(val);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        if (dateType == "dob") {
            setDOB(date);
        }
    };


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
                    Events.publish('colorTheme', JSON.parse(val).info.theme_color);
                }
            });
            getAllData();
        });
        return unsubscribe;
    }, [])

    const getAllData = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/ekyc_documents`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("ekyc_documents:", JSON.stringify(responseJson));
                        if (responseJson.status == 'success') {
                            setAadhaarCard(responseJson.contact_details.adhar_number);
                            setPanCard(responseJson.contact_details.pan_card_number);
                            setGstCard(responseJson.contact_details.gst_code);
                            setAddress1(responseJson.address_details.line1);
                            setAddress2(responseJson.address_details.line2);
                            setAddress3(responseJson.address_details.line3);
                            setPinCode(responseJson.address_details.post_code);
                            setState(responseJson.address_details.dcm_states_id);
                            setDistrict(responseJson.address_details.dcm_cities_id);
                            getDistrict(responseJson.address_details.dcm_states_id);
                            setCity(responseJson.address_details.city);
                            setDOB(responseJson.contact_details.dob);
                            setAllState(responseJson.all_states);

                            if (responseJson.aadhaar_details != "") {
                                setIsAadhaarView(false);
                            } else if (responseJson.pan_details != "") {
                                setIsPanView(false);
                            } else if (responseJson.gst_details != "") {
                                setIsGstView(false);
                            }
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
                        //console.log("ekyc_documents Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const getDistrict = (stateId) => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("os_type", `${OS_TYPE}`);
                formdata.append("state_id", stateId);
                console.log("test");
                fetch(`${BASE_URL}/GetCityWithStateIDList`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("GetCityWithStateIDList:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setAllDistrict(responseJson.city_list);
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setAllDistrict([]);
                            Toast.show({ description: responseJson.message });
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        //console.log("GetCityWithStateIDList Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onPickerOpen = (val) => {
        setIsPicker(true);
        setImageType(val);
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
                        if (imageType == "AadhaarFrontImage") {
                            setAadhaarFrontImage(response.assets[0].base64);
                        } else if (imageType == "AadhaarBackImage") {
                            setAadhaarBackImage(response.assets[0].base64);
                        } else if (imageType == "PanImage") {
                            setPanImage(response.assets[0].base64);
                        } else if (imageType == "GstImage") {
                            setGStImage(response.assets[0].base64);
                        }
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
                        if (imageType == "AadhaarFrontImage") {
                            setAadhaarFrontImage(response.assets[0].base64);
                        } else if (imageType == "AadhaarBackImage") {
                            setAadhaarBackImage(response.assets[0].base64);
                        } else if (imageType == "PanImage") {
                            setPanImage(response.assets[0].base64);
                        } else if (imageType == "GstImage") {
                            setGStImage(response.assets[0].base64);
                        }
                    }
                },
            )
        }
    }

    const onCheckSubmit = () => {
        Keyboard.dismiss();
        if (isAadhaarView && aadhaarCard.trim() == "") {
            Toast.show({ description: t("Please enter Aadhaar Card Number") });
        } else if (isAadhaarView && aadhaarCard.trim() != "" && aadhaarFrontImage == "") {
            Toast.show({ description: t("Please attach Aadhaar Front Image") });
        } else if (isAadhaarView && aadhaarCard.trim() != "" && aadhaarBackImage == "") {
            Toast.show({ description: t("Please attach Aadhaar Back Image") });
        } else if (!isAadhaarView && panCard.trim() == "") {
            Toast.show({ description: t("Please enter PAN Card Number") });
        } else if (panCard.trim() != "" && panImage == "") {
            Toast.show({ description: t("Please Attach PAN Image") });
        } else if (!isGstView && gstCard.trim() == "") {
            Toast.show({ description: t("Please enter GST Card Number") });
        } else if (gstCard.trim() != "" && gstImage == "") {
            Toast.show({ description: t("Please Attach GST Image") });
        } else {
            onSubmit();
        }
    }

    const onSubmit = () => {
        if (termsCheck == false) {
            Toast.show({ description: t("Please accept Terms & Condition") });
        } else {
            setLoading(true);
            AsyncStorage.getItem('userToken').then(val => {
                if (val != null) {
                    let formdata = new FormData();
                    formdata.append("token", JSON.parse(val).token);
                    formdata.append("APIkey", `${API_KEY}`);
                    formdata.append("orgId", JSON.parse(val).org_id);
                    formdata.append("dob", moment(dob).format("DD-MM-YYYY"));
                    formdata.append("addLine1", address1);
                    formdata.append("addLine2", address2);
                    formdata.append("addLine3", address3);
                    formdata.append("pincode", pinCode);
                    formdata.append("stateId", state);
                    formdata.append("cityId", district);
                    formdata.append("city", city);
                    formdata.append("aadhaarNo", aadhaarCard);
                    formdata.append("aadhaarImage", aadhaarFrontImage);
                    formdata.append("aadhaarBackImage", aadhaarBackImage);
                    formdata.append("panNo", panCard);
                    formdata.append("panImage", panImage);
                    formdata.append("gstNo", gstCard);
                    formdata.append("gstImage", gstImage);
                    formdata.append("contactHierId", "");
                    fetch(`${BASE_URL}/ekyc_recapture`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formdata
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log("Submit Ekyc:", responseJson);
                            if (responseJson.status == 'success') {
                                Toast.show({ description: responseJson.message });
                                setTimeout(function () {
                                    setLoading(false);
                                    if (responseJson.bstatus == 1) {
                                        navigation.replace('Home');
                                    }
                                }, 1000);
                            } else {
                                Toast.show({ description: responseJson.message });
                                setTimeout(function () {
                                    setLoading(false);
                                    if (responseJson.msg_code == "msg_1000") {
                                        AsyncStorage.clear();
                                        navigation.navigate('Login');
                                    }
                                }, 1000);
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                            console.log("Submit Ekyc Error:", error);
                            Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                        });
                } else {
                    setLoading(false);
                    AsyncStorage.clear();
                    navigation.navigate('Login');
                }
            });
        }
    }

    const onSelectState = (idVal) => {
        setLoading(true);
        setState(idVal);
        setDistrict("");
        getDistrict(idVal);
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Update E-KYC")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        {isAadhaarView && (
                            <Box style={styles.productbox}>
                                <Text color={darkColor} fontSize="16" fontWeight="bold" textAlign="center" mb="4" pb="3" borderColor="#bbbbbb" borderBottomWidth={1}>{t("Aadhaar Details")}</Text>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={aadhaarCard} keyboardType='number-pad' maxLength={12} onChangeText={(text) => setAadhaarCard(text)} variant="unstyled" InputLeftElement={<Icon name="card-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Aadhaar Card No." + " *")} />
                                </View>
                                <HStack alignItems="center" mt="3" space={0}>
                                    <Icon name="attach-outline" size={22} color="#666666" />
                                    <Text color="#666666" fontSize="md" textTransform="capitalize">{t("Attach Aadhaar Front Image")} *</Text>
                                </HStack>
                                <View style={styles.inputbox}>
                                    <Image source={aadhaarFrontImage != "" ? { uri: 'data:image/jpeg;base64,' + aadhaarFrontImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 160 }} />
                                    <Pressable onPress={() => onPickerOpen("AadhaarFrontImage")} bg={cameraColor} position="absolute" bottom="3" right="3" width="50" height="50" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                        <Icon name="camera" size={26} color="#ffffff" />
                                    </Pressable>
                                </View>
                                <HStack alignItems="center" mt="3" space={0}>
                                    <Icon name="attach-outline" size={22} color="#666666" />
                                    <Text color="#666666" fontSize="md" textTransform="capitalize">{t("Attach Aadhaar Back Image")} *</Text>
                                </HStack>
                                <View style={styles.inputbox}>
                                    <Image source={aadhaarBackImage != "" ? { uri: 'data:image/jpeg;base64,' + aadhaarBackImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 160 }} />
                                    <Pressable onPress={() => onPickerOpen("AadhaarBackImage")} bg={cameraColor} position="absolute" bottom="3" right="3" width="50" height="50" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                        <Icon name="camera" size={26} color="#ffffff" />
                                    </Pressable>
                                </View>
                            </Box>
                        )}
                        {isPanView && (
                            <Box style={styles.productbox}>
                                <Text color={darkColor} fontSize="16" fontWeight="bold" textAlign="center" mb="4" pb="3" borderColor="#bbbbbb" borderBottomWidth={1}>{t("PAN Details")}</Text>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={panCard} onChangeText={(text) => setPanCard(text)} variant="unstyled" maxLength={10} InputLeftElement={<Icon name="card-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("PAN Card No.") + " *"} />
                                </View>
                                {panCard != "" && (
                                    <View>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={22} color="#666666" />
                                            <Text color="#666666" fontSize="md" textTransform="capitalize">{t("Attach PAN Image")} *</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={panImage != "" ? { uri: 'data:image/jpeg;base64,' + panImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 160 }} />
                                            <Pressable onPress={() => onPickerOpen("PanImage")} bg={cameraColor} position="absolute" bottom="3" right="3" width="50" height="50" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </View>
                                )}
                            </Box>
                        )}
                        {isGstView && (
                            <Box style={styles.productbox}>
                                <Text color={darkColor} fontSize="16" fontWeight="bold" textAlign="center" mb="4" pb="3" borderColor="#bbbbbb" borderBottomWidth={1}>{t("GST Details")}</Text>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={gstCard} onChangeText={(text) => setGstCard(text)} variant="unstyled" maxLength={10} InputLeftElement={<Icon name="card-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("GST Card No.") + " *"} />
                                </View>
                                {gstCard != "" && (
                                    <View>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={22} color="#666666" />
                                            <Text color="#666666" fontSize="md" textTransform="capitalize">{t("Attach GST Image")} *</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={gstImage != "" ? { uri: 'data:image/jpeg;base64,' + gstImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 160 }} />
                                            <Pressable onPress={() => onPickerOpen("GstImage")} bg={cameraColor} position="absolute" bottom="3" right="3" width="50" height="50" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </View>
                                )}
                            </Box>
                        )}
                        <Box style={styles.productbox}>
                            <Text color={darkColor} fontSize="16" fontWeight="bold" textAlign="center" mb="4" pb="3" borderColor="#bbbbbb" borderBottomWidth={1}>{t("Address Details")}</Text>
                            <Text color={'danger.600'} fontSize="xs" fontWeight="bold" textAlign="center" mb="4" pb="3">**{t("Address should be as per Aadhaar or GST")}</Text>
                            <VStack space={3}>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address1} onChangeText={(text) => setAddress1(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 1") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address2} onChangeText={(text) => setAddress2(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 2") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address3} onChangeText={(text) => setAddress3(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 3")} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={pinCode} onChangeText={(text) => setPinCode(text)} variant="unstyled" InputLeftElement={<Icon name="locate-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Pincode") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Select variant="underlined" size="lg" width={400} maxWidth={'100%'} placeholder={t("Select State") + " *"}
                                        InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />}
                                        selectedValue={state}
                                        onValueChange={value => onSelectState(value)}
                                        _selectedItem={{
                                            backgroundColor: '#eeeeee',
                                            endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                        }}>
                                        {allState.map((item, index) =>
                                            <Select.Item key={index} label={item.name} value={item.id} />
                                        )}
                                    </Select>
                                </View>
                                {state != "" && (
                                    <View style={styles.inputbox}>
                                        <Select variant="underlined" size="lg" width={400} maxWidth={'100%'} placeholder={t("Select District") + " *"}
                                            InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />}
                                            selectedValue={Number(district)}
                                            onValueChange={value => setDistrict(value)}
                                            _selectedItem={{
                                                backgroundColor: '#eeeeee',
                                                endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                            }}>
                                            {allDistrict.map((item, index) =>
                                                <Select.Item key={index} label={item.city_name} value={item.city_id} />
                                            )}
                                        </Select>
                                    </View>
                                )}
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={city} onChangeText={(text) => setCity(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("City")} />
                                </View>

                                <Text color={'danger.600'} fontSize="xs" fontWeight="bold" textAlign="center" marginTop={4}>**{t("DOB Should be as per PAN")}</Text>
                                <Pressable style={styles.inputbox} onPress={() => showDatePicker("dob")}>
                                    <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"}>
                                        <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />
                                        <Text color={dob != "" ? "#111111" : "#999999"} fontSize="md">{dob != "" ? moment(dob).format("DD MMMM, YYYY") : t("DOB") + " *"}</Text>
                                    </HStack>
                                </Pressable>
                            </VStack>
                        </Box>
                        <Box style={styles.productbox}>
                            <Text fontWeight={'bold'} color={"#777777"}>
                                {t("The information provided above are true to my knowledge and I hereby solemnly submit all the documents required. All details captured will be solely used for the purpose of CRM and Loyalty program of Nuvoco only.")}
                            </Text>
                            <Stack pr="4" marginTop="4" paddingRight={20} flexWrap="wrap">
                                <Checkbox shadow={2} onChange={() => setTermsCheck(!termsCheck)} accessibilityLabel="Checkbox">
                                    {t("I have also read and agreed to the terms of services and privacy policy.")}
                                </Checkbox>
                            </Stack>
                        </Box>
                    </Box>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        maximumDate={new Date(year - 18, month, day)}
                    />
                    <Actionsheet isOpen={isPicker} onClose={onPickerClose}>
                        <Actionsheet.Content>
                            <Text color="#666666" fontSize="md" textAlign="center">{t("Select Image Source")}</Text>
                            <Actionsheet.Item onPress={() => openProfilePicker("library")}>{t("Load from Library")}</Actionsheet.Item>
                            <Actionsheet.Item onPress={() => openProfilePicker("camera")}>{t("Use Camera")}</Actionsheet.Item>
                            <Actionsheet.Item onPress={() => openProfilePicker("cancel")}>{t("Cancel")}</Actionsheet.Item>
                        </Actionsheet.Content>
                    </Actionsheet>
                </ScrollView>

                <HStack backgroundColor={"#eeeeee"} paddingY="3" paddingX="6" justifyContent="space-between">
                    <Button style={[styles.solidBtn, { width: '100%' }]} borderColor={colorTheme.dark} backgroundColor={colorTheme.dark} onPress={() => onCheckSubmit()}>
                        <Text color={"#ffffff"} fontSize="md" fontWeight="medium">{t("Submit")}</Text>
                    </Button>
                </HStack>
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
    solidBtn: { width: '48%', borderWidth: 1, borderRadius: 30 },
    outlineBtn: { width: '48%', borderWidth: 1, borderRadius: 30 },
    productbox: { borderRadius: 20, width: '96%', margin: '2%', backgroundColor: '#f6f6f6', padding: 15, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    productimage: { borderColor: '#dddddd', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 10, width: '30%', height: 125, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    productdetails: { width: '65%' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default UpdateKYCScreen;
