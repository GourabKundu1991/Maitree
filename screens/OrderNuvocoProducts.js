import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, HStack, NativeBaseProvider, Text, VStack, Toast, Button, Stack, Input, Select } from 'native-base';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';
import LinearGradient from 'react-native-linear-gradient';

const OrderNuvocoProductsScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [dataFound, setDataFound] = React.useState("");

    const [allProducts, setAllProducts] = React.useState([]);

    const [quantity, setQuantity] = React.useState([]);
    const [type, setType] = React.useState([]);

    const [isConfirm, setIsConfirm] = React.useState(false);

    const [successOrder, setSuccessOrder] = React.useState(false);


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
                fetch(`${BASE_URL}/nuvoco_catalog`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("nuvoco_catalog:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setAllProducts(responseJson.products);
                            if (responseJson.products.length != 0) {
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
                        //console.log("nuvoco_catalog Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const updateQuantity = (text, prodId) => {
        if (text == "") {
            delete quantity[prodId];
        } else {
            const newArray = { ...quantity };
            newArray[prodId] = text;
            setQuantity(newArray);
        }
    }

    const updateType = (val, prodId) => {
        const newArray = { ...type };
        newArray[prodId] = val;
        setType(newArray);
    }

    const onContinue = () => {
        if (Object.keys(quantity).length == 0) {
            Toast.show({ description: t("Please enter Quantity") });
        } else {
            let qtyCnt = 0;
            let orderthroughCnt = 1;
            Object.keys(quantity).forEach(key => {
                let valueQty = quantity[key];
                let valueOT = type[key];

                if (valueQty == " " || valueQty == "0") {
                    Toast.show({ description: t("Please enter valid Quantity") });
                    qtyCnt = 0;
                } else if (valueQty.trim() != "" && valueQty != " " && valueQty != "0") {
                    qtyCnt = qtyCnt + 1;
                    if (valueOT == undefined) {
                        Toast.show({ description: t("Please select Order Through") });
                        orderthroughCnt = orderthroughCnt * 0;
                    } else {
                        orderthroughCnt = orderthroughCnt * 1;
                    }
                }
            });
            if (qtyCnt == 0) {
                Toast.show({ description: t("Please enter valid Quantity") });
                setIsConfirm(false);
            } else {
                if (orderthroughCnt == 0) {
                    Toast.show({ description: t("Please select Order Through") });
                    setIsConfirm(false);
                } else {
                    setIsConfirm(true);
                }
            }
        }
    }

    const onModify = () => {
        setIsConfirm(false);
    }

    const placeOrder = () => {
        setLoading(true);
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("products", JSON.stringify(quantity));
                formdata.append("orderThrough", JSON.stringify(type));
                console.log(formdata);
                fetch(`${BASE_URL}/place_nuvoco_order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("place_nuvoco_order:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setSuccessOrder(true);
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
                        //console.log("place_nuvoco_order Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Product Purchase")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        {dataFound == "notfound" && (
                            <Stack space={5} style={[styles.productbox, { height: 350, justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
                                <Icon name="hourglass-outline" size={80} color="#999999" />
                                <Text fontSize='lg' fontWeight="bold" textAlign="center" color="#111111">{t("Result Not Found")}</Text>
                                <Text fontSize='sm' fontWeight="medium" textAlign="center" color="#666666">{t("Whoops... This Information is not available for a moment")}</Text>
                            </Stack>
                        )}
                        {dataFound == "found" && (
                            <VStack>
                                {allProducts.map((item, index) =>
                                    <Box key={index} style={styles.productbox}>
                                        <HStack space="4" alignContent={"centers"}>
                                            <Box style={styles.productimage}>
                                                <Image source={item.ProductImage == "" ? require('../assets/images/noimage.png') : { uri: item.BaseUrl + item.ProductImage }} style={{ width: 100, height: 90 }} resizeMode='contain' />
                                            </Box>
                                            <VStack style={styles.productdetails} justifyContent={"center"} >
                                                <Text fontSize='lg' color={colorTheme.dark} fontWeight="bold" mb="2">{item.productName}</Text>
                                                {!isConfirm ?
                                                    <Stack space={2}>
                                                        <View style={styles.inputbox}>
                                                            <Input size="md" height={35} value={quantity[item.productId]} onChangeText={(text) => updateQuantity(text, item.productId)} variant="unstyled" keyboardType='number-pad' InputLeftElement={<Icon name="keypad-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 15, textAlign: 'center' }} />} placeholder={t("Quantity")} />
                                                        </View>
                                                        <View style={styles.inputbox}>
                                                            <Select variant="none" size="md" height={35}
                                                                placeholder={t("Order Through")}
                                                                InputLeftElement={<Icon name="options-outline" size={20} color="#666666" style={{ marginLeft: 15 }} />}
                                                                selectedValue={type[item.productId]}
                                                                onValueChange={value => updateType(value, item.productId)}
                                                                style={{ paddingLeft: 20, height: 45 }}
                                                                _selectedItem={{
                                                                    backgroundColor: '#eeeeee',
                                                                    endIcon: <Icon name="checkmark-circle" size={18} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                                                }}>
                                                                <Select.Item label="Self Order" value="Self Order" />
                                                                <Select.Item label="Order through Site Visit" value="Order through Site Visit" />
                                                                <Select.Item label="Order Generated in Meeting" value="Order Generated in Meeting" />
                                                            </Select>
                                                        </View>
                                                    </Stack>
                                                    :
                                                    <Stack space={2}>
                                                        <View style={styles.inputbox}>
                                                            <HStack justifyContent="space-between" alignContent="center" paddingY={1} paddingX={2}>
                                                                <Text color={"#666666"} fontSize="sm" fontWeight="medium">{t("Quantity")}:</Text>
                                                                <Text color={"#111111"} fontSize="md" fontWeight="bold">{quantity[item.productId] ? quantity[item.productId] : "0"} {item.UnitName}</Text>
                                                            </HStack>
                                                        </View>
                                                        {type[item.productId] &&
                                                            <VStack justifyContent="space-between" alignContent="center" paddingX={2}>
                                                                <Text color={"#666666"} fontSize="sm" fontWeight="medium">{t("Order Through")}:</Text>
                                                                <Text color={"#111111"} fontSize="md" fontWeight="bold">{type[item.productId]}</Text>
                                                            </VStack>
                                                        }
                                                    </Stack>
                                                }
                                            </VStack>
                                        </HStack>
                                    </Box>
                                )}
                            </VStack>
                        )}
                    </Box>
                </ScrollView>
                {!isConfirm ?
                    <HStack backgroundColor={"#eeeeee"} paddingY="3" paddingX="6" justifyContent="space-between">
                        <Button style={[styles.solidBtn, { width: '100%' }]} borderColor={colorTheme.dark} backgroundColor={colorTheme.dark} onPress={() => onContinue()}>
                            <Text color={"#ffffff"} fontSize="md" fontWeight="medium">{t("Continue")}</Text>
                        </Button>
                    </HStack>
                    :
                    <HStack backgroundColor={"#eeeeee"} paddingY="3" paddingX="6" justifyContent="space-between">
                        <Button style={styles.outlineBtn} borderColor={colorTheme.dark} backgroundColor={"#ffffff"} onPress={() => onModify()}>
                            <Text color={colorTheme.dark} fontSize="md" fontWeight="medium">{t("Modify Order")}</Text>
                        </Button>
                        <Button style={styles.solidBtn} backgroundColor={colorTheme.dark} borderColor={colorTheme.dark} onPress={() => placeOrder()}>
                            <Text color={"#ffffff"} fontSize="md" fontWeight="medium">{t("Place Order")}</Text>
                        </Button>
                    </HStack>
                }
            </Box>
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
                            <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: 180, borderRadius: 30, overflow: 'hidden' }} onPress={() => {setSuccessOrder(false); navigation.navigate('Home');}} marginY={4}>
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
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    solidBtn: { width: '48%', borderWidth: 1, borderRadius: 30 },
    outlineBtn: { width: '48%', borderWidth: 1, borderRadius: 30 },
    productbox: { borderRadius: 20, width: '96%', margin: '2%', backgroundColor: '#f6f6f6', padding: 15, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    productimage: { borderColor: '#dddddd', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 10, width: '30%', height: 125, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    productdetails: { width: '65%' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default OrderNuvocoProductsScreen;
