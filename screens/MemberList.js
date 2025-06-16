import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, Input, NativeBaseProvider, Select, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView, Pressable, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const MemberListScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [memberRoll, setMemberRoll] = React.useState("");
    const [memberSearch, setMemberSearch] = React.useState("");
    const [allMembers, setAllMembers] = React.useState([]);
    const [memberList, setMemberList] = React.useState([]);

    const [dataFound, setDataFound] = React.useState("");

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
                fetch(`${BASE_URL}/member_roles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("member_roles:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setAllMembers(responseJson.member_hierarchies);
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
                        //console.log("member_roles Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onSelectMemberRoll = (val) => {
        setMemberRoll(val);
        searchMemberListData(val);
    }

    const searchMemberListData = (memberId) => {
        setLoading(true);
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("hier_id", memberId);
                formdata.append("search_key", memberSearch);
                fetch(`${BASE_URL}/member_listing`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("member_listing:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setMemberList(responseJson.member_lists);
                            if (responseJson.member_lists.length != 0) {
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
                        //console.log("member_listing Error:", error);
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Member List")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding={5}>
                        <VStack space={3} style={[styles.productbox, { marginBottom: 20 }]}>
                            <View style={styles.inputbox}>
                                <Select variant="none" size="lg"
                                    placeholder={t("Select Member Role *")}
                                    InputLeftElement={<Icon name="options-outline" size={20} color="#666666" style={{ marginLeft: 15 }} />}
                                    selectedValue={memberRoll}
                                    onValueChange={value => onSelectMemberRoll(value)}
                                    style={{ paddingLeft: 20, height: 45 }}
                                    _selectedItem={{
                                        backgroundColor: '#eeeeee',
                                        endIcon: <Icon name="checkmark-circle" size={18} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                    }}>
                                    {allMembers.map((item, index) =>
                                        <Select.Item key={index} label={item.name} value={item.id} />
                                    )}
                                </Select>
                            </View>
                            {memberRoll != "" && (
                                <Stack space={3}>
                                    <View style={styles.inputbox}>
                                        <Input size="lg" onChangeText={(text) => setMemberSearch(text)} variant="unstyled" InputLeftElement={<Icon name="search-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 15, textAlign: 'center' }} />} placeholder={t("Member Code / Phone")} />
                                    </View>
                                    <Button size="md" backgroundColor={colorTheme.dark} style={styles.custbtn} variant="link" _text={{ color: "#ffffff", fontWeight: 'medium', fontSize:16 }} onPress={() => searchMemberListData(memberRoll)}>{t("Search")}</Button>
                                </Stack>
                            )}
                        </VStack>
                        {dataFound == "notfound" ?
                            <Stack space={5} style={[styles.productbox, { height: 350, justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
                                <Icon name="hourglass-outline" size={80} color="#999999" />
                                <Text fontSize='lg' fontWeight="bold" textAlign="center" color="#111111">{t("Result Not Found")}</Text>
                                <Text fontSize='sm' fontWeight="medium" textAlign="center" color="#666666">{t("Whoops... This Information is not available for a moment")}</Text>
                            </Stack>
                            :
                            <VStack space={3}>
                                {memberList.map((item, index) =>
                                    <Pressable key={index} style={styles.productbox} onPress={() => navigation.navigate("MemberChild", {memId: item.id})}>
                                        <HStack justifyContent={"space-between"} alignItems={"center"}>
                                            <VStack space={2}>
                                                <Stack>
                                                    <Text fontSize='lg' fontWeight="bold" color={colorTheme.dark}>{item.company_name}</Text>
                                                    <Text fontSize='xs'>({item.id_extern01})</Text>
                                                </Stack>
                                                <Pressable onPress={() => Linking.openURL(`tel:${item.phone_number}`)}>
                                                    <HStack space={2}>
                                                        <Stack justifyContent="center" alignItems="center" style={{ backgroundColor: colorTheme.dark, width: 22, height: 22, borderRadius: 6 }}><Icon name="call" size={14} color="#ffffff" /></Stack>
                                                        <Text fontSize='md' fontWeight="medium" color="#666666">{item.phone_number}</Text>
                                                    </HStack>
                                                </Pressable>
                                            </VStack>
                                            <Icon name="arrow-forward-circle-outline" size={28} color={colorTheme.dark} />
                                        </HStack>
                                    </Pressable>
                                )}
                            </VStack>
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

    )
}

const styles = StyleSheet.create({
    productbox: { borderRadius: 20, backgroundColor: '#f6f6f6', padding: 15, borderColor: '#eeeeee', borderWidth: 2, overflow: 'hidden' },
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { width: '100%', borderRadius: 30, overflow: 'hidden', height: 48 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default MemberListScreen;
