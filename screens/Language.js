import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, HStack, NativeBaseProvider, Select, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';
import { API_KEY, BASE_URL } from '../auth_provider/Config';

const LanguageScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [languageList] = React.useState([
        { "name": "English", "language_code": "Eng" },
        { "name": "Hindi", "language_code": "Hn" },
        { "name": "Bengali", "language_code": "Bn" },
        { "name": "Odia", "language_code": "Od" }
    ]);
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    useEffect(() => {
        setLoading(true)
        const unsubscribe = navigation.addListener('focus', () => {
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
            }, 500);
        });
        return unsubscribe;
    }, []);

    const saveLanguage = () => {
        if (currentLanguage == '') {
            Toast.show({ description: t("Please select Language") });
        } else {
            AsyncStorage.setItem('language', currentLanguage);
            i18n.changeLanguage(currentLanguage)
                .then(() => setLoading(true))
                .catch(err => console.log(err));
                Toast.show({ description: t("Language Change Successfuly Done.") });
            setTimeout(function () {
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <NativeBaseProvider>
            <StatusBar barStyle="light-content" backgroundColor={colorTheme.normal} />
            <Box flex={1} bg={"#ffffff"}>
                <HStack style={{ height: 60 }} bg={colorTheme.normal} justifyContent="space-between" alignItems="center" paddingX="4" paddingY="3" space={2}>
                    <HStack alignItems={'center'} space={8}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="chevron-back" size={28} color="#ffffff" />
                        </TouchableOpacity>
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Language Change")}</Text>
                    </HStack>
                </HStack>
                <ScrollView>
                    <Box padding="5">
                        <VStack style={{ paddingVertical: 50, paddingHorizontal: 30 }} alignItems="center" justifyContent="center">
                            <Text mb={2} fontSize="lg" fontWeight="bold" color="#666666">{t("Select Language")}</Text>
                            <Stack space={3} style={{ width: '100%', marginTop: 5, marginBottom: 30 }}>
                                <View style={styles.inputbox}>
                                    <Select variant="none" size="lg"
                                        InputLeftElement={<Image source={require('../assets/images/language.png')} style={{ width: 22, objectFit: 'contain', marginLeft: 15, textAlign: 'center' }} />}
                                        selectedValue={currentLanguage}
                                        onValueChange={value => setLanguage(value)}
                                        style={{ paddingLeft: 20, height: 48 }}
                                        _selectedItem={{
                                            backgroundColor: '#eeeeee',
                                            endIcon: <Icon name="checkmark-circle" size={20} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                        }}>
                                        {languageList.map((item, index) =>
                                            <Select.Item key={index} label={item.name} value={item.language_code} />
                                        )}
                                    </Select>
                                </View>
                            </Stack>
                            <Button style={styles.custbtn} backgroundColor={colorTheme.dark} onPress={() => saveLanguage()} marginY={2}>
                                <Text color="#ffffff" fontSize="md" fontWeight="bold">{t("Save")}</Text>
                            </Button>
                        </VStack>
                    </Box>
                </ScrollView>
            </Box>
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
        </NativeBaseProvider >
    )
}

const styles = StyleSheet.create({
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    custbtn: { width: '100%', borderRadius: 30, overflow: 'hidden', height: 48 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' }
});

export default LanguageScreen;
