import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actionsheet, Avatar, Box, HStack, NativeBaseProvider, Stack, Text, Toast, VStack, useDisclose } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const PerformanceUpdateScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [performanceDetails, setPerformanceDetails] = React.useState("");
    const [allSales, setAllSales] = React.useState([]);

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
                fetch(`${BASE_URL}/show_performance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("show_performance:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setPerformanceDetails(responseJson);
                            setAllSales(responseJson.sales);
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
                        //console.log("show_performance Error:", error);
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Performance Update")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <View style={{ borderColor: '#eeeeee', borderWidth: 2, borderRadius: 15, overflow: 'hidden' }}>
                            <View style={{ backgroundColor: '#eeeeee', padding: 7, textAlign: 'center' }}>
                                <Text color="#666666" fontSize="sm" textAlign="center" fontWeight="medium">{performanceDetails.eligibility_tier}</Text>
                            </View>
                            <View style={{ padding: 7, textAlign: 'center' }}>
                                <Text color={colorTheme.dark} fontSize="sm" textAlign="center" fontWeight="medium" textTransform="capitalize">{performanceDetails.balance_quantity}</Text>
                            </View>
                        </View>
                        <VStack space={5} style={{ borderColor: colorTheme.light, borderWidth: 2, borderRadius: 15, overflow: 'hidden', marginVertical: 20, padding: 15 }}>
                            <VStack style={{ backgroundColor: "#f4f4f4", borderRadius: 15, overflow: 'hidden', padding: 10 }}>
                                <Text color="#666666" fontSize="md" textAlign="center" fontWeight="medium">{performanceDetails.retain_tier_name}</Text>
                                <Text color="#cccccc" fontSize="md" textAlign="center" fontWeight="medium">---------------------------------------</Text>
                                <Text color={colorTheme.dark} fontSize="xl" textAlign="center" fontWeight="bold">{performanceDetails.retentionSaleVolExcess}</Text>
                            </VStack>
                            <VStack style={{ backgroundColor: "#f4f4f4", borderRadius: 15, overflow: 'hidden', padding: 10 }}>
                                <Text color="#666666" fontSize="md" textAlign="center" fontWeight="medium">{performanceDetails.qualify_tier_name}</Text>
                                <Text color="#cccccc" fontSize="md" textAlign="center" fontWeight="medium">---------------------------------------</Text>
                                <Text color={colorTheme.dark} fontSize="xl" textAlign="center" fontWeight="bold">{performanceDetails.upgradationSaleVolExcess}</Text>
                            </VStack>
                            <Text color="#ff0000" fontSize="xs" textAlign="center">**All Values are in Metric Tonnes (MT)</Text>
                        </VStack>
                        <VStack space={5}>
                            {allSales.map((item, index) =>
                                <View key={index} style={{ borderColor: colorTheme.light, borderWidth: 1, borderRadius: 15, overflow: 'hidden' }}>
                                    <View style={{ backgroundColor: colorTheme.light, padding: 8, textAlign: 'center' }}>
                                        <Text color={colorTheme.dark} fontSize="lg" textAlign="center" fontWeight="bold">{item.month_name}</Text>
                                    </View>
                                    <HStack justifyContent={"space-between"} style={{ paddingHorizontal: 12, paddingVertical: 10, textAlign: 'center', flexWrap: 'wrap', width: '100%' }}>
                                        {item.sale_details.map((subitem, subindex) =>
                                            <View key={subindex} style={{ width:'46%', borderColor: '#eeeeee', borderWidth: 2, borderRadius: 15, overflow: 'hidden', margin: '2%' }}>
                                                <View style={{ backgroundColor: '#eeeeee', padding: 5, textAlign: 'center' }}>
                                                    <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium">{subitem.product_name}</Text>
                                                </View>
                                                <View style={{ padding: 5, textAlign: 'center' }}>
                                                    <Text color={colorTheme.dark} fontSize="sm" textAlign="center" fontWeight="medium" textTransform="capitalize">{subitem.tonnage_sold}</Text>
                                                </View>
                                            </View>
                                        )}
                                    </HStack>
                                </View>
                            )}
                        </VStack>
                    </Box>
                </ScrollView>
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
    avatar: { elevation: 10, marginVertical: 20, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 10, borderColor: "#ffffff", borderWidth: 4, backgroundColor: '#ffffff' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default PerformanceUpdateScreen;
