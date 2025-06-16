import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, NativeBaseProvider, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, StatusBar, View, useWindowDimensions, Alert } from 'react-native';
import RenderHTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const ProductDetailsScreen = ({ navigation, route }) => {

    const { width } = useWindowDimensions();
    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [details, setDetails] = useState("");
    const [inCart, setInCart] = React.useState(0);
    const [productImage, setProductImage] = useState("");

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
            setDetails(route.params.details);
            if (route.params.details.ProductImage != "") {
                setProductImage(route.params.details.ProductImage);
            }
            countCart();
        });
        return unsubscribe;
    }, [])

    const countCart = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/mycartcount`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Cart:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setInCart(responseJson.total_count);
                        } else {
                            setInCart(0);
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
                        //console.log("Cart Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const addToCart = (type) => {
        setLoading(true);
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("prod_id", details.productId);
                formdata.append("price", details.pricePoints);
                formdata.append("prod_name", details.productName);
                formdata.append("price_in_points", details.pricePoints);
                formdata.append("quantity", 1);
                fetch(`${BASE_URL}/addcart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.log("Add Cart:", responseJson);
                        if (responseJson.bstatus == 1) {
                            countCart();
                            Toast.show({ description: responseJson.message });
                            setTimeout(function () {
                                if (type == "BuyNow") {
                                    navigation.navigate('Cart');
                                }
                            }, 100);
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
                        console.log("Add Cart Error:", error);
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Product Details")}</Text>
                    </HStack>
                    <TouchableOpacity onPress={() => navigation.push('Cart')} style={{ position: 'relative' }}>
                        <Icon name="cart" size={28} color="#ffffff" />
                        {inCart != 0 && (<Text style={[styles.noti, { backgroundColor: '#000000' }]}>{inCart}</Text>)}
                    </TouchableOpacity>
                </HStack>
                <ScrollView>
                    <Box padding={5}>
                        <Box style={styles.productbox}>
                            <Image source={productImage == "" ? require('../assets/images/noimage.png') : { uri: details.BaseUrl + details.ProductImage }} style={{ width: '100%', height: 220 }} resizeMode='contain' />
                        </Box>
                        <VStack space={3}>
                            <Text color="#111111" fontSize='xl' textAlign="center" fontWeight="medium" textTransform="capitalize">{details.productName}</Text>
                            <Text color={colorTheme.dark} fontSize='24' textAlign="center" fontWeight="bold" textTransform="capitalize">{details.pricePoints} <Text color={colorTheme.dark} fontSize='md' textAlign="center" textTransform="capitalize">{t("Points")}</Text></Text>
                            <VStack bg="#eeeeee" space={2} padding="4" marginY="4" borderRadius={12}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("Product Code")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='sm' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.ProductCode}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("product Id")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='sm' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.productId}</Text>
                                </HStack>
                            </VStack>
                            <VStack bg="#ffffff" paddingX="4" borderRadius={12}>
                                <Text color="#888888">{t("Description")}:</Text>
                                <RenderHTML contentWidth={width} baseStyle={{ color: '#444444', fontSize: 14 }} source={{ html: details.ProductDesc }} />
                            </VStack>
                        </VStack>
                    </Box>
                </ScrollView>
                <HStack backgroundColor={colorTheme.dark} paddingY="3" paddingX="6" justifyContent="space-between">
                    <Button style={styles.outlineBtn} onPress={() => addToCart("AddCart")}>
                        <Text color="#ffffff" fontSize="md" fontWeight="medium">{t("Add to Cart")}</Text>
                    </Button>
                    <Button style={styles.solidBtn} backgroundColor={colorTheme.light} borderColor={colorTheme.light} onPress={() => addToCart("BuyNow")}>
                        <Text color={colorTheme.dark} fontSize="md" fontWeight="medium">{t("Buy Now")}</Text>
                    </Button>
                </HStack>
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
    noti: { color: '#ffffff', width: 18, height: 18, borderRadius: 20, position: 'absolute', top: -5, right: -3, fontSize: 11, lineHeight: 16, paddingTop: 1, textAlign: 'center', overflow: 'hidden' },
    productbox: { borderRadius: 20, borderColor: '#cccccc', backgroundColor: '#eeeeee', marginBottom: 30, borderWidth: 3, marginHorizontal: 5 },
    solidBtn: { width: '48%', borderWidth: 1, borderRadius: 10 },
    outlineBtn: { width: '48%', borderColor: '#ffffff', borderWidth: 1, backgroundColor: 'none', borderRadius: 10 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default ProductDetailsScreen;
