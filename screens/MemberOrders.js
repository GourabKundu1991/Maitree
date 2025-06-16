import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, HStack, NativeBaseProvider, Text, VStack, Toast, Button, Stack, Input } from 'native-base';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';

const MemberOrdersScreen = ({ navigation, route }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [dataFound, setDataFound] = React.useState("");

    const [allOrders, setAllOrders] = React.useState([]);

    const [searchTerm, setSearchTerm] = React.useState("");

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
                formdata.append("memberId", route.params.memId);
                formdata.append("order_number", searchTerm);
                fetch(`${BASE_URL}/child_member_orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("child_member_orders:", responseJson);
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
                        //console.log("child_member_orders Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    onSearch = () => {
        setLoading(true);
        getAllData();
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Order List")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <VStack style={[styles.productbox, { marginBottom: 20 }]}>
                            <View style={styles.inputbox}>
                                <Input size="lg" onChangeText={(text) => setSearchTerm(text)} variant="unstyled" InputLeftElement={<Icon name="search-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 15, textAlign: 'center' }} />} placeholder={t("Search by Order ID")} />
                            </View>
                            <Button size="md" backgroundColor={colorTheme.dark} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'medium', fontSize: 16 }} onPress={() => onSearch()}>{t("Search")}</Button>
                        </VStack>
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
                                        <Button size="xs" backgroundColor={colorTheme.dark} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'bold', fontSize: 12 }} onPress={() => navigation.navigate("MemberOrderDetails", { orderDetails: item })}>{t("Details")}</Button>
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
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { borderRadius: 30, marginTop: 20, overflow: 'hidden' },
    productbox: { borderRadius: 20, width: '96%', margin: '2%', backgroundColor: '#f6f6f6', padding: 15, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    productimage: { borderColor: '#dddddd', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 10, width: '38%', height: 100, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    productdetails: { width: '58%' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default MemberOrdersScreen;
