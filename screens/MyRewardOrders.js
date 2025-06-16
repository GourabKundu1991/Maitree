import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, HStack, NativeBaseProvider, Text, VStack, Toast, Button, Stack } from 'native-base';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const MyRewardOrdersScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [dataFound, setDataFound] = React.useState("");

    const [allOrders, setAllOrders] = React.useState([]);

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
                fetch(`${BASE_URL}/myorders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Order:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setAllOrders(responseJson.order_list);
                            if (responseJson.order_list.length != 0) {
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
                        //console.log("Order Error:", error);
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("My Reward Orders")}</Text>
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
                                {allOrders.map((item, index) =>
                                    <Box key={index} style={styles.productbox}>
                                        <HStack space="4">
                                            <Box style={styles.productimage}>
                                                <Image source={item.product_image == "" ? require('../assets/images/noimage.png') : { uri: item.BaseUrl + item.product_image }} style={{ width: 100, height: 90 }} resizeMode='contain' />
                                            </Box>
                                            <VStack style={styles.productdetails}>
                                                <Text fontSize='md' color={colorTheme.dark} fontWeight="bold" mb="2">{item.productName}</Text>
                                                <HStack space="2" alignItems="center">
                                                    <Text fontSize='xs'>{t("Order Id")}:</Text>
                                                    <Text fontSize='xs' fontWeight="bold"> {item.orderId}</Text>
                                                </HStack>
                                                <HStack space="2" alignItems="center">
                                                    <Text fontSize='xs'>{t("Order Item Id")}:</Text>
                                                    <Text fontSize='xs' fontWeight="bold"> {item.orderItemId}</Text>
                                                </HStack>
                                                <HStack space="2" alignItems="center">
                                                    <Text fontSize='xs'>{t("Price Point")}:</Text>
                                                    <Text fontSize='xs' fontWeight="bold"> {item.pricePoint}</Text>
                                                </HStack>
                                                <HStack space="2" alignItems="center">
                                                    <Text fontSize='xs'>{t("Date")}:</Text>
                                                    <Text fontSize='xs' fontWeight="bold"> {item.orderDate}</Text>
                                                </HStack>
                                                <HStack space="2" alignItems="center" mt="1" flexWrap="wrap">
                                                    <Text fontSize='xs'>{t("Status")}:</Text>
                                                    <Text fontSize='xs' fontWeight="bold">{item.status}</Text>
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                        {item.vendor_details != null && (
                                            <View style={{ marginTop: 20, borderColor: '#cccccc', borderWidth: 1, backgroundColor: '#ffffff', borderRadius: 15, overflow: 'hidden' }}>
                                                <View backgroundColor={colorTheme.light} style={{ padding: 5 }}><Text fontSize='sm' textAlign={'center'} fontWeight="bold" color={colorTheme.dark}>{t("Vendor Details")}</Text></View>
                                                <VStack space={1} paddingY={2} paddingX={5}>
                                                    <HStack space={2} alignItems={'center'}>
                                                        <Icon name="business-sharp" size={16} color={'#111111'} />
                                                        <Text fontSize='xs'>{item.vendor_details.firm_name}</Text>
                                                    </HStack>
                                                    <HStack space={2} alignItems={'center'}>
                                                        <Icon name="location-sharp" size={16} color={'#111111'} />
                                                        <Stack>
                                                            <Text fontSize='xs'>{item.vendor_details.full_address}</Text>
                                                            <Text fontSize='xs'>{item.vendor_details.city_name}, {item.vendor_details.state_name}</Text>
                                                        </Stack>
                                                    </HStack>
                                                    <HStack space={2} alignItems={'center'}>
                                                        <Icon name="call-sharp" size={16} color={'#111111'} />
                                                        <Text fontSize='xs'>{item.vendor_details.phone_number}</Text>
                                                    </HStack>
                                                </VStack>
                                            </View>
                                        )}
                                        <Button size="xs" backgroundColor={colorTheme.dark} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'bold', fontSize: 12 }} onPress={() => navigation.navigate("OrderDetails", { orderDetails: item })}>{t("Details")}</Button>
                                    </Box>
                                )}
                            </VStack>
                        )}
                    </Box>
                </ScrollView>
            </Box>
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    custbtn: { borderRadius: 30, marginTop: 20, overflow: 'hidden' },
    productbox: { borderRadius: 20, width: '96%', margin: '2%', backgroundColor: '#f6f6f6', padding: 15, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    productimage: { borderColor: '#dddddd', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 10, width: '38%', height: 100, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    productdetails: { width: '58%' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default MyRewardOrdersScreen;
