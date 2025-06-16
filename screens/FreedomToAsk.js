import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, HStack, NativeBaseProvider, Text, VStack, Toast, Stack, Actionsheet, useDisclose, Select, Button } from 'native-base';
import React, { useCallback, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, FlatList, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import RangeSlider from 'react-native-range-slider-expo/src/RangeSlider';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const F2AScreen = ({ navigation, route }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");
    const [dataFound, setDataFound] = React.useState("");

    const [allDataList, setAllDataList] = React.useState([]);

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
                    Events.publish('colorTheme', JSON.parse(val).info.theme_color);
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
                fetch(`${BASE_URL}/f2f_landing_page_details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("f2f_landing_page_details:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setAllDataList(responseJson.f2f_landing_details);
                            setDataFound("found");
                        } else {
                            Toast.show({ description: responseJson.message });
                            setAllDataList([]);
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
                        //console.log("f2f_landing_page_details Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onContinue = (program) => {
        if (program.related_program) {
            navigation.navigate("F2ARelatedProgram", { programData: JSON.stringify(program.related_program) });
        } else {
            navigation.navigate("F2ACategory", { programData: program });
        }
    }

    const renderData = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={styles.productbox} onPress={() => onContinue(item)}>
                <VStack space={2} alignItems="center" justifyContent="center" height="100">
                    {item.logo_url != "" && (
                        <Image source={{ uri: item.logo_url }} style={{ width: 60, height: 60 }} resizeMode='contain' />
                    )}
                    <Text textAlign={'center'} fontSize='sm' fontWeight="bold">{item.name}</Text>
                </VStack>
            </TouchableOpacity>
        );
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Freedom To Ask")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding={5}>
                        {dataFound == "notfound" ?
                            <Stack space={5} style={[styles.productbox, { height: 350, width: '100%', marginHorizontal: 0, justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
                                <Icon name="hourglass-outline" size={80} color="#999999" />
                                <Text fontSize='lg' fontWeight="bold" textAlign="center" color="#111111">{t("Result Not Found")}</Text>
                                <Text fontSize='sm' fontWeight="medium" textAlign="center" color="#666666">{t("Whoops... This Information is not available for a moment")}</Text>
                            </Stack>
                            :
                            <HStack flexWrap="wrap">
                                <FlatList
                                    scrollEnabled={false}
                                    data={allDataList}
                                    renderItem={renderData}
                                    numColumns={2}
                                />
                            </HStack>
                        }
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
    solidBtn: { width: '48%', borderColor: '#111111', borderWidth: 2, backgroundColor: '#111111', borderRadius: 10 },
    outlineBtn: { width: '48%', borderColor: '#111111', borderWidth: 2, backgroundColor: 'none', borderRadius: 10 },
    inputbox: { backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 12, width: '100%', overflow: 'hidden', marginVertical: 7 },
    noti: { color: '#ffffff', width: 18, height: 18, borderRadius: 20, position: 'absolute', top: -5, right: -3, fontSize: 11, lineHeight: 16, paddingTop: 1, textAlign: 'center', overflow: 'hidden' },
    productbox: { borderRadius: 20, width: '46%', margin: '2%', backgroundColor: '#f6f6f6', padding: 10, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    productimage: { borderColor: '#dddddd', backgroundColor: '#ffffff', marginBottom: 10, borderWidth: 1, borderRadius: 10, width: '100%', height: 90, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default F2AScreen;