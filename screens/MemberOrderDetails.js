import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, NativeBaseProvider, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, StatusBar, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';

const MemberOrderDetailsScreen = ({ navigation, route }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [details, setDetails] = useState("");

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
            setTimeout(function () {
                setLoading(false);
                setDetails(route.params.orderDetails);
            }, 1000);
        });
        return unsubscribe;
    }, [])

    return (
        <NativeBaseProvider>
            <StatusBar barStyle="light-content" backgroundColor={colorTheme.normal} />
            <Box flex={1} bg={"#ffffff"}>
                <HStack style={{ height: 60 }} bg={colorTheme.normal} justifyContent="space-between" alignItems="center" paddingX="4" paddingY="3" space={2}>
                    <HStack alignItems={'center'} space={8}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="chevron-back" size={28} color="#ffffff" />
                        </TouchableOpacity>
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Order Details")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <VStack bg="#eeeeee" space={1} padding="4" mb={6} borderRadius={12}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <Text color="#444444">{t("Order ID")}:</Text>
                                <Text color="#111111" fontSize='2xl' textAlign="center" fontWeight="bold" textTransform="capitalize">{details.orderId}</Text>
                            </HStack>
                            <HStack justifyContent="space-between" alignItems="center">
                                <Text color="#444444">{t("Order Item Id")}:</Text>
                                <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.orderItemId}</Text>
                            </HStack>
                        </VStack>

                        <Box style={styles.productbox}>
                            <Image source={details == "" ? require('../assets/images/noimage.png') : details.product_image == "" ? require('../assets/images/noimage.png') : { uri: details.BaseUrl + details.product_image }} style={{ width: '100%', height: 200, objectFit: 'contain' }} />
                        </Box>

                        <VStack space={3}>
                            <Text color="#111111" fontSize='xl' textAlign="center" fontWeight="medium" textTransform="capitalize">{details.productName}</Text>
                            <VStack bg="#eeeeee" space={2} padding="4" marginY="4" borderRadius={12}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("Product Code")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.productCode}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("Order Quantity")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.quantity}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("Order Date")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.orderDate}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("Order Status")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.status}</Text>
                                </HStack>
                                {details.status != "Open" && details.status != "Cancelled" && (
                                    <Stack space={2}>
                                        <HStack justifyContent="space-between" alignItems="center">
                                            <Text color="#444444">{t("AWB Number")}:</Text>
                                            <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.awbNo}</Text>
                                        </HStack>
                                        <HStack justifyContent="space-between" alignItems="center">
                                            <Text color="#444444">{t("Courier Name")}:</Text>
                                            <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.courierName}</Text>
                                        </HStack>
                                    </Stack>
                                )}
                            </VStack>
                            <VStack bg="#eeeeee" space={2} padding="4" marginBottom="4" borderRadius={12}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("Address")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.address}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("State")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.state_name}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("City")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.city_name}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text color="#444444">{t("Post Code")}:</Text>
                                    <Text color="#111111" style={{ width: 200 }} fontSize='md' textAlign="right" fontWeight="medium" textTransform="capitalize">{details.post_code}</Text>
                                </HStack>
                            </VStack>
                        </VStack>
                        {details.hsn_code == 'EGV' && (
                            <Button variant="outline" mt={4} borderRadius={30} borderColor={colorTheme.normal} onPress={() => navigation.navigate('GiftVouchers')}>
                                <Text color={colorTheme.normal} fontSize="md" fontWeight="medium">{t("Gift Vouchers")}</Text>
                            </Button>
                        )}
                    </Box>
                </ScrollView>
                <HStack paddingY="3" paddingX="6" justifyContent="space-between" alignItems="center" backgroundColor={colorTheme.dark}>
                    <Text color="#eeeeee" fontSize="sm" fontWeight="medium">{t("Total Points")}:</Text>
                    <HStack space={1} alignItems="center" justifyContent={'center'}>
                        <Text color="#ffffff" fontSize="xl" fontWeight="bold">{details.pricePoint}</Text>
                        <Text color="#ffffff" fontSize="sm" fontWeight="bold">{t("Points")}</Text>
                    </HStack>
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
    productbox: { borderRadius: 15, borderColor: '#cccccc', backgroundColor: '#ffffff', marginBottom: 30, borderWidth: 5, padding: 15, marginHorizontal: 5 },
    solidBtn: { width: '48%', borderColor: '#f95b01', borderWidth: 2, backgroundColor: '#ae4203', borderRadius: 30 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default MemberOrderDetailsScreen;
