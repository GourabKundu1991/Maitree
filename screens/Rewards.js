import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, HStack, NativeBaseProvider, Text, VStack, Toast, Stack, Actionsheet, useDisclose, Select, Button } from 'native-base';
import React, { useCallback, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, FlatList, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { API_KEY, BASE_URL } from '../auth_provider/Config';
import RangeSlider from 'react-native-range-slider-expo/src/RangeSlider';
import { useTranslation } from 'react-i18next';
import i18n from '../assets/language/i18n';

const RewardScreen = ({ navigation, route }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");
    const [dataFound, setDataFound] = React.useState("");

    const [pageNumber, setPageNumber] = React.useState(1);
    const [isLoadMore, setIsLoadMore] = React.useState(true);
    const [allProducts, setAllProducts] = React.useState([]);
    const [inCart, setInCart] = React.useState(0);
    const [allCategory, setAllCategory] = React.useState([]);

    const [cateId, setCateId] = React.useState(0);

    const { isOpen, onOpen, onClose } = useDisclose();
    const [pointRange, setPointRange] = React.useState("");
    const [fromValue, setFromValue] = React.useState(0);
    const [toValue, setToValue] = React.useState(0);

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
                formdata.append("pageNumber", 1);
                formdata.append("min", fromValue);
                formdata.append("max", toValue);
                formdata.append("filter", 1);
                formdata.append("categoryId", route.params ? route.params.cateId : cateId);
                fetch(`${BASE_URL}/catalog`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Rewards:", responseJson);
                        if (responseJson.bstatus == 1) {
                            countCart();
                            setAllProducts(responseJson.products);
                            setAllCategory(responseJson.categories);
                            setPointRange(responseJson.minMax);
                            setDataFound("found");
                            if (fromValue == "") {
                                setFromValue(responseJson.minMax.min);
                            }
                            if (toValue == "") {
                                setToValue(responseJson.minMax.max);
                            }
                        } else {
                            Toast.show({ description: responseJson.message });
                            setAllProducts([]);
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
                        //console.log("Rewards Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const countCart = () => {
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                fetch(`${BASE_URL}/mycartcount`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Cart:", responseJson);
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            setInCart(responseJson.total_count);
                        } else {
                            setLoading(false);
                            setInCart(0);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        //console.log("Cart Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
    }

    const onApply = () => {
        setLoading(true);
        onClose();
        getAllData();
    }

    const onClear = useCallback(() => {
        setLoading(true);
        onClose();
        setCateId(0);
        setPageNumber(1);
        setIsLoadMore(true);
        setFromValue(pointRange.min);
        setToValue(pointRange.max);
        setTimeout(function () {
            getAllData();
        }, 1000);
    }, [],
    );

    const renderProduct = ({ item, index }) => {
        return (
            <VStack key={index} style={styles.productbox}>
                <TouchableOpacity onPress={() => navigation.navigate("ProductDetails", { details: item })}>
                    <Box style={styles.productimage}>
                        <Image source={item.ProductImage == "" ? require('../assets/images/noimage.png') : { uri: item.BaseUrl + item.ProductImage }} style={{ width: 100, height: 90 }} resizeMode='contain' />
                    </Box>
                    <Stack padding={1}>
                        <Text textAlign={'center'} fontSize='sm' mb="2">{item.productName.substring(0, 30)}</Text>
                        <Text textAlign={'center'} fontWeight="bold" fontSize='md' color={colorTheme.dark}>{item.pricePoints} {t("points")}</Text>
                    </Stack>
                </TouchableOpacity>
            </VStack>
        );
    }

    const loadMore = () => {
        let num = pageNumber + 1;
        console.log(num);
        setLoading(true);
        AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
                let formdata = new FormData();
                formdata.append("token", JSON.parse(val).token);
                formdata.append("APIkey", `${API_KEY}`);
                formdata.append("orgId", JSON.parse(val).org_id);
                formdata.append("pageNumber", num);
                formdata.append("min", fromValue);
                formdata.append("max", toValue);
                formdata.append("filter", 1);
                formdata.append("categoryId", route.params ? route.params.cateId : cateId);
                fetch(`${BASE_URL}/catalog`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.bstatus == 1) {
                            setLoading(false);
                            let newArrya = allProducts.concat(responseJson.products);
                            setAllProducts(newArrya);
                            setPageNumber(num);
                        } else {
                            setLoading(false);
                            setIsLoadMore(false);
                            setPageNumber(1);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        //console.log("Rewards Error:", error);
                        Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                    });
            } else {
                setLoading(false);
                AsyncStorage.clear();
                navigation.navigate('Welcome');
            }
        });
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Rewards")}</Text>
                    </HStack>
                    <HStack space={2}>
                        <TouchableOpacity onPress={onOpen} style={{ position: 'relative' }}>
                            <Icon name="options" size={28} color="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.push('Cart')} style={{ position: 'relative' }}>
                            <Icon name="cart" size={28} color="#ffffff" />
                            {inCart != 0 && (<Text style={[styles.noti, { backgroundColor: '#000000' }]}>{inCart}</Text>)}
                        </TouchableOpacity>
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
                                    data={allProducts}
                                    renderItem={renderProduct}
                                    numColumns={2}
                                />
                            </HStack>
                        }
                        {isLoadMore && allProducts.length > 9 && (
                            <HStack paddingY="3" paddingX="6" justifyContent="center">
                                <Button variant="outline" size={'xs'} rounded={30} onPress={() => loadMore()}>
                                    <Text color="#bbbbbb">{t("Load More")}</Text>
                                </Button>
                            </HStack>
                        )}
                    </Box>
                </ScrollView>
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                    <Actionsheet.Content>
                        <ScrollView style={{ width: '100%', paddingHorizontal: 15 }}>
                            <Text textAlign="center" mt="5" mb={2} fontWeight="bold">{t("Category By")}</Text>
                            <View style={styles.inputbox}>
                                <Select variant="underlined" size="md" placeholder={t("Select Category")} w="100%"
                                    InputLeftElement={<Icon name="funnel-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />}
                                    selectedValue={cateId}
                                    onValueChange={value => setCateId(value)}
                                    _selectedItem={{
                                        backgroundColor: '#eeeeee',
                                        endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                    }}>
                                    {allCategory.map((item, index) =>
                                        <Select.Item key={index} label={item.categoryName} value={item.categoryId} />
                                    )}
                                </Select>
                            </View>
                            <Text textAlign="center" mt="5" fontWeight="bold">{t("Points Range")} ({fromValue} - {toValue})</Text>
                            <HStack justifyContent="space-between" alignItems="center">
                                <RangeSlider min={Number(pointRange.min)} max={Number(pointRange.max)} step={500}
                                    fromValueOnChange={value => setFromValue(value)}
                                    toValueOnChange={value => setToValue(value)}
                                    initialFromValue={fromValue}
                                    initialToValue={toValue}
                                    fromKnobColor={'#111111'}
                                    toKnobColor={'#111111'}
                                    knobSize={25}
                                    barHeight={8}
                                    showValueLabels={false}
                                    valueLabelsBackgroundColor='#444444'
                                    inRangeBarColor={colorTheme.normal}
                                />
                            </HStack>
                        </ScrollView>
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

export default RewardScreen;