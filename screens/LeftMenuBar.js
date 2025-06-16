import { Avatar, Box, HStack, NativeBaseProvider, Pressable, Stack, Text, VStack, View } from 'native-base';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import Events from '../auth_provider/Events';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

const LeftMenuBarScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [colorTheme, setColorTheme] = React.useState("");

    const [mainMenu, setMainMenu] = React.useState([]);
    const [profileData, setProfileData] = React.useState([]);
    const [profilePic, setProfilePic] = React.useState("");
    const [pointData, setPointData] = React.useState([]);
    const [userType, setUserType] = React.useState("");

    useEffect(() => {
        Events.subscribe('mainMenu', (data) => {
            setMainMenu(data);
        });
        Events.subscribe('profileData', (data) => {
            setProfileData(JSON.parse(data).profile);
            if (JSON.parse(data).profile.profile_pic) {
                setProfilePic(JSON.parse(data).profile.BaseUrl + JSON.parse(data).profile.profile_pic);
            }
            setPointData(JSON.parse(data).points);
        });
        Events.subscribe('colorTheme', (data) => {
            setColorTheme(data);
        });
    }, []);

    const onLogout = () => {
        Alert.alert(
            t("Alert"),
            t("Are you sure to logout") + "?",
            [
                {
                    text: t("Cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: t("Yes"), onPress: () => {
                        AsyncStorage.clear();
                        navigation.closeDrawer();
                        navigation.navigate('Welcome');
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <NativeBaseProvider>
            <Box flex={1} bg="white" overflow="hidden">
                <HStack space={3} alignItems="center" backgroundColor={colorTheme.normal} padding={5}>
                    <Avatar w="20%" borderColor="#eeeeee" resizeMode="contain" borderWidth="1" size="md" source={profilePic ? { uri: profilePic } : require('../assets/images/avatar.png')}>
                    </Avatar>
                    <VStack w="80%" justifyContent="center">
                        <Text color="#ffffff" fontSize="md" fontWeight="bold">{profileData.firstName} {profileData.lastName}</Text>
                        <Text color="#ffffff" fontSize="xs" fontWeight="medium">{t("Phone")}: {profileData.mobile}</Text>
                        <Text color="#ffffff" fontSize="xs" fontWeight="medium">{t("Member ID")}: {profileData.ID}</Text>
                        {profileData.tier != "" && (
                            <Text color="#ffffff" fontSize="xs" fontWeight="medium">{t("Tier")}: {profileData.tier}</Text>
                        )}
                        <Text color="#ffffff" fontSize="xs" fontWeight="medium">{t("Total Points")}: {profileData.total_point}</Text>
                        <Text color="#ffffff" fontSize="xs" fontWeight="medium">{t("Available Points")}: {profileData.available_point}</Text>
                    </VStack>
                </HStack>

                <ScrollView>
                    <Stack padding={6}>
                        {mainMenu.map((item, index) =>
                            <Pressable key={index} onPress={() => navigation.navigate(item.url)} borderColor="#cccccc" borderBottomWidth="0.5" paddingY={3}>
                                <HStack space={5} alignItems="center">
                                    <Icon name={item.icon} size={20} color="#aaaaaa" />
                                    <Text color="#777777" fontSize="sm" textTransform={"capitalize"}>{item.title}</Text>
                                </HStack>
                            </Pressable>
                        )}
                        <Pressable onPress={() => onLogout()} paddingY={3}>
                            <HStack space={3} alignItems="center">
                                <Icon name="power" size={20} color="#aaaaaa" />
                                <Text color="#777777" fontSize="sm" fontWeight="medium">{t("Logout")}</Text>
                            </HStack>
                        </Pressable>
                    </Stack>
                </ScrollView>
            </Box>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    icon: { width: 60, height: 60, resizeMode: 'cover' },
    okbtn: { backgroundColor: '#f9d162', borderRadius: 50, overflow: 'hidden', width: '80%', justifyContent: 'center', alignItems: 'center', height: 45 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
});

export default LeftMenuBarScreen;