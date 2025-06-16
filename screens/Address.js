import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, HStack, NativeBaseProvider, Text, VStack, Toast, Button, Stack, Input, Select } from 'native-base';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, Alert, Keyboard, ScrollView, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { API_KEY, BASE_URL, OS_TYPE } from '../auth_provider/Config';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const AddreessScreen = ({ navigation, route }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [altAddress, setAltAddress] = React.useState("");
    const [parAddress, setParAddress] = React.useState("");

    const [addressId, setAddressId] = React.useState("");
    const [addressType, setAddressType] = React.useState("");

    const [otp, setOtp] = React.useState('');

    const [pop, setPop] = React.useState(false);
    const [successOrder, setSuccessOrder] = React.useState(false);
    const [popAddress, setPopAddress] = React.useState(false);

    const [address1, setAddress1] = React.useState("");
    const [address2, setAddress2] = React.useState("");
    const [address3, setAddress3] = React.useState("");
    const [state, setState] = React.useState("");
    const [city, setCity] = React.useState("");
    const [pinCode, setPinCode] = React.useState("");

    const [stateList, setStateList] = React.useState([]);
    const [cityList, setCityList] = React.useState([]);

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

    const onSelectState = (idVal) => {
        setLoading(true);
        setState(idVal);
        setCity("");
        getCityList(idVal);
    }


    const getAllData = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                fetch(`${BASE_URL}/get_user_address`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("get_user_address:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setAltAddress(responseJson.address.alternate_addresses);
                            setParAddress(responseJson.address.permanent_address);
                            getStateList();
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
                        //console.log("get_user_address Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const getStateList = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("os_type", `${OS_TYPE}`);
                fetch(`${BASE_URL}/GetStateList`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("GetStateList:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setStateList(responseJson.state_list);
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setStateList([]);
                            Toast.show({ description: responseJson.message });
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        //console.log("GetStateList Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const getCityList = (stateId) => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("os_type", `${OS_TYPE}`);
                formdata.append("state_id", stateId);
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
                            setCityList(responseJson.city_list);
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setStateList([]);
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

    const selectAddress = (addId, addType) => {
        setAddressId(addId);
        setAddressType(addType);
        setLoading(true);
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("contactHierId", JSON.parse(val).hier_id);
                fetch(`${BASE_URL}/generate_shipping_otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("generate_shipping_otp:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setPop(true);
                            Toast.show({ description: responseJson.message });
                            setLoading(false);
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
                        //console.log("generate_shipping_otp Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onCancel = () => {
        setPop(false);
        setOtp("");
    }

    const resendOTP = () => {
        selectAddress(addressId, addressType);
    }

    const onVerify = () => {
        Keyboard.dismiss();
        if (otp.trim() == '') {
            Toast.show({ description: t("Please enter OTP") });
        } else {
            setLoading(true);
            AsyncStorage.getItem('userToken').then(val => {
                if (val != null) {
                    let formdata = new FormData();
                    formdata.append("token", JSON.parse(val).token);
                    formdata.append("APIkey", `${API_KEY}`);
                    formdata.append("os_type", `${OS_TYPE}`);
                    formdata.append("otpVal", otp);
                    fetch(`${BASE_URL}/validate_shipping_otp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formdata
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            //console.log("Verify OTP:", responseJson);
                            if (responseJson.bstatus == 1) {
                                Toast.show({ description: responseJson.message });
                                onCancel();
                                onPlaceOrder();
                            } else {
                                setLoading(false);
                                Toast.show({ description: responseJson.message });
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                            //console.log("Verify OTP Error:", error);
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

    const onSaveAddress = () => {
        if (address1.trim() == "") {
            Toast.show({ description: t("Please enter Address Line 1") });
        } else if (address2.trim() == "") {
            Toast.show({ description: t("Please enter Address Line 2") });
        } else if (state == "") {
            Toast.show({ description: t("Please select State") });
        } else if (city == "") {
            Toast.show({ description: t("Please select City") });
        } else if (pinCode.trim() == "") {
            Toast.show({ description: t("Please enter Pincode") });
        } else {
            AsyncStorage.getItem('userToken').then(val => {
                if (val != null) {
                    let formdata = new FormData();
                    formdata.append("token", JSON.parse(val).token);
                    formdata.append("APIkey", `${API_KEY}`);
                    formdata.append("add_address_line1", address1);
                    formdata.append("add_address_line2", address2);
                    formdata.append("add_address_line3", address3);
                    formdata.append("add_state", state);
                    formdata.append("add_city", city);
                    formdata.append("add_pincode", pinCode);
                    fetch(`${BASE_URL}/add_alternate_address`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formdata
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log("add_alternate_address:", responseJson);
                            if (responseJson.bstatus == 1) {
                                onCancelAddress();
                                selectAddress(responseJson.address_id, 'dcm_contact_shipping_address');
                            } else {
                                if (responseJson.message == "Session is expired") {
                                    Toast.show({ description: responseJson.message });
                                    setTimeout(function () {
                                        AsyncStorage.clear();
                                        navigation.navigate('Welcome');
                                    }, 1000);
                                } else {
                                    Alert.alert(
                                        t("Sorry") + "!",
                                        responseJson.message,
                                        [
                                            {
                                                text: t("Ok"), onPress: () => { }
                                            }
                                        ],
                                        { cancelable: false }
                                    );
                                }
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                            console.log("add_alternate_address Error:", error);
                            Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                        });
                } else {
                    setLoading(false);
                    AsyncStorage.clear();
                    navigation.navigate('Wlcome');
                }
            });
        }
    }

    const onPlaceOrder = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("cartId", route.params.cartId);
                formdata.append("address_id", addressId);
                formdata.append("referece_address_table", addressType);
                console.log(formdata);
                fetch(`${BASE_URL}/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Order Placed:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setSuccessOrder(true);
                            getAllData();
                        } else {
                            if (responseJson.message == "Session is expired") {
                                Toast.show({ description: responseJson.message });
                                setTimeout(function () {
                                    setLoading(false);
                                    AsyncStorage.clear();
                                    navigation.navigate('Welcome');
                                }, 1000);
                            } else {
                                setLoading(false);
                                Alert.alert(
                                    t("Sorry") + "!",
                                    responseJson.message,
                                    [
                                        {
                                            text: t("Ok"), onPress: () => { }
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.log("Order Placed Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onContinue = () => {
        setSuccessOrder(false);
        navigation.navigate('Home');
    }

    const onCancelAddress = () => {
        setPopAddress(false);
        setAddress1("");
        setAddress2("");
        setAddress3("");
        setState("");
        setCity("");
        setPinCode("");
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Select Shipping Address")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <VStack>
                            <Box style={styles.productbox}>
                                <VStack alignItems="center" w="100%" padding={2}>
                                    <TouchableOpacity onPress={() => setPopAddress(true)} style={{ width: '100%' }}>
                                        <Stack borderWidth={1} bg={"#333333"} justifyContent="center" borderRadius={12} w="100%" height="35" padding="1" overflow="hidden">
                                            <Text color="#ffffff" fontSize="sm" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Add New Address")}</Text>
                                        </Stack>
                                    </TouchableOpacity>
                                </VStack>
                            </Box>
                            <Box style={[styles.productbox, { borderColor: colorTheme.light }]} mt="3">
                                <View style={{ padding: 10, backgroundColor: colorTheme.light }}>
                                    <Text color={colorTheme.dark} fontSize="md" textAlign="center" fontWeight="bold">{t("Parmanent Address")}</Text>
                                </View>
                                {parAddress == "" ?
                                    <HStack padding="10" justifyContent="center">
                                        <Text fontSize='sm' color="#888888">----- {t("No Data Available")} -----</Text>
                                    </HStack>
                                    :
                                    <ScrollView nestedScrollEnabled={true}>
                                        <VStack padding="3">
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Address Line1")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{parAddress.line1}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Address Line2")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{parAddress.line2}</Text>
                                            </HStack>
                                            {parAddress.line3 != "" && (
                                                <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                    <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Address Line3")}:</Text>
                                                    <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{parAddress.line3}</Text>
                                                </HStack>
                                            )}
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Country")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{parAddress.country}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("State")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{parAddress.state}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("City")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{parAddress.city}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Post Code")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{parAddress.post_code}</Text>
                                            </HStack>
                                            <HStack justifyContent="center" alignItems="center" w="100%" marginTop={4}>
                                                <Button backgroundColor={colorTheme.dark} size="sm" width="80%" borderRadius={30} variant="link" _text={{ color: "#ffffff", fontWeight: 'bold', fontSize: 13 }} onPress={() => selectAddress(parAddress.add_id, 'dcm_addresses')}>{t("Delivery to This Address")}</Button>
                                            </HStack>
                                        </VStack>
                                    </ScrollView>
                                }
                            </Box>
                            <Box style={[styles.productbox, { borderColor: colorTheme.light }]} mt="3">
                                <View style={{ padding: 10, backgroundColor: colorTheme.light }}>
                                    <Text color={colorTheme.dark} fontSize="md" textAlign="center" fontWeight="bold">{t("Alternative Address")}</Text>
                                </View>
                                {altAddress == null ?
                                    <HStack padding="10" justifyContent="center">
                                        <Text fontSize='sm' color="#888888">----- {t("No Data Available")} -----</Text>
                                    </HStack>
                                    :
                                    <ScrollView nestedScrollEnabled={true}>
                                        <VStack padding="3">
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Address Line1")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{altAddress.line1}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Address Line2")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{altAddress.line2}</Text>
                                            </HStack>
                                            {parAddress.line3 != "" && (
                                                <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                    <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Address Line3")}:</Text>
                                                    <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{altAddress.line3}</Text>
                                                </HStack>
                                            )}
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Country")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{altAddress.country}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("State")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{altAddress.state}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("City")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{altAddress.city}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between" flexWrap="wrap" alignItems="center" w="100%" padding={2}>
                                                <Text color="#666666" fontSize="xs" fontWeight="medium" textTransform="capitalize">{t("Post Code")}:</Text>
                                                <Text color="#111111" width={200} fontSize="sm" textAlign="right" fontWeight="bold">{altAddress.post_code}</Text>
                                            </HStack>
                                            <HStack justifyContent="center" alignItems="center" w="100%" marginTop={4}>
                                                <Button backgroundColor={colorTheme.dark} size="sm" width="80%" borderRadius={30} variant="link" _text={{ color: "#ffffff", fontWeight: 'bold', fontSize: 13 }} onPress={() => selectAddress(altAddress.add_id, 'dcm_contact_shipping_address')}>{t("Delivery to This Address")}</Button>
                                            </HStack>
                                        </VStack>
                                    </ScrollView>
                                }
                            </Box>
                        </VStack>
                    </Box>
                </ScrollView>
            </Box>
            {pop && (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.spincontainer}>
                        <LinearGradient
                            colors={['#ffffff', "#cccccc"]}
                            start={{ x: 0.5, y: 0 }}
                            style={{ width: 300, borderRadius: 15, overflow: 'hidden' }}
                        >
                            <VStack space={1} w="100%" paddingX="5" paddingY="10" alignItems="center" justifyContent="center">
                                <Stack space={3} alignItems="center">
                                    <Text color={colorTheme.dark} fontSize="lg" fontWeight="bold">{t("OTP Verification")}</Text>
                                    <Text color="#444444" paddingX="5" fontSize="sm" mb={4} textAlign="center">{t("Please Enter OTP and click Place Order to Continue")}</Text>
                                    <View style={styles.inputbox}>
                                        <Input size="lg" width={'100%'} onChangeText={(text) => setOtp(text)} keyboardType='number-pad' maxLength={6} variant="unstyled" InputLeftElement={<Icon name="key-outline" size={20} color="#f04e23" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Enter OTP") + " *"} />
                                    </View>
                                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => resendOTP()}>
                                        <Text color="#f04e23" fontSize="sm" fontWeight="bold" textAlign="center">{t("Resend OTP")}?</Text>
                                    </TouchableOpacity>
                                </Stack>
                                <HStack space={1} alignItems="center" justifyContent="space-evenly" overflow="hidden" marginTop={8}>
                                    <Button size="sm" style={{ backgroundColor: '#999999', width: '28%', borderRadius: 30, overflow: 'hidden' }} onPress={() => onCancel()}>
                                        <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Close")}</Text>
                                    </Button>
                                    <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: '65%', borderRadius: 30, overflow: 'hidden' }} onPress={() => onVerify()}>
                                        <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Place Order")}</Text>
                                    </Button>
                                </HStack>
                            </VStack>
                        </LinearGradient>
                    </View>
                </TouchableWithoutFeedback>
            )}
            {popAddress && (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.spincontainer}>
                        <LinearGradient
                            colors={['#ffffff', "#cccccc"]}
                            start={{ x: 0.5, y: 0 }}
                            style={{ width: 300, borderRadius: 15, overflow: 'hidden' }}
                        >
                            <VStack space={1} w="100%" paddingX="5" paddingY="10" alignItems="center" justifyContent="center">
                                <Stack space={3} alignItems="center">
                                    <Text color={colorTheme.dark} fontSize="lg" fontWeight="bold">{t("Add New Address")}</Text>
                                    <Text color="#444444" paddingX="5" fontSize="sm" mb={4} textAlign="center">{t("Please Enter your Address Details and click Save Address to Continue")}</Text>
                                    <View style={styles.inputbox}>
                                        <Input size="lg" width={'100%'} onChangeText={(text) => setAddress1(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 1") + " *"} />
                                    </View>
                                    <View style={styles.inputbox}>
                                        <Input size="lg" width={'100%'} onChangeText={(text) => setAddress2(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 2") + " *"} />
                                    </View>
                                    <View style={styles.inputbox}>
                                        <Input size="lg" width={'100%'} onChangeText={(text) => setAddress3(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 3")} />
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
                                            {stateList.map((item, index) =>
                                                <Select.Item key={index} label={item.state_name} value={item.state_id} />
                                            )}
                                        </Select>
                                    </View>
                                    {state != "" && (
                                        <View style={styles.inputbox}>
                                            <Select variant="underlined" size="lg" width={400} maxWidth={'100%'} placeholder={t("Select City") + " *"}
                                                InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />}
                                                selectedValue={city}
                                                onValueChange={value => setCity(value)}
                                                _selectedItem={{
                                                    backgroundColor: '#eeeeee',
                                                    endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                                }}>
                                                {cityList.map((item, index) =>
                                                    <Select.Item key={index} label={item.city_name} value={item.city_id} />
                                                )}
                                            </Select>
                                        </View>
                                    )}
                                    <View style={styles.inputbox}>
                                        <Input size="lg" width={'100%'} keyboardType='number-pad' maxLength={6} onChangeText={(text) => setPinCode(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Pincode") + " *"} />
                                    </View>
                                </Stack>
                                <HStack space={1} alignItems="center" justifyContent="space-evenly" overflow="hidden" marginTop={8}>
                                    <Button size="sm" style={{ backgroundColor: '#999999', width: '28%', borderRadius: 30, overflow: 'hidden' }} onPress={() => onCancelAddress()}>
                                        <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Close")}</Text>
                                    </Button>
                                    <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: '65%', borderRadius: 30, overflow: 'hidden' }} onPress={() => onSaveAddress()}>
                                        <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Save")}</Text>
                                    </Button>
                                </HStack>
                            </VStack>
                        </LinearGradient>
                    </View>
                </TouchableWithoutFeedback>
            )}
            {successOrder && (
                <View style={styles.spincontainer}>
                    <LinearGradient
                        colors={['#ffffff', "#cccccc"]}
                        start={{ x: 0.5, y: 0 }}
                        style={{ width: 300, borderRadius: 15, overflow: 'hidden' }}
                    >
                        <VStack space={1} w="100%" paddingX="10" paddingY="10" alignItems="center" justifyContent="center">
                            <Icon name="checkmark-done-circle-outline" size={100} color={colorTheme.dark}></Icon>
                            <Text mt={8} fontSize="xl" fontWeight="bold" color="#111111">{t("Thank You")}</Text>
                            <Text textAlign="center" fontSize="sm" fontWeight="medium" color="#111111" mb={3}>{t("Your order has been Placed Successfully")}.</Text>
                            <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: 180, borderRadius: 30, overflow: 'hidden' }} onPress={() => onContinue()} marginY={4}>
                                <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Continue")}</Text>
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
    inputbox: { backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 12, width: '100%', overflow: 'hidden', marginVertical: 0 }, inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    optionbtn: { backgroundColor: 'none', width: '46%', borderRadius: 8, overflow: 'hidden' },
    productbox: { borderRadius: 20, width: '96%', margin: '2%', borderWidth: 2, overflow: 'hidden' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default AddreessScreen;
