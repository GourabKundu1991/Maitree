import { Box, Button, Checkbox, HStack, Input, NativeBaseProvider, ScrollView, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ImageBackground, Keyboard, Linking, Platform, Pressable, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import Carousel from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import i18n from '../assets/language/i18n';
import LinearGradient from 'react-native-linear-gradient';
import Events from '../auth_provider/Events';
import moment from 'moment';

import PushControllerService from '../auth_provider/PushController';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

const HomeScreen = ({ navigation }) => {

    PushControllerService({ navigation });

    const BannerWidth = Dimensions.get('window').width;
    const BannerHeight = 240;

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [totalcart, setTotalcarte] = React.useState(0);
    const [allBanners, setAllBanners] = React.useState([]);
    const [allcategories, setAllcategories] = React.useState([]);
    const [homeMenu, setHomeMenu] = React.useState([]);
    const [voucherPop, setVoucherPop] = React.useState(false);
    const [awareCheck, setAwareCheck] = React.useState(false);

    const [isPending, setIsPending] = React.useState(false);
    const [isKYC, setIsKYC] = React.useState(false);

    const [profileDetails, setProfileDetails] = React.useState("");

    const [selectedORG, setSelectedORG] = React.useState("");

    const [orgName, setOrgName] = React.useState("");
    const [duplicateAccount, setDuplicateAccount] = React.useState([]);

    const [tierUrl, setTierUrl] = React.useState("");

    const goBannerDetails = (dataValue) => {
        if (dataValue.open_type == 1) {
            if (Platform.OS == "android") {
                Linking.openURL(dataValue.android_target_link);
            } else {
                Linking.openURL(dataValue.ios_target_link);
            }
        }
    }
    const renderBanner = ({ item, index }) => {
        return (
            <View key={index} style={styles.sliderbanner}>
                <TouchableOpacity onPress={() => goBannerDetails(item)}>
                    <Image style={{ width: BannerWidth, height: BannerHeight, resizeMode: 'contain', marginLeft: -46 }} source={item.image ? { uri: item.image } : require('../assets/images/noimage.png')} />
                </TouchableOpacity>
            </View>
        );
    }

    const requestNotificationPermission = async () => {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        return result;
    };

    const checkNotificationPermission = async () => {
        const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        return result;
    };

    const requestPermission = async () => {
        const checkPermission = await checkNotificationPermission();
        if (checkPermission !== RESULTS.GRANTED) {
            const request = await requestNotificationPermission();
            if (request !== RESULTS.GRANTED) {
                // permission not granted
            }
        }
    };

    useEffect(() => {
        requestPermission();
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
                    getAllData(JSON.parse(val).org_id);
                }
            });
        });
        return unsubscribe;
    }, []);

    const getAllData = (selectedORG) => {
        AsyncStorage.getItem('userToken').then(val => {
            setColorTheme(JSON.parse(val).info.theme_color);
            Events.publish('colorTheme', JSON.parse(val).info.theme_color);
            setDuplicateAccount(JSON.parse(val).has_duplicate_account);
            setOrgName(JSON.parse(val).org_name);
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", selectedORG);
                console.log("formdata: ", formdata);
                fetch(`${BASE_URL}/get_dashboard_info`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Dashboard:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setTierUrl(responseJson.tier_url);
                            if (responseJson.have_location_info == 0) {
                                navigation.navigate('TakeStorePicture');
                                Events.publish('mainMenu', []);
                            } else {
                                setAllBanners(responseJson.banners);
                                setHomeMenu(responseJson.home_menu);
                                setAllcategories(responseJson.categories);
                                setTotalcarte(responseJson.total_cart_count);
                                if (responseJson.is_approved == 2) {
                                    Events.publish('mainMenu', responseJson.menu);
                                    AsyncStorage.getItem('kycPOPstatus').then(statusvalue => {
                                        if (statusvalue != 'checked') {
                                            setIsKYC(true);
                                        }
                                    })
                                } else {
                                    if (responseJson.is_approved == 0) {
                                        Events.publish('mainMenu', responseJson.menu);
                                        AsyncStorage.getItem('kycPOPstatus').then(statusvalue => {
                                            if (statusvalue != 'checked') {
                                                setIsPending(true);
                                            }
                                        })
                                    } else {
                                        if (responseJson.voucher_expiry_pop_up_status == true) {
                                            AsyncStorage.getItem('voucher').then(valVou => {
                                                if (valVou != null) {
                                                    if (valVou == moment(new Date()).format('DD, MMMM')) {
                                                        Events.publish('mainMenu', responseJson.menu);
                                                    } else {
                                                        setVoucherPop(true);
                                                        Events.publish('mainMenu', []);
                                                    }
                                                } else {
                                                    setVoucherPop(true);
                                                    Events.publish('mainMenu', []);
                                                }
                                            })
                                        } else {
                                            Events.publish('mainMenu', responseJson.menu);
                                        }
                                    }
                                }
                            }

                            fetch(`${BASE_URL}/profile`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                                body: formdata
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    setLoading(false);
                                    //console.log("Profile:", responseJson);
                                    if (responseJson.bstatus == 1) {
                                        setProfileDetails(responseJson.profile);
                                        Events.publish('profileData', JSON.stringify(responseJson));
                                    } else {
                                        Toast.show({ description: responseJson.message });
                                    }
                                })
                                .catch((error) => {
                                    setLoading(false);
                                    //console.log("Profile Error:", error);
                                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                                });
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
                        //console.log("Dashboard Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const updateKYC = () => {
        navigation.navigate('UpdateKYC');
    }

    const onUnlock = () => {
        if (awareCheck == false) {
            Toast.show({ description: t("Please check 'I am aware of'") });
        } else {
            setLoading(true);
            AsyncStorage.getItem('userToken').then(val => {
                if (val != null) {
                    let formdata = new FormData();
                    formdata.append("token", JSON.parse(val).token);
                    formdata.append("APIkey", `${API_KEY}`);
                    formdata.append("orgId", JSON.parse(val).org_id);
                    fetch(`${BASE_URL}/addVoucherExpiryDetails`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formdata
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log("addVoucherExpiryDetails:", responseJson);
                            if (responseJson.bstatus == 1) {
                                AsyncStorage.setItem('voucher', moment(new Date()).format('DD, MMMM'));
                                setVoucherPop(false);
                                navigation.navigate('MyGiftVouchers');
                                setLoading(false);
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                            //console.log("addVoucherExpiryDetails Error:", error);
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

    const onClose = () => {
        AsyncStorage.setItem('kycPOPstatus', 'checked');
        setIsKYC(false);
        setIsPending(false);
    }

    const onSwitchAcct = () => {
        Alert.alert(
            t("Warning"),
            t("Do you want to switch your account") + "?",
            [
                {
                    text: t("Cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: t("Yes"), onPress: () => {
                        setLoading(true);
                        AsyncStorage.getItem('userToken').then(val => {
                            if (val != null) {
                                let formdata = new FormData();
                                formdata.append("APIkey", `${API_KEY}`);
                                formdata.append("token", JSON.parse(val).token);
                                fetch(`${BASE_URL}/switch_account`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                    body: formdata
                                })
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        console.log("switch_account:", responseJson);
                                        if (responseJson.status == 'success') {
                                            AsyncStorage.setItem('userToken', JSON.stringify(responseJson));
                                            getAllData(responseJson.org_id);
                                        }
                                    })
                                    .catch((error) => {
                                        setLoading(false);
                                        //console.log("switch_account Error:", error);
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
            ],
            { cancelable: false }
        );
    }


    return (
        <NativeBaseProvider>
            <StatusBar barStyle="light-content" backgroundColor={colorTheme.normal} />
            <Box flex={1} bg={"#ffffff"}>
                <HStack style={{ height: 60 }} bg={colorTheme.normal} justifyContent="space-between" alignItems="center" paddingX="4" paddingY="3" space={2}>
                    <HStack alignItems={'center'} space={8}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Icon name="menu" size={28} color="#ffffff" />
                        </TouchableOpacity>
                        <VStack>
                            <Text color="#ffffff" fontSize="13" fontWeight="medium" textTransform="capitalize">{t("Welcome")},</Text>
                            <Text color="#ffffff" fontSize="15" textAlign="center" fontWeight="bold" textTransform="capitalize">{profileDetails.firstName} {profileDetails.lastName} ({profileDetails.tier})</Text>
                        </VStack>
                    </HStack>
                    <TouchableOpacity onPress={() => navigation.push('Cart')} style={{ position: 'relative' }}>
                        <Icon name="cart" size={28} color="#ffffff" />
                        {totalcart != 0 && (<Text style={[styles.noti, { backgroundColor: "#000000" }]}>{totalcart}</Text>)}
                    </TouchableOpacity>
                </HStack>
                <ScrollView>
                    <Box bg={colorTheme.normal} style={{ paddingBottom: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' }}>
                        <Carousel
                            layout={"default"}
                            data={allBanners}
                            sliderWidth={BannerWidth}
                            itemWidth={320}
                            autoplay={true}
                            loop={true}
                            renderItem={renderBanner} />
                    </Box>
                    <Box paddingY="3" paddingX="5" marginTop={5}>
                        {/* <Button onPress={() => Linking.openURL(tierUrl)} size="sm" style={{ backgroundColor: "#111111", borderRadius: 10, overflow: 'hidden' }} marginY={4}>
                            <Text color="#ffffff" fontSize="sm" fontWeight="bold">{t("Tier Status")}</Text>
                        </Button> */}
                        {duplicateAccount.length > 1 && (
                            <Stack backgroundColor={"#eeeeee"} padding={5} borderRadius={15} overflow={'hidden'} marginBottom={5}>
                                <HStack justifyContent="center" alignItems="center" space={3}>
                                    <Text color="#000000" fontSize={orgName == "Nuvoco" ? 16 : 12} fontWeight={orgName == "Nuvoco" ? "bold" : "normal"}>DG</Text>
                                    <Pressable onPress={() => onSwitchAcct()} position="relative">
                                        <View style={{ backgroundColor: orgName == "Nuvoco" ? '#2BBB86' : '#ec2832', display: 'flex', alignItems: orgName == "Nuvoco" ? 'flex-start' : 'flex-end', borderRadius: 30, overflow: 'hidden', width: 70, height: 30, borderColor: '#ffffff', borderWidth: 1, padding: 4 }}>
                                            <View style={{ backgroundColor: '#ffffff', width: 20, height: 20, borderRadius: 30, overflow: 'hidden' }}></View>
                                        </View>
                                    </Pressable>
                                    <Text color="#000000" fontSize={orgName == "Nipun" ? 16 : 12} fontWeight={orgName == "Nipun" ? "bold" : "normal"}>DB</Text>
                                </HStack>
                            </Stack>
                        )}
                        <Box style={{ zIndex: 9 }}>
                            <Text color="#111111" bg={"#ffffff"} paddingX="5" alignSelf="center" textAlign="center" fontSize="16" fontWeight="bold">{t('Shop by Category')}</Text>
                        </Box>
                        <Stack style={{ borderColor: "#cccccc", borderTopWidth: 2, paddingVertical: 35, marginTop: -12, overflow: 'hidden' }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {allcategories.map((item, index) =>
                                    <TouchableOpacity key={index} onPress={() => navigation.navigate("/rewards", { cateId: item.categoryId })} style={{ width: 80, marginRight: allcategories.length - 1 == index ? 0 : 8 }}>
                                        <VStack justifyContent="center" alignItems="center">
                                            <Stack justifyContent="center" alignItems="center" style={{ borderColor: '#d0e0d2', borderWidth: 2, borderRadius: 25, width: 70, height: 70, position: 'relative', zIndex: 9, paddingHorizontal: 5, marginBottom: 5 }}>
                                                <Icon name={item.categoryImage} size={32} color={colorTheme.normal} />
                                            </Stack>
                                            <VStack style={styles.dashInner} justifyContent="center" alignItems="center">
                                                <Text color="#111111" fontSize="12" textAlign="center" fontWeight="bold">{item.categoryName}</Text>
                                            </VStack>
                                        </VStack>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </Stack>
                        <Box style={{ zIndex: 9 }}>
                            <Text color="#111111" bg={"#ffffff"} paddingX="5" alignSelf="center" textAlign="center" fontSize="16" fontWeight="bold">{t('Quick Links')}</Text>
                        </Box>
                        <Stack style={{ borderColor: "#cccccc", borderTopWidth: 2, paddingVertical: 35, marginTop: -12, overflow: 'hidden' }}>
                            <HStack flexWrap="wrap" alignItems="center" justifyContent="center">
                                {homeMenu.map((item, index) =>
                                    <TouchableOpacity style={[styles.linkbox, { backgroundColor: colorTheme.normal }]} onPress={() => navigation.navigate(item.url)}>
                                        <VStack space={2} justifyContent="center" alignItems="center" margin="2">
                                            <Icon name={item.icon} size={36} color={'#ffffff'} />
                                            <Text color="#ffffff" fontSize="14" textAlign="center" fontWeight="bold">{item.title}</Text>
                                        </VStack>
                                    </TouchableOpacity>
                                )}
                            </HStack>
                        </Stack>
                    </Box>
                </ScrollView>
            </Box>
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
            {isPending && (
                <View style={styles.spincontainer}>
                    <LinearGradient
                        colors={['#ffffff', "#cccccc"]}
                        start={{ x: 0.5, y: 0 }}
                        style={{ width: 300, borderRadius: 15, overflow: 'hidden' }}
                    >
                        <VStack space={1} w="100%" paddingX="5" paddingY="10" alignItems="center" justifyContent="center">
                            <Icon name="hourglass-outline" size={100} color={colorTheme.dark}></Icon>
                            <Text mt={8} mb={5} fontSize="2xl" fontWeight="bold" color="#111111">{t("Pending")}</Text>
                            <Text textAlign="center" fontSize="sm" fontWeight="medium" color="#111111" mb={3}>{t("Your EKYC is in Pending Mode. Please click continue to use app")}.</Text>
                            <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: 180, borderRadius: 30, overflow: 'hidden' }} onPress={() => onClose()} marginY={4}>
                                <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Continue")}</Text>
                            </Button>
                        </VStack>
                    </LinearGradient>
                </View>
            )}
            {isKYC && (
                <View style={styles.spincontainer}>
                    <LinearGradient
                        colors={['#ffffff', "#cccccc"]}
                        start={{ x: 0.5, y: 0 }}
                        style={{ width: 300, borderRadius: 15, overflow: 'hidden' }}
                    >
                        <VStack space={1} w="100%" paddingX="5" paddingY="10" alignItems="center" justifyContent="center">
                            <Icon name="warning-outline" size={100} color={colorTheme.dark}></Icon>
                            <Text mt={8} mb={5} fontSize="2xl" fontWeight="bold" color="#111111">{t("Warning")}</Text>
                            <Text textAlign="center" fontSize="sm" fontWeight="medium" color="#111111" mb={3}>{t("Your E-KYC Rejected / Not verified. Please click on Update to continue")}.</Text>
                            <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: 180, borderRadius: 30, overflow: 'hidden' }} onPress={() => updateKYC()} marginY={4}>
                                <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Update")}</Text>
                            </Button>
                            <Button size="sm" style={{ backgroundColor: '#999999', width: 180, borderRadius: 30, overflow: 'hidden' }} onPress={() => onClose()} marginBottom={3}>
                                <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Close")}</Text>
                            </Button>
                        </VStack>
                    </LinearGradient>
                </View>
            )}
            {voucherPop && (
                <View style={styles.spincontainer}>
                    <LinearGradient
                        colors={["#ffffff", "#cccccc"]}
                        start={{ x: 0.5, y: 0 }}
                        style={{ width: 300, borderRadius: 15, overflow: 'hidden' }}
                    >
                        <VStack space={1} w="100%" paddingX="5" paddingY="5" alignItems="center" justifyContent="center">
                            <Icon name="warning-outline" size={100} color={colorTheme.dark}></Icon>
                            <Text mt={8} mb={3} fontSize="xl" fontWeight="bold" color="#111111">{t("Voucher Expiry Reminder")} !</Text>
                            <Text textAlign="center" fontSize="sm" fontWeight="medium" color="#111111" mb={3}>{t("Your Gift Voucher id locked. You can unlock it now and use your gift voucher before it get expired")}.</Text>
                            <Stack marginY="4" flexWrap="wrap" backgroundColor={"rgba(255,255,255,0.7)"} style={{ paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, overflow: 'hidden' }}>
                                <Checkbox colorScheme="orange" shadow={2} onChange={() => setAwareCheck(!awareCheck)} accessibilityLabel="Checkbox">
                                    {t("I am aware of")}
                                </Checkbox>
                            </Stack>
                            <HStack justifyContent={"space-evenly"} width={"100%"}>
                                <Button size="sm" variant="outline" style={{ borderColor: '#111111', width: 120, borderRadius: 30, overflow: 'hidden' }} onPress={() => onLogout()} marginY={4}>
                                    <Text color="#111111" fontSize="sm" fontWeight="medium">{t("Logout")}</Text>
                                </Button>
                                <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: 120, borderRadius: 30, overflow: 'hidden' }} onPress={() => onUnlock()} marginY={4}>
                                    <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Unlock Now")}</Text>
                                </Button>
                            </HStack>
                        </VStack>
                    </LinearGradient>
                </View>
            )}
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    noti: { color: '#ffffff', width: 18, height: 18, borderRadius: 20, position: 'absolute', top: -5, right: -3, fontSize: 11, lineHeight: 16, paddingTop: 1, textAlign: 'center', overflow: 'hidden' },
    sliderbanner: { borderRadius: 20, overflow: 'hidden', borderColor: '#ffffff', borderWidth: 1, elevation: 10, marginVertical: 15, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 10, height: 240, backgroundColor: '#eeeeee' },
    linkbox: { borderRadius: 20, width: '30.33%', margin: '1.5%', height: 130, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default HomeScreen;