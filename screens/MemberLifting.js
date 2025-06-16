import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actionsheet, Box, Button, HStack, Input, NativeBaseProvider, Select, Stack, Text, Toast, VStack, useDisclose } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView, Pressable, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const MemberLiftingScreen = ({ navigation, route }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [allData, setAllData] = React.useState([]);

    const { isOpen, onOpen, onClose } = useDisclose();

    const [productSearch, setProductSearch] = React.useState("");
    const [fromDate, setFromDate] = React.useState("");
    const [tillDate, setTillDate] = React.useState("");

    const [dateFor, setDateFor] = React.useState("");

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
            getAllData(productSearch, fromDate, tillDate);
        });
        return unsubscribe;
    }, []);

    const getAllData = (valSearch, valfromDate, valtillDate) => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("memberId", route.params.memId);
                formdata.append("from_date", (valfromDate != "" ? moment(valfromDate).format("YYYY-MM-DD") : ""));
                formdata.append("till_date", (valtillDate != "" ? moment(valtillDate).format("YYYY-MM-DD") : ""));
                formdata.append("product_code", valSearch);
                console.log(formdata);
                fetch(`${BASE_URL}/child_member_sales`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("child_member_sales:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setAllData(responseJson.trnasc_list);
                        } else {
                            Toast.show({ description: responseJson.message });
                            setAllData([]);
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
                        //console.log("child_member_sales Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const showDatePicker = (val) => {
        setDatePickerVisibility(true);
        setDateFor(val);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        if (dateFor == "fromDate"){
            setFromDate(date);
        } else if (dateFor == "toDate"){
            setTillDate(date);
        }
        
    };

    const onClear = () => {
        setLoading(true);
        onClose();
        setFromDate("");
        setTillDate("");
        setProductSearch("");
        getAllData("", "", "");
    }

    const onApply = () => {
        setLoading(true);
        onClose();
        getAllData(productSearch, fromDate, tillDate);
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Member Lifting")}</Text>
                    </HStack>
                    <TouchableOpacity onPress={onOpen} style={{ position: 'relative' }}>
                        <Icon name="funnel-outline" size={28} color="#ffffff" />
                    </TouchableOpacity>
                </HStack>
                <ScrollView>
                    <Box padding={5}>
                        {allData.length == 0 ?
                            <Stack space={5} style={[styles.productbox, { height: 350, justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
                                <Icon name="hourglass-outline" size={80} color="#999999" />
                                <Text fontSize='lg' fontWeight="bold" textAlign="center" color="#111111">{t("Result Not Found")}</Text>
                                <Text fontSize='sm' fontWeight="medium" textAlign="center" color="#666666">{t("Whoops... This Information is not available for a moment")}</Text>
                            </Stack>
                            :
                            <VStack space={3}>
                                {allData.map((item, index) =>
                                    <Box key={index} style={styles.productbox}>
                                        {item.id != "" && (
                                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Transaction Id")}:</Text>
                                                <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{item.id}</Text>
                                            </HStack>
                                        )}
                                        {item.product_name != "" && (
                                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Product")}:</Text>
                                                <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{item.product_name}</Text>
                                            </HStack>
                                        )}
                                        {item.tonnage_sold != "" && (
                                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("QTY")}:</Text>
                                                <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{item.tonnage_sold}</Text>
                                            </HStack>
                                        )}
                                        {item.sale_date != "" && (
                                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                                <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Date")}:</Text>
                                                <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold" textTransform="capitalize">{item.sale_date}</Text>
                                            </HStack>
                                        )}
                                    </Box>
                                )}
                            </VStack>
                        }
                    </Box>
                </ScrollView>
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                    <Actionsheet.Content>
                        <VStack space={3} style={{ width: '100%', padding: 15 }}>
                            <View style={styles.inputbox}>
                                <Input size="lg" onChangeText={(text) => setProductSearch(text)} variant="unstyled" InputLeftElement={<Icon name="search-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 15, textAlign: 'center' }} />} placeholder={t("Product Name")} />
                            </View>
                            <Pressable style={styles.inputbox} onPress={() => showDatePicker("fromDate")}>
                                <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"} alignItems={'center'}>
                                    <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 15, marginRight: 10, textAlign: 'center' }} />
                                    <Text color={tillDate != "" ? "#111111" : "#999999"} fontSize="lg">{fromDate != "" ? moment(fromDate).format("DD MMMM, YYYY") : t("From Date")}</Text>
                                </HStack>
                            </Pressable>
                            <Pressable style={styles.inputbox} onPress={() => showDatePicker("toDate")}>
                                <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"} alignItems={'center'}>
                                    <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 15, marginRight: 10, textAlign: 'center' }} />
                                    <Text color={tillDate != "" ? "#111111" : "#999999"} fontSize="lg">{tillDate != "" ? moment(tillDate).format("DD MMMM, YYYY") : t("To Date")}</Text>
                                </HStack>
                            </Pressable>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </VStack>
                        <HStack paddingY="3" paddingX="6" mt={5} space={3} justifyContent="space-between">
                            <Button style={styles.outlineBtn} onPress={() => onClear()}>
                                <Text color="#111111" fontSize="md" fontWeight="medium">{t("Reset")}</Text>
                            </Button>
                            <Button style={styles.solidBtn} onPress={() => onApply()}>
                                <Text color="#ffffff" fontSize="md" fontWeight="medium">{t("Apply")}</Text>
                            </Button>
                        </HStack>
                    </Actionsheet.Content>
                </Actionsheet>
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
    productbox: { borderRadius: 20, backgroundColor: '#f6f6f6', padding: 10, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    solidBtn: { width: '48%', borderColor: '#111111', borderWidth: 2, backgroundColor: '#111111', borderRadius: 10 },
    outlineBtn: { width: '48%', borderColor: '#111111', borderWidth: 2, backgroundColor: 'none', borderRadius: 10 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default MemberLiftingScreen;
