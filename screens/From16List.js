import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, NativeBaseProvider, Select, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView, Platform, Share } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const From16ListScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");
    
    const [dataFound, setDataFound] = React.useState("");

    const [fromList, setFromList] = React.useState([]);
    const [isPDF, setIsPDF] = React.useState(false);
    const [source, setSource] = React.useState("");

    const [FYList, setFYList] = React.useState([]);
    const [selectedYear, setSelectedYear] = React.useState("");

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
            getFinancialYear();
        });
        return unsubscribe;
    }, []);

    const getFinancialYear = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/get_financial_year`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.log("Financial:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setFYList(responseJson.financial_year);
                            setSelectedYear(responseJson.financial_year[0].fyear);
                            getAllData(responseJson.financial_year[0].fyear);
                        } else {
                            Toast.show({ description: responseJson.message });
                            setFYList([]);
                            setTimeout(function () {
                                setLoading(false);
                                if (responseJson.msg_code == "msg_1000") {
                                    AsyncStorage.clear();
                                    navigation.navigate('Login');
                                }
                            }, 1000);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        //console.log("Financial Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Login');
            }
        });
    }

    const getAllData = (filterYear) => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("financial_year", filterYear);
                fetch(`${BASE_URL}/get_form16_list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.log("From16:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setFromList(responseJson.form16);
                            if (responseJson.form16.length == 0) {
                                setDataFound("notfound");
                            } else {
                                setDataFound("found");
                            }
                        } else {
                            Toast.show({ description: responseJson.message });
                            setTimeout(function () {
                                setLoading(false);
                                if (responseJson.msg_code == "msg_1000") {
                                    AsyncStorage.clear();
                                    navigation.navigate('Login');
                                }
                            }, 1000);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        //console.log("From16 Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Login');
            }
        });
    }

    const onView = (url) => {
        setIsPDF(true);
        setSource(url);
    }

    const onDownload = (details) => {
        const fileName = "From16_Quater" + details.quarter;
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
            .fetch('GET', details.docs)
            .then((res) => {
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

    const onSelectYear = (val) => {
        setSelectedYear(val);
        setLoading(true);
        getAllData(val);
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold">{t("TDS Certificates")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <Box style={styles.productbox}>
                            <Stack mb="4" pb="3" borderBottomWidth={1} borderColor="#bbbbbb">
                                <Text color={colorTheme.dark} fontSize="md" fontWeight="bold" textAlign="center">{t("Financial Year")}</Text>
                            </Stack>
                            <HStack justifyContent="space-between" bg="#444444" style={{ padding: 10, borderRadius: 30, overflow: 'hidden' }}>
                                <View style={[styles.inputbox, { borderRadius: 30, marginVertical: 0, backgroundColor: '#ffffff' }]}>
                                    <Select variant="underlined" size="md" placeholder={t("Select Year")}
                                        selectedValue={selectedYear}
                                        onValueChange={value => onSelectYear(value)}
                                        style={{ paddingLeft: 15, height: 35 }}
                                        _selectedItem={{
                                            backgroundColor: '#eeeeee',
                                            endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                        }}>
                                        {FYList.map((item, index) =>
                                            <Select.Item key={index} label={"FY " + item.fyear} value={item.fyear} />
                                        )}
                                    </Select>
                                </View>
                            </HStack>
                        </Box>
                        {dataFound == "notfound" && (
                            <Stack space={5} style={[styles.productbox, { height: 350, justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
                                <Icon name="hourglass-outline" size={80} color="#999999" />
                                <Text fontSize='lg' fontWeight="bold" textAlign="center" color="#111111">{t("Result Not Found")}</Text>
                                <Text fontSize='sm' fontWeight="medium" textAlign="center" color="#666666">{t("Whoops... This Information is not available for a moment")}</Text>
                            </Stack>
                        )}
                        {dataFound == "found" && (
                            <VStack>
                                {fromList.map((item, index) =>
                                    <Box key={index} style={styles.productbox}>
                                        <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                            <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Name")}:</Text>
                                            <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{item.first_name} {item.last_name}</Text>
                                        </HStack>
                                        <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                            <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Member Code")}:</Text>
                                            <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{item.id_extern01}</Text>
                                        </HStack>
                                        {item.company != "" && (
                                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Company Name")}:</Text>
                                                <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{item.company}</Text>
                                            </HStack>
                                        )}
                                        <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                            <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Financial Year")}:</Text>
                                            <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{item.financial_year}</Text>
                                        </HStack>
                                        {item.quarter == 0 ?
                                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Type")}:</Text>
                                                <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{t("Annual")}</Text>
                                            </HStack>
                                            :
                                            <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2} borderColor="#dddddd" borderBottomWidth={1}>
                                                <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Quarter")}:</Text>
                                                <Text color="#111111" fontSize="sm" textAlign="center" fontWeight="bold">{item.quarter}</Text>
                                            </HStack>
                                        }
                                        <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                            <Text color="#666666" fontSize="xs" textAlign="center" fontWeight="medium" textTransform="capitalize">{t("Document")}:</Text>
                                            <Icon name="document-attach-outline" size={36} color="#111111" />
                                        </HStack>
                                        <HStack justifyContent="space-between" alignItems="center" w="100%" padding={2}>
                                            <Button size="sm" backgroundColor={'#111111'} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'bold', fontSize: 13 }} onPress={() => onView(item.docs)}>{t("View Document")}</Button>
                                            <Button size="sm" backgroundColor={colorTheme.dark} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'bold', fontSize: 13 }} onPress={() => onDownload(item)}>{t("Download")}</Button>
                                        </HStack>
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
            {isPDF && (
                <View style={styles.spincontainer}>
                    <TouchableOpacity onPress={() => setIsPDF(false)}>
                        <Icon name="close-circle-outline" size={32} color="#ffffff" />
                    </TouchableOpacity>
                    <Pdf
                        trustAllCerts={false}
                        source={{
                            uri: source,
                            cache: true,
                        }}
                        style={styles.pdf} />
                </View>
            )}
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    pdf: { width: '96%', height: '80%', marginHorizontal: '2%', marginTop: 10 },
    inputbox: { backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 12, width: '100%', overflow: 'hidden', marginVertical: 7 },
    custbtn: { width: '48%', borderRadius: 30, overflow: 'hidden' },
    productbox: { borderRadius: 20, width: '96%', margin: '2%', borderColor: '#eeeeee', backgroundColor: '#f6f6f6', padding: 15, borderWidth: 2, overflow: 'hidden' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default From16ListScreen;
