import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, HStack, NativeBaseProvider, Text, VStack, Toast, Button, Stack, Input, Checkbox, AlertDialog } from 'native-base';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, Image, Keyboard, ScrollView, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RenderHTML from 'react-native-render-html';
import moment from 'moment';

const GiftVouchersScreen = ({ navigation }) => {

    const { width } = useWindowDimensions();

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [filterStatus, setFilterStatus] = React.useState("Gift");
    const [dataFound, setDataFound] = React.useState("");

    const [allVouchers, setAllVouchers] = React.useState([]);

    const [pop, setPop] = React.useState(false);
    const [otp, setOtp] = React.useState('');

    const [itemDetails, setItemDetails] = React.useState("");
    const [otpId, setOtpId] = React.useState("");
    const [termsCheck, setTermsCheck] = React.useState(false);
    
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
            getGiftData();
        });
        return unsubscribe;
    }, []);

    const getGiftData = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/voucher_list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Voucher:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setAllVouchers(responseJson.vouchers);
                            if (responseJson.vouchers.length != 0) {
                                setDataFound("found");
                            } else {
                                setDataFound("notfound");
                            }
                        } else {
                            Toast.show({ description: responseJson.message });
                            setDataFound("notfound");
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
                        //console.log("Voucher Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const getVehicleData = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/vehicle_voucher_list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.log("Voucher:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setAllVouchers(responseJson.vouchers);
                            if (responseJson.vouchers.length != 0) {
                                setDataFound("found");
                            } else {
                                setDataFound("notfound");
                            }
                        } else {
                            Toast.show({ description: responseJson.message });
                            setDataFound("notfound");
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
                        //console.log("Voucher Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onSetFilter = (type) => {
        setLoading(true);
        setFilterStatus(type);
        if (type == "Gift") {
            getGiftData();
        } else {
            getVehicleData();
        }
    }

    const unlockVoucher = (voucherData) => {
        setItemDetails(voucherData);
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("skuId", voucherData.inv_sku_id);
                fetch(`${BASE_URL}/is_voucher_unlocked`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.log("Unlock Voucher:", responseJson);
                        if (responseJson.bstatus == 1) {
                            sendOtp();
                            setPop(true);
                        } else {
                            Toast.show({ description: responseJson.message });
                            setDataFound("notfound");
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
                        console.log("Unlock Voucher Error:", error);
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

    const sendOtp = () => {
        setLoading(true);
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("skuId", itemDetails.inv_sku_id);
                formdata.append("productName", itemDetails.product_name);
                formdata.append("lockedCode", itemDetails.locked_code);
                fetch(`${BASE_URL}/registered_mobile_number_verification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setLoading(false);
                        //console.log("Get OTP:", responseJson);
                        if (responseJson.bstatus == 1) {
                            Toast.show({ description: responseJson.message });
                            setOtpId(responseJson.verification_respons.otp_id);
                        } else {
                            Toast.show({ description: responseJson.message });
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        //console.log("OTP Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onVerify = () => {
        Keyboard.dismiss();
        if (otp.trim() == '') {
            Toast.show({ description: t("Please enter OTP") });
        } else if (termsCheck === false) {
            Toast.show({ description: t("Please accept Terms & Condition") });
        } else {
            setLoading(true);
            AsyncStorage.getItem('userToken').then(val => {
                if (val != null) {
                    let formdata = new FormData();
                    formdata.append("token", JSON.parse(val).token);
                    formdata.append("APIkey", `${API_KEY}`);
                    formdata.append("orgId", JSON.parse(val).org_id);
                    formdata.append("skuId", itemDetails.inv_sku_id);
                    formdata.append("otpId", otpId);
                    formdata.append("otp", otp);
                    formdata.append("is_tnc_checked", termsCheck === true ? 1 : 0);
                    console.log(formdata);
                    fetch(`${BASE_URL}/voucher_otp_verification`, {
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
                                getGiftData();
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

    const openDownloadPdf = (path) => {
        const fileName = "Voucher_" + moment(new Date()).format("DD-MMMM-YYYY");
        let dirs = ReactNativeBlobUtil.fs.dirs;
        ReactNativeBlobUtil.config({
            fileCache: true,
            appendExt: 'pdf',
            path: `${dirs.DocumentDir}/${fileName}`,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                title: fileName,
                description: 'File downloaded by download manager.',
                mime: 'application/pdf',
            },
        })
            .fetch('GET', path)
            .then((res) => {
                setLoading(false);
                // in iOS, we want to save our files by opening up the saveToFiles bottom sheet action.
                // whereas in android, the download manager is handling the download for us.
                if (Platform.OS === 'ios') {
                    const filePath = res.path();
                    let options = {
                        type: 'application/pdf',
                        url: filePath,
                        saveToFiles: true,
                    };
                    Share.open(options)
                        .then((resp) => console.log(resp))
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log('BLOB ERROR -> ', err));
    };

    return (
        <NativeBaseProvider>
            <StatusBar barStyle="light-content" backgroundColor={colorTheme.normal} />
            <Box flex={1} bg={"#ffffff"}>
                <HStack style={{ height: 60 }} bg={colorTheme.normal} justifyContent="space-between" alignItems="center" paddingX="4" paddingY="3" space={2}>
                    <HStack alignItems={'center'} space={8}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="chevron-back" size={28} color="#ffffff" />
                        </TouchableOpacity>
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("My Gift Vouchers")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <HStack alignItems="center" justifyContent="space-evenly">
                            <LinearGradient
                                colors={filterStatus == "Gift" ? ["#666666", "#000000"] : ["#eeeeee", "#bbbbbb"]}
                                start={{ x: 0.5, y: 0 }}
                                style={[styles.custbtn, { width: '45%' }]}
                            >
                                <Button size="xs" variant="link" _text={{ color: filterStatus == "Gift" ? "#ffffff" : "#111111", fontWeight: 'bold', fontSize: 12 }} onPress={() => onSetFilter("Gift")}>{t("Gift Voucher")}</Button>
                            </LinearGradient>
                            <LinearGradient
                                colors={filterStatus == "Vehicle" ? ["#666666", "#000000"] : ["#eeeeee", "#bbbbbb"]}
                                start={{ x: 0.5, y: 0 }}
                                style={[styles.custbtn, { width: '45%' }]}
                            >
                                <Button size="xs" variant="link" _text={{ color: filterStatus == "Vehicle" ? "#ffffff" : "#111111", fontWeight: 'bold', fontSize: 12 }} onPress={() => onSetFilter("Vehicle")}>{t("Vehicle Voucher")}</Button>
                            </LinearGradient>
                        </HStack>
                        <Box marginTop="5">
                            {dataFound == "notfound" && (
                                <Stack space={5} style={[styles.productbox, { height: 350, justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
                                    <Icon name="hourglass-outline" size={80} color="#999999" />
                                    <Text fontSize='lg' fontWeight="bold" textAlign="center" color="#111111">{t("Result Not Found")}</Text>
                                    <Text fontSize='sm' fontWeight="medium" textAlign="center" color="#666666">{t("Whoops... This Information is not available for a moment")}</Text>
                                </Stack>
                            )}
                            {dataFound == "found" && (
                                <VStack>
                                    {allVouchers.map((item, index) =>
                                        <Box key={index} style={styles.productbox}>
                                            <HStack space="4">
                                                <Box style={styles.productimage}>
                                                    <Image source={item.prod_img ? { uri: item.BaseUrl + item.prod_img } : require('../assets/images/noimage.png')} style={{ width: 100, height: 90 }} resizeMode='contain' />
                                                </Box>
                                                <VStack style={styles.productdetails} space="1">
                                                    <Text fontSize='md' color={colorTheme.dark} fontWeight="bold">{item.product_name}</Text>
                                                    <HStack space="2" alignItems="center">
                                                        <Text fontSize='xs'>{t("Order No")}:</Text>
                                                        <Text fontSize='sm' fontWeight="medium">{item.order_id}</Text>
                                                    </HStack>
                                                    {filterStatus == "Gift" ?
                                                        <Stack>
                                                            <HStack space="2" alignItems="center">
                                                                <Text fontSize='xs'>{t("Code")}:</Text>
                                                                {item.is_code_visible ?
                                                                    <Text fontSize='sm' fontWeight="medium"> {item.sku_code}</Text>
                                                                    :
                                                                    <Text fontSize='sm' fontWeight="medium">{item.locked_code}</Text>
                                                                }
                                                            </HStack>
                                                            {!item.is_code_visible && (
                                                                <Button size="xs" backgroundColor={colorTheme.dark} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'bold', fontSize: 12 }} onPress={() => unlockVoucher(item)}>{t("Unlock")}</Button>
                                                            )}
                                                            {item.is_code_visible && (
                                                                <View>
                                                                    <HStack space="2" alignItems="center">
                                                                        <Text fontSize='xs'>{t("Pin")}:</Text>
                                                                        <Text fontSize='sm' fontWeight="medium">{item.activation_pin}</Text>
                                                                    </HStack>
                                                                    <HStack space="2" alignItems="center">
                                                                        <Text fontSize='xs'>{t("Validity")}:</Text>
                                                                        <Text fontSize='sm' fontWeight="medium">{item.sku_valid_till}</Text>
                                                                    </HStack>
                                                                </View>
                                                            )}
                                                        </Stack>
                                                        :
                                                        <Stack>
                                                            <HStack space="2" alignItems="center">
                                                                <Text fontSize='xs'>{t("Validity")}:</Text>
                                                                <Text fontSize='sm' fontWeight="medium">{item.sku_valid_till}</Text>
                                                            </HStack>
                                                            <Button size="xs" backgroundColor={colorTheme.dark} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'bold', fontSize: 12 }} onPress={() => openDownloadPdf(item.BaseUrl + item.pdf_file)}>{t("Download")}</Button>
                                                        </Stack>
                                                    }
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    )}
                                </VStack>
                            )}
                        </Box>
                    </Box>
                </ScrollView>
            </Box>
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
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
                                    <Text color="#444444" paddingX="5" fontSize="sm" mb={4} textAlign="center">{t("Please Enter OTP and click Verify to Unlock Voucher")}</Text>
                                    <View style={styles.inputbox}>
                                        <Input size="lg" width={'100%'} onChangeText={(text) => setOtp(text)} keyboardType='number-pad' maxLength={6} variant="unstyled" InputLeftElement={<Icon name="key-outline" size={20} color="#f04e23" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Enter OTP") + " *"} />
                                    </View>
                                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => sendOtp()}>
                                        <Text color="#f04e23" fontSize="md" fontWeight="bold" textAlign="center">{t("Resend OTP")}?</Text>
                                    </TouchableOpacity>
                                    <Stack space={2} marginTop="4">
                                        <Checkbox shadow={2} onChange={() => setTermsCheck(!termsCheck)} accessibilityLabel="Checkbox">
                                            {t("I accept the terms & conditions")}
                                        </Checkbox>
                                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => navigation.navigate("TermsConditions")}>
                                            <Text color="#f04e23" fontSize="sm" fontWeight="medium" textAlign="center">{t("Read Terms & Condition")}</Text>
                                        </TouchableOpacity>
                                    </Stack>
                                </Stack>
                                <HStack space={1} alignItems="center" justifyContent="space-evenly" overflow="hidden" marginTop={8}>
                                    <Button size="sm" style={{ backgroundColor: '#999999', width: '28%', borderRadius: 30, overflow: 'hidden' }} onPress={() => onCancel()}>
                                        <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Close")}</Text>
                                    </Button>
                                    <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: '65%', borderRadius: 30, overflow: 'hidden' }} onPress={() => onVerify()}>
                                        <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Verify")}</Text>
                                    </Button>
                                </HStack>
                            </VStack>
                        </LinearGradient>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    inputbox: { backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 12, width: '100%', overflow: 'hidden', marginVertical: 0 }, inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { borderRadius: 30, marginTop: 10 },
    productimage: { borderColor: '#dddddd', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 10, width: '38%', height: 90, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    productdetails: { width: '58%' },
    productbox: { borderRadius: 20, width: '96%', margin: '2%', backgroundColor: '#f6f6f6', padding: 15, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' }
});

export default GiftVouchersScreen;