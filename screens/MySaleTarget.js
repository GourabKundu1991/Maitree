import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, NativeBaseProvider, Select, Stack, Text, Toast, VStack } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';
import moment from 'moment';
import MonthPicker from 'react-native-month-year-picker';
import { BarChart } from 'react-native-gifted-charts';

const MySaleTargetScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [currentMonthYear, setCurrentMonthYear] = React.useState(new Date());
    const [productType, setProductType] = React.useState("Cement");
    const [product, setProduct] = React.useState("");
    const [productList, setProductList] = React.useState([]);

    const [saleData, setSaleData] = React.useState("");

    const [barData, setBarData] = React.useState([]);

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
                formdata.append("tag_name", productType);
                fetch(`${BASE_URL}/fetch_product_by_tag_type`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("fetch_product_by_tag_type:", responseJson);
                        if (responseJson.bstatus == 1) {
                            if (productType == 'Cement') {
                                setProductList(responseJson.cement_product_full_details);
                                setProduct("all");
                                getSaleData(currentMonthYear, productType, 'all');
                            } else if (productType == 'MBM') {
                                setProduct("");
                                setProductList(responseJson.mbm_product_full_details);
                                getSaleData(currentMonthYear, productType, '');
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
                        //console.log("fetch_product_by_tag_type Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const getSaleData = (date, type, prod) => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("date", moment(date).format('YYYY-MM'));
                formdata.append("type", type);
                formdata.append("product_id", prod);
                console.log(formdata);
                fetch(`${BASE_URL}/sales_target`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("sales_target:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setSaleData(responseJson.data);
                            setBarData([{ value: responseJson.data.Target, frontColor: '#42bb52' }, { value: responseJson.data.Achievement, frontColor: '#ff9e04' }])
                        } else {
                            Toast.show({ description: responseJson.message });
                            setSaleData("");
                            setBarData([]);
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
                        console.log("sales_target Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || date;

            hideDatePicker();
            setCurrentMonthYear(selectedDate);
            setLoading(true);
            setBarData([]);
            getSaleData(selectedDate, productType, product);
        }
    );

    const onSelectProductType = (val) => {
        setProductType(val);
        setLoading(true);
        setBarData([]);
        if (val == 'Cement') {
            setProduct("all");
            getSaleData(currentMonthYear, val, 'all');
        } else if (val == 'MBM') {
            setProduct("");
            setSaleData("");
            setLoading(false);
        }
    }

    const onSelectProduct = (val) => {
        setProduct(val);
    }

    const onSearch = () => {
        if (product == '') {
            Toast.show({ description: t("Please select Product and click Search") });
        } else {
            setLoading(true);
            getSaleData(currentMonthYear, productType, product);
        }
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("My Sale Target")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding={5}>
                        <VStack space={3} style={[styles.productbox, { marginBottom: 20, paddingHorizontal: 20 }]}>
                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                <Text style={{ width: '20%' }} fontSize='sm' fontWeight="bold" color={colorTheme.dark}>{t("Month")}</Text>
                                <Pressable style={[styles.inputbox, { width: '78%' }]} onPress={() => showDatePicker()}>
                                    <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"} alignItems={'center'}>
                                        <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 15, marginRight: 10, textAlign: 'center' }} />
                                        <Text color={"#111111"} fontSize="md">{moment(currentMonthYear).format("MMMM, YYYY")}</Text>
                                    </HStack>
                                </Pressable>
                            </HStack>
                            {isDatePickerVisible && (
                                <MonthPicker
                                    onChange={handleConfirm}
                                    value={currentMonthYear}
                                    maximumDate={new Date()}
                                />
                            )}
                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                <Text style={{ width: '20%' }} fontSize='sm' fontWeight="bold" color={colorTheme.dark}>{t("Type")}</Text>
                                <View style={[styles.inputbox, { width: '78%' }]}>
                                    <Select variant="none" size="lg"
                                        placeholder={t("Select Type *")}
                                        InputLeftElement={<Icon name="options-outline" size={20} color="#666666" style={{ marginLeft: 15 }} />}
                                        selectedValue={productType}
                                        onValueChange={value => onSelectProductType(value)}
                                        style={{ paddingLeft: 20, height: 45 }}
                                        _selectedItem={{
                                            backgroundColor: '#eeeeee',
                                            endIcon: <Icon name="checkmark-circle" size={18} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                        }}>
                                        <Select.Item label="Cement" value="Cement" />
                                        <Select.Item label="MBM" value="MBM" />
                                    </Select>
                                </View>
                            </HStack>
                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                <Text style={{ width: '20%' }} fontSize='sm' fontWeight="bold" color={colorTheme.dark}>{t("Product")}</Text>
                                <View style={[styles.inputbox, { width: '78%' }]}>
                                    <Select variant="none" size="lg"
                                        placeholder={t("Select Product")}
                                        InputLeftElement={<Icon name="options-outline" size={20} color="#666666" style={{ marginLeft: 15 }} />}
                                        selectedValue={product}
                                        onValueChange={value => onSelectProduct(value)}
                                        style={{ paddingLeft: 20, height: 45 }}
                                        _selectedItem={{
                                            backgroundColor: '#eeeeee',
                                            endIcon: <Icon name="checkmark-circle" size={18} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                        }}>
                                        {productType == "Cement" && (
                                            <Select.Item label="All" value="all" />
                                        )}
                                        {productList.map((item, index) =>
                                            <Select.Item key={index} label={item.product_name} value={item.product_id} />
                                        )}
                                    </Select>
                                </View>
                            </HStack>
                            <Button size="md" backgroundColor={colorTheme.dark} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'medium', fontSize: 16 }} onPress={() => onSearch()}>{t("Search")}</Button>
                        </VStack>
                        {saleData != "" && (
                            <Stack>
                                {saleData.outstanding != "" && (
                                    <VStack space={3} style={[styles.productbox, { marginBottom: 20, paddingHorizontal: 20 }]}>
                                        <Stack style={{ borderBottomWidth: 1, borderColor: '#cccccc', paddingBottom: 10 }}>
                                            <Text fontSize='md' fontWeight="bold" color="#666666" textAlign={'center'}>{t("Outstanding Amount")}</Text>
                                            {saleData.outstanding_on != "" && (
                                                <Text fontSize='xs' fontWeight="bold" color="#999999" textAlign={'center'}>({saleData.outstanding_on})</Text>
                                            )}
                                        </Stack>
                                        <Text fontSize='xl' fontWeight="bold" color={colorTheme.dark} textAlign={'center'}>{saleData.outstanding}</Text>
                                    </VStack>
                                )}
                            </Stack>
                        )}
                        <Box style={{ borderColor: colorTheme.light, borderWidth: 2, borderRadius: 20, overflow: 'hidden' }}>
                            <VStack style={{ backgroundColor: colorTheme.light, padding: 10 }} justifyContent={'center'} alignItems={'center'}>
                                <Text fontSize='md' fontWeight="bold" color={colorTheme.dark}>{t("Targer v/s Achievement")}</Text>
                            </VStack>
                            {saleData == "" ?
                                <Stack style={{ justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                                    <Text fontSize='md' fontWeight="normal" textAlign="center" color="#777777">{t("No Records Found")}</Text>
                                </Stack>
                                :
                                <VStack style={{ padding: 20 }} justifyContent={'center'} alignItems={'center'}>
                                    <HStack space={6} marginBottom={10} justifyContent={'center'} alignItems={'center'}>
                                        <HStack space={2} alignItems={'center'}>
                                            <View style={{ height: 15, width: 50, backgroundColor: colorTheme.normal }} />
                                            <Text style={{ color: '#666666' }}>{t("Target")}</Text>
                                        </HStack>
                                        <HStack space={2} alignItems={'center'}>
                                            <View style={{ height: 15, width: 50, backgroundColor: '#ff9e04' }} />
                                            <Text style={{ color: '#666666' }}> {t("Achievement")}</Text>
                                        </HStack>
                                    </HStack>

                                    <BarChart data={barData} width={250} barWidth={80} />

                                    <VStack space={3} marginTop={5}>
                                        <HStack space={2} justifyContent={'space-between'} alignItems={'center'} backgroundColor={"#f3f3f3"} style={{ borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, width: '100%' }}>
                                            <Text color='#555555' fontSize='sm'>Product:</Text>
                                            <Text color='#111111' fontSize='sm' fontWeight="medium">{saleData.Product}</Text>
                                        </HStack>
                                        <HStack space={2} justifyContent={'space-between'} alignItems={'center'} backgroundColor={"#f3f3f3"} style={{ borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, width: '100%' }}>
                                            <Text color='#555555' fontSize='sm'>Target:</Text>
                                            <Text color='#111111' fontSize='sm' fontWeight="medium">{saleData.Target}</Text>
                                        </HStack>
                                        <HStack space={2} justifyContent={'space-between'} alignItems={'center'} backgroundColor={"#f3f3f3"} style={{ borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, width: '100%' }}>
                                            <Text color='#555555' fontSize='sm'> {t("Achievement")}:</Text>
                                            <Text color='#111111' fontSize='sm' fontWeight="medium">{saleData.Achievement}</Text>
                                        </HStack>
                                        {saleData.sale_on != "" && (
                                            <HStack space={2} justifyContent={'space-between'} alignItems={'center'} backgroundColor={"#f3f3f3"} style={{ borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, width: '100%' }}>
                                                <Text color='#555555' fontSize='sm'> {t("Achievement as On:")}  </Text>
                                                <Text color='#111111' fontSize='sm' fontWeight="medium">{saleData.sale_on}</Text>
                                            </HStack>
                                        )}
                                        <HStack space={2} justifyContent={'space-between'} alignItems={'center'} backgroundColor={"#f3f3f3"} style={{ borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, width: '100%' }}>
                                            <Text color='#555555' fontSize='sm'>{t("Achieve %:")}  </Text>
                                            <Text color='#111111' fontSize='sm' fontWeight="medium">{saleData.Achieve} %</Text>
                                        </HStack>
                                    </VStack>
                                </VStack>
                            }
                        </Box>
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
    productbox: { borderRadius: 20, backgroundColor: '#f6f6f6', padding: 15, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { width: '100%', borderRadius: 30, overflow: 'hidden', height: 48, marginTop: 10 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default MySaleTargetScreen;
