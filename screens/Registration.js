import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actionsheet, Box, Button, HStack, Input, NativeBaseProvider, Pressable, Select, Stack, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, StatusBar, View, ScrollView, Keyboard, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_KEY, BASE_URL, CONTACT_HIER_ID, ORG_ID, PROGRAM_ID } from '../auth_provider/Config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import CheckBox from '@react-native-community/checkbox';

const RegistrationScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [currentLanguage, setLanguage] = React.useState('Eng');
    const [loading, setLoading] = React.useState(false);
    const [colorTheme, setColorTheme] = React.useState("");

    const [orgID, setOrgID] = React.useState("");
    const [firmName, setFirmName] = React.useState("");
    const [sapCode, setSapCode] = React.useState("");
    const [csrfToken, setCSRFToken] = React.useState("");

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = React.useState("");

    const [selectedStep, setSelectedStep] = React.useState(1);
    const [step1, setStep1] = React.useState("done");
    const [step2, setStep2] = React.useState("");
    const [step3, setStep3] = React.useState("");
    const [step4, setStep4] = React.useState("");
    const [step5, setStep5] = React.useState("");
    const [step6, setStep6] = React.useState("");
    const [step7, setStep7] = React.useState("");

    const [firstName, setFirstName] = React.useState("");
    const [middleName, setMiddleName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [gender, setGender] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [dob, setDOB] = React.useState("");
    const [maritalStatus, setMaritalStatus] = React.useState("");
    const [anniversary, setAnniversary] = React.useState("");

    const [address1, setAddress1] = React.useState("");
    const [address2, setAddress2] = React.useState("");
    const [address3, setAddress3] = React.useState("");
    const [pinCode, setPinCode] = React.useState("");
    const [state, setState] = React.useState("");
    const [stateName, setStateName] = React.useState("");
    const [district, setDistrict] = React.useState("");
    const [districtName, setDistrictName] = React.useState("");
    const [city, setCity] = React.useState("");

    const [sameAddress, setSameAddress] = React.useState(false);

    const [address1Per, setAddress1Per] = React.useState("");
    const [address2Per, setAddress2Per] = React.useState("");
    const [address3Per, setAddress3Per] = React.useState("");
    const [pinCodePer, setPinCodePer] = React.useState("");
    const [statePer, setStatePer] = React.useState("");
    const [stateNamePer, setStateNamePer] = React.useState("");
    const [districtPer, setDistrictPer] = React.useState("");
    const [districtNamePer, setDistrictNamePer] = React.useState("");
    const [cityPer, setCityPer] = React.useState("");

    const [aadhaarCard, setAadhaarCard] = React.useState("");
    const [aadhaarFrontImage, setAadhaarFrontImage] = React.useState("");
    const [aadhaarBackImage, setAadhaarBackImage] = React.useState("");
    const [panCard, setPanCard] = React.useState("");
    const [panImage, setPanImage] = React.useState("");
    const [gstCard, setGstCard] = React.useState("");
    const [gstImage, setGstImage] = React.useState("");
    const [profileImage, setProfileImage] = React.useState("");
    const [signatureImage, setSignatureImagee] = React.useState("");
    const [addressImage, setAddressImage] = React.useState("");
    const [agreedDoc, setAgreedDoc] = React.useState(false);
    const [isPicker, setIsPicker] = React.useState(false);
    const [imageType, setImageType] = React.useState("");

    const [aggreagate_and_sand, set_aggreagate_and_sand] = React.useState(false);
    const [clay_bricks, set_clay_bricks] = React.useState(false);
    const [fly_ash_bricks, set_fly_ash_bricks] = React.useState(false);
    const [wall_putty, set_wall_putty] = React.useState(false);
    const [water_proofing_compounds, set_water_proofing_compounds] = React.useState(false);
    const [tiles_adhesive, set_tiles_adhesive] = React.useState(false);
    const [iron_and_steel, set_iron_and_steel] = React.useState(false);
    const [paints, set_paints] = React.useState(false);
    const [gcc, set_gcc] = React.useState(false);
    const [asbestos, set_asbestos] = React.useState(false);
    const [color_sheets, set_color_sheets] = React.useState(false);
    const [tiles, set_tiles] = React.useState(false);
    const [sanitary_or_hardware, set_sanitary_or_hardware] = React.useState(false);
    const [others, set_others] = React.useState(false);
    const [none_of_above, set_none_of_above] = React.useState(false);
    const [aggreagate_and_sand_value, set_aggreagate_and_sand_value] = React.useState("Yes");
    const [clay_bricks_value, set_clay_bricks_value] = React.useState("Yes");
    const [fly_ash_bricks_value, set_fly_ash_bricks_value] = React.useState("");
    const [wall_putty_value, set_wall_putty_value] = React.useState("");
    const [water_proofing_compounds_value, set_water_proofing_compounds_value] = React.useState("");
    const [tiles_adhesive_value, set_tiles_adhesive_value] = React.useState("");
    const [iron_and_steel_value, set_iron_and_steel_value] = React.useState("");
    const [paints_value, set_paints_value] = React.useState("");
    const [gcc_value, set_gcc_value] = React.useState("");
    const [asbestos_value, set_asbestos_value] = React.useState("");
    const [color_sheets_value, set_color_sheets_value] = React.useState("");
    const [tiles_value, set_tiles_value] = React.useState("");
    const [sanitary_or_hardware_value, set_sanitary_or_hardware_value] = React.useState("");
    const [others_value, set_others_value] = React.useState("");
    const [none_of_above_value, set_none_of_above_value] = React.useState(0);

    const [acc, set_acc] = React.useState(false);
    const [ambuja, set_ambuja] = React.useState(false);
    const [ultratech, set_ultratech] = React.useState(false);
    const [dalmia_or_konark, set_dalmia_or_konark] = React.useState(false);
    const [birla_corp, set_birla_corp] = React.useState(false);
    const [star, set_star] = React.useState(false);
    const [wonder, set_wonder] = React.useState(false);
    const [binani, set_binani] = React.useState(false);
    const [j_k_cement, set_j_k_cement] = React.useState(false);
    const [shree, set_shree] = React.useState(false);
    const [nuvoco, set_nuvoco] = React.useState(false);
    const [others_cement, set_others_cement] = React.useState(false);
    const [acc_value, set_acc_value] = React.useState("");
    const [ambuja_value, set_ambuja_value] = React.useState("");
    const [ultratech_value, set_ultratech_value] = React.useState("");
    const [dalmia_or_konark_value, set_dalmia_or_konark_value] = React.useState("");
    const [birla_corp_value, set_birla_corp_value] = React.useState("");
    const [star_value, set_star_value] = React.useState("");
    const [wonder_value, set_wonder_value] = React.useState("");
    const [binani_value, set_binani_value] = React.useState("");
    const [j_k_cement_value, set_j_k_cement_value] = React.useState("");
    const [shree_value, set_shree_value] = React.useState("");
    const [nuvoco_value, set_nuvoco_value] = React.useState("1");
    const [others_cement_value, set_others_cement_value] = React.useState("");

    const [isFather, isSetFather] = React.useState(false);
    const [isMother, isSetMother] = React.useState(false);
    const [isSpouse, isSetSpouse] = React.useState(false);
    const [isFirstchild, isSetFirstchild] = React.useState(false);
    const [isSecondchild, isSetSecondchild] = React.useState(false);

    const [p_first_name, set_p_first_name] = React.useState("");
    const [p_middle_name, set_p_middle_name] = React.useState("");
    const [p_last_name, set_p_last_name] = React.useState("");

    const [father_name, set_father_name] = React.useState("");
    const [father_DOB, set_father_DOB] = React.useState("");
    const [mother_name, set_mother_name] = React.useState("");
    const [mother_DOB, set_mother_DOB] = React.useState("");

    const [spouse_name, set_spouse_name] = React.useState("");
    const [spouse_gender, set_spouse_gender] = React.useState("");
    const [spouse_DOB, set_spouse_DOB] = React.useState("");
    const [firstchild_name, set_firstchild_name] = React.useState("");
    const [firstchild_gender, set_firstchild_gender] = React.useState("");
    const [firstchild_DOB, set_firstchild_DOB] = React.useState("");
    const [secondchild_name, set_secondchild_name] = React.useState("");
    const [secondchild_gender, set_secondchild_gender] = React.useState("");
    const [secondchild_DOB, set_secondchild_DOB] = React.useState("");

    const [isAgreed, isSetAgreed] = React.useState(false);
    const [termsCheck, setTermsCheck] = React.useState(false);

    const scrollRef = React.useRef();

    const [success, setSuccess] = React.useState(false);

    const showDatePicker = (val) => {
        setDatePickerVisibility(true);
        setDateType(val);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        if (dateType == "dob") {
            setDOB(date);
        } else if (dateType == "anniversary") {
            setAnniversary(date);
        } else if (dateType == "father_dob") {
            set_father_DOB(date);
        } else if (dateType == "mother_dob") {
            set_mother_DOB(date);
        } else if (dateType == "spouse_dob") {
            set_spouse_DOB(date);
        } else if (dateType == "firstchild_dob") {
            set_firstchild_DOB(date);
        } else if (dateType == "secondchild_dob") {
            set_secondchild_DOB(date);
        }
    };

    useEffect(() => {
        setLoading(true);
        AsyncStorage.getItem('firmData').then(val => {
            if (val != null) {
                setColorTheme(JSON.parse(val).info.theme_color);
                setOrgID(JSON.parse(val).info.org_id);
                setFirmName(JSON.parse(val).firm_name);
                setSapCode(JSON.parse(val).external_id);

                setFirstName(JSON.parse(val).contact_details.first_name);
                setMiddleName(JSON.parse(val).contact_details.middle_name);
                setLastName(JSON.parse(val).contact_details.last_name);
                setMobile(JSON.parse(val).contact_details.contact_no);
                setPanCard(JSON.parse(val).contact_details.pan);
                setGstCard(JSON.parse(val).contact_details.gst);

                getSapData(JSON.parse(val).external_id, JSON.parse(val).info.org_id);
            }
        });
        let formdata = new FormData();
        formdata.append("APIkey", `${API_KEY}`);
        fetch(`${BASE_URL}/get_csrf_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formdata
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("CSRF Token:", responseJson.account_hash);
                if (responseJson.status == 'success') {
                    setCSRFToken(responseJson.account_hash);
                }
            })
            .catch((error) => {
                setLoading(false);
                Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
            });
    }, [])

    const getSapData = (extrnId, idOrg) => {
        let formdata = new FormData();
        formdata.append("APIkey", `${API_KEY}`);
        formdata.append("externalID", extrnId);
        formdata.append("orgId", idOrg);
        fetch(`${BASE_URL}/getSapFeedData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formdata
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("getSapFeedData:", responseJson);
                if (responseJson.status == 'success') {
                    setLoading(false);
                    /* setFirstName(responseJson.firstName);
                    setMiddleName(responseJson.middleName);
                    setLastName(responseJson.lastName);
                    setMobile(responseJson.mobile);
                    setAadhaarCard(responseJson.aadhaarNumber);
                    setPanCard(responseJson.panNumber);
                    setGstCard(responseJson.gstNumber); */
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
                console.log("getSapFeedData Error:", error);
                Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
            });
    }

    const onSelectMaritalStatus = (val) => {
        setMaritalStatus(val);
        setAnniversary("");
    }

    const dobdate = new Date();
    const year = dobdate.getFullYear();
    const month = dobdate.getMonth();
    const day = dobdate.getDate();

    const onNext = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
        if (selectedStep == 1) {
            onStep1();
        } else if (selectedStep == 2) {
            onStep2();
        } else if (selectedStep == 3) {
            onStep3();
        } else if (selectedStep == 4) {
            onStep4();
        } else if (selectedStep == 5) {
            onStep5();
        } else if (selectedStep == 6) {
            onStep6();
        }
    }
    const onPrev = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
        setSelectedStep(selectedStep - 1);
        var currentStep = selectedStep - 1;
        if (currentStep == 1) {
            setStep2("");
        } else if (currentStep == 2) {
            setStep3("");
        } else if (currentStep == 3) {
            setStep4("");
        } else if (currentStep == 4) {
            setStep5("");
        } else if (currentStep == 5) {
            setStep6("");
        } else if (currentStep == 6) {
            setStep7("");
        }
    }

    const onStep1 = () => {
        Keyboard.dismiss();
        if (firstName.trim() == "") {
            Toast.show({ description: t("Please enter First Name") });
        } else if (lastName.trim() == "") {
            Toast.show({ description: t("Please enter Last Name") });
        } else if (mobile.trim() == "") {
            Toast.show({ description: t("Please enter Monile Number") });
        } else if (gender == "") {
            Toast.show({ description: t("Please select Gender") });
        } else if (maritalStatus == "") {
            Toast.show({ description: t("Please select Marital Status") });
        } else if (maritalStatus == "Married" && anniversary == "") {
            Toast.show({ description: t("Please select Date of Anniversary") });
        } else if (dob == "") {
            Toast.show({ description: t("Please select Date of Birth") });
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("APIkey", `${API_KEY}`);
            formdata.append("regMobNo", mobile);
            formdata.append("orgId", orgID);
            fetch(`${BASE_URL}/validate_mobile_by_org`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("validate_mobile_by_org:", responseJson);
                    if (responseJson.status == 'success') {
                        setLoading(false);
                        setStep2("done");
                        setSelectedStep(selectedStep + 1);
                    } else {
                        Toast.show({ description: responseJson.message });
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    //console.log("validate_mobile_by_org Error:", error);
                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                });
        }
    }
    const onStep2 = () => {
        Keyboard.dismiss();
        if (address1.trim() == "") {
            Toast.show({ description: t("Please enter Address Line 1") });
        } else if (address2.trim() == "") {
            Toast.show({ description: t("Please enter Address Line 2") });
        } else if (pinCode.trim() == "") {
            Toast.show({ description: t("Please enter your Pincode & Search") });
        } else if (state == "") {
            Toast.show({ description: t("State is required. Please Search with Pincode.") });
        } else if (district == "") {
            Toast.show({ description: t("District is required. Please Search with Pincode.") });
        } else {
            setStep3("done");
            setSelectedStep(selectedStep + 1);
        }
    }
    const onStep3 = () => {
        Keyboard.dismiss();
        if (address1Per.trim() == "") {
            Toast.show({ description: t("Please enter Address Line 1") });
        } else if (address2Per.trim() == "") {
            Toast.show({ description: t("Please enter Address Line 2") });
        } else if (pinCodePer.trim() == "") {
            Toast.show({ description: t("Please enter your Pincode & Search") });
        } else if (statePer == "") {
            Toast.show({ description: t("State is required. Please Search with Pincode.") });
        } else if (districtPer == "") {
            Toast.show({ description: t("District is required. Please Search with Pincode.") });
        } else {
            setStep4("done");
            setSelectedStep(selectedStep + 1);
        }
    }
    const onStep4 = () => {
        Keyboard.dismiss();
        if (aadhaarCard.trim() == "") {
            Toast.show({ description: t("Please enter Aadhaar Number") });
        } else if (panCard.trim() == "") {
            Toast.show({ description: t("Please enter PAN Number") });
        } else if (gstCard.trim() == "") {
            Toast.show({ description: t("Please enter GST Number") });
        } else if (aadhaarFrontImage == "") {
            Toast.show({ description: t("Please upload Aadhaar Front Image") });
        } else if (aadhaarBackImage == "") {
            Toast.show({ description: t("Please upload Aadhaar Back Image") });
        } else if (panImage == "") {
            Toast.show({ description: t("Please upload PAN Image") });
        } else if (gstImage == "") {
            Toast.show({ description: t("Please upload GST Image") });
        } else if (profileImage == "") {
            Toast.show({ description: t("Please upload Profile Image") });
        } else if (signatureImage == "") {
            Toast.show({ description: t("Please upload Signature Image") });
        } else if (agreedDoc == false) {
            Toast.show({ description: t("Please check Information for Documents") });
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("APIkey", `${API_KEY}`);
            formdata.append("orgId", orgID);
            formdata.append("document_aadhaar", aadhaarCard);
            formdata.append("document_pan", panCard);
            formdata.append("document_gst", gstCard);
            fetch(`${BASE_URL}/validate_param_values_by_org`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("validate_param_values_by_org:", responseJson);
                    if (responseJson.status == 'success') {
                        setLoading(false);
                        setStep5("done");
                        setSelectedStep(selectedStep + 1);
                    } else {
                        Toast.show({ description: responseJson.message });
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    //console.log("validate_param_values_by_org Error:", error);
                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                });
        }
    }
    const onStep5 = () => {
        Keyboard.dismiss();
        const toastText = 'Please enter Enter Company Name / Brand Name';
        if (!aggreagate_and_sand && !clay_bricks && !fly_ash_bricks && !wall_putty && !water_proofing_compounds && !tiles_adhesive && !iron_and_steel && !paints && !gcc && !asbestos && !color_sheets && !tiles && !sanitary_or_hardware && !others && !none_of_above) {
            Toast.show({ description: t("Please select atleast one of Business") });
        } else {
            if (aggreagate_and_sand && aggreagate_and_sand_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (clay_bricks && clay_bricks_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (fly_ash_bricks && fly_ash_bricks_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (wall_putty && wall_putty_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (water_proofing_compounds && water_proofing_compounds_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (tiles_adhesive && tiles_adhesive_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (iron_and_steel && iron_and_steel_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (paints && paints_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (gcc && gcc_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (asbestos && asbestos_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (color_sheets && color_sheets_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (tiles && tiles_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (sanitary_or_hardware && sanitary_or_hardware_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (others && others_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else {
                setStep6("done");
                setSelectedStep(selectedStep + 1);
            }
        }

    }
    const onStep6 = () => {
        Keyboard.dismiss();
        const toastText = 'Please enter Enter Avg. MT Sold';
        if (!acc && !ambuja && !ultratech && !dalmia_or_konark && !birla_corp && !star && !wonder && !binani && !j_k_cement && !shree && !nuvoco && !others_cement) {
            Toast.show({ description: t("Please select atleast one of Cement Business") });
        } else {
            if (acc && acc_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (ambuja && ambuja_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (ultratech && ultratech_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (dalmia_or_konark && dalmia_or_konark_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (birla_corp && birla_corp_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (star && star_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (wonder && wonder_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (binani && binani_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (j_k_cement && j_k_cement_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (shree && shree_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (nuvoco && nuvoco_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else if (others_cement && others_cement_value.trim() == "") {
                Toast.show({ description: t(toastText) });
            } else {
                setStep7("done");
                setSelectedStep(selectedStep + 1);
            }
        }
    }

    const onSubmit = () => {
        Keyboard.dismiss();
        if (p_first_name.trim() == "") {
            Toast.show({ description: t("Please enter Properietor First Name") });
        } else if (isFather && father_name.trim() == '') {
            Toast.show({ description: t("Please enter Father's Name") });
        } else if (isFather && father_DOB == '') {
            Toast.show({ description: t("Please choose Father's DOB") });
        } else if (isMother && mother_name.trim() == '') {
            Toast.show({ description: t("Please enter Mother's Name") });
        } else if (isMother && mother_DOB == '') {
            Toast.show({ description: t("Please choose Mother's DOB") });
        } else if (isSpouse && spouse_name.trim() == '') {
            Toast.show({ description: t("Please enter Spouse Name") });
        } else if (isSpouse && spouse_gender == '') {
            Toast.show({ description: t("Please select Spouse Gender") });
        } else if (isSpouse && spouse_DOB == '') {
            Toast.show({ description: t("Please choose Spouse DOB") });
        } else if (isFirstchild && firstchild_name.trim() == '') {
            Toast.show({ description: t("Please enter First Child Name") });
        } else if (isFirstchild && firstchild_gender == '') {
            Toast.show({ description: t("Please select First Child Gender") });
        } else if (isFirstchild && firstchild_DOB == '') {
            Toast.show({ description: t("Please choose First Child DOB") });
        } else if (isSecondchild && secondchild_name.trim() == '') {
            Toast.show({ description: t("Please enter Second Child Name") });
        } else if (isSecondchild && secondchild_gender == '') {
            Toast.show({ description: t("Please select Second Child Gender") });
        } else if (isSecondchild && secondchild_DOB == '') {
            Toast.show({ description: t("Please choose Second Child DOB") });
        } else if (!isAgreed) {
            Toast.show({ description: t("Please check all consent agree and terms condition") });
        } else if (!termsCheck) {
            Toast.show({ description: t("Please check all consent agree and terms condition") });
        } else {
            setLoading(true);
            onRegistration();
        }
    }

    const onPinSearch = (pin, type) => {
        if (pin.trim() == "") {
            Toast.show({ description: t("Please enter Pincode") });
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("APIkey", `${API_KEY}`);
            formdata.append("pincode", pin);
            fetch(`${BASE_URL}/get_state_district_by_pincode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("get_state_district_by_pincode:", responseJson);
                    if (responseJson.status == 'success') {
                        setLoading(false);
                        if (type == "Firm") {
                            setState(responseJson.state_district.state_id);
                            setStateName(responseJson.state_district.state_name);
                            setDistrict(responseJson.state_district.district_id);
                            setDistrictName(responseJson.state_district.district_name);
                        } else {
                            setStatePer(responseJson.state_district.state_id);
                            setStateNamePer(responseJson.state_district.state_name);
                            setDistrictPer(responseJson.state_district.district_id);
                            setDistrictNamePer(responseJson.state_district.district_name);
                        }
                    } else {
                        Toast.show({ description: responseJson.message });
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    //console.log("get_state_district_by_pincode Error:", error);
                    Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
                });
        }
    }

    const onCheckSame = (val) => {
        setSameAddress(val);
        if (val == true) {
            setAddress1Per(address1);
            setAddress2Per(address2);
            setAddress3Per(address3);
            setPinCodePer(pinCode);
            setStatePer(state);
            setStateNamePer(stateName);
            setDistrictPer(district);
            setDistrictNamePer(districtName);
            setCityPer(city);
        } else {
            setAddress1Per("");
            setAddress2Per("");
            setAddress3Per("");
            setPinCodePer("");
            setStatePer("");
            setStateNamePer("");
            setDistrictPer("");
            setDistrictNamePer("");
            setCityPer("");
        }
    }

    const onNoneOfAbove = () => {
        set_none_of_above(!none_of_above);
        set_aggreagate_and_sand(false);
        set_clay_bricks(false);
        set_fly_ash_bricks(false);
        set_wall_putty(false);
        set_water_proofing_compounds(false);
        set_tiles_adhesive(false);
        set_iron_and_steel(false);
        set_paints(false);
        set_gcc(false);
        set_asbestos(false);
        set_color_sheets(false);
        set_tiles(false);
        set_sanitary_or_hardware(false);
        set_others(false);
    }

    const onPickerOpen = (val) => {
        setIsPicker(true);
        setImageType(val);
    }
    const onPickerClose = () => {
        setIsPicker(false);
    }

    const openProfilePicker = (type) => {
        onPickerClose();
        if (type == "library") {
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    includeBase64: true,
                    maxHeight: 1500,
                    maxWidth: 1500,
                },
                (response) => {
                    //console.log(response);
                    if (response.assets != undefined) {
                        if (imageType == "AadhaarFrontImage") {
                            setAadhaarFrontImage(response.assets[0].base64);
                        } else if (imageType == "AadhaarBackImage") {
                            setAadhaarBackImage(response.assets[0].base64);
                        } else if (imageType == "PanImage") {
                            setPanImage(response.assets[0].base64);
                        } else if (imageType == "GstImage") {
                            setGstImage(response.assets[0].base64);
                        } else if (imageType == "ProfileImage") {
                            setProfileImage(response.assets[0].base64);
                        } else if (imageType == "SignatureImage") {
                            setSignatureImagee(response.assets[0].base64);
                        } else if (imageType == "AddressImage") {
                            setAddressImage(response.assets[0].base64);
                        }
                    }
                },
            )
        } else if (type == "camera") {
            launchCamera(
                {
                    mediaType: 'photo',
                    includeBase64: true,
                    maxHeight: 1500,
                    maxWidth: 1500,
                },
                (response) => {
                    //console.log(response.assets);
                    if (response.assets != undefined) {
                        if (imageType == "AadhaarFrontImage") {
                            setAadhaarFrontImage(response.assets[0].base64);
                        } else if (imageType == "AadhaarBackImage") {
                            setAadhaarBackImage(response.assets[0].base64);
                        } else if (imageType == "PanImage") {
                            setPanImage(response.assets[0].base64);
                        } else if (imageType == "GstImage") {
                            setGstImage(response.assets[0].base64);
                        } else if (imageType == "ProfileImage") {
                            setProfileImage(response.assets[0].base64);
                        } else if (imageType == "SignatureImage") {
                            setSignatureImagee(response.assets[0].base64);
                        } else if (imageType == "AddressImage") {
                            setAddressImage(response.assets[0].base64);
                        }
                    }
                },
            )
        }
    }

    const onRegistration = () => {
        let formdata = new FormData();
        formdata.append("APIkey", `${API_KEY}`);
        formdata.append("org_id", orgID);
        formdata.append("external_id", sapCode);
        formdata.append("first_name", firstName);
        formdata.append("middle_name", middleName);
        formdata.append("last_name", lastName);
        formdata.append("mobile", mobile);
        formdata.append("gender", gender);
        formdata.append("marital_status", maritalStatus);
        formdata.append("anniversary_date", (anniversary != "" ? moment(anniversary).format('DD.MM.YYYY') : ""));
        formdata.append("DOB", moment(dob).format('DD.MM.YYYY'));
        formdata.append("address_line1", address1);
        formdata.append("address_line2", address2);
        formdata.append("address_line3", address3);
        formdata.append("pin_code", pinCode);
        formdata.append("state", state);
        formdata.append("district", district);
        formdata.append("city", city);
        formdata.append("m_address_line1", address1Per);
        formdata.append("m_address_line2", address2Per);
        formdata.append("m_address_line3", address3Per);
        formdata.append("m_pin_code", pinCodePer);
        formdata.append("m_state", statePer);
        formdata.append("m_district", districtPer);
        formdata.append("m_city", cityPer);
        formdata.append("aadhaar", aadhaarCard);
        formdata.append("pan", panCard);
        formdata.append("gstNo", gstCard);
        formdata.append("aadhaarfrontimage", aadhaarFrontImage);
        formdata.append("aadhaarbackimage", aadhaarBackImage);
        formdata.append("panimage", panImage);
        formdata.append("gstImage", gstImage);
        formdata.append("profileimage", profileImage);
        formdata.append("signatureimage", signatureImage);
        formdata.append("addressproofimage", addressImage);
        formdata.append("aggreagate_and_sand_value", aggreagate_and_sand ? aggreagate_and_sand_value : "");
        formdata.append("clay_bricks_value", clay_bricks ? clay_bricks : "");
        formdata.append("fly_ash_bricks_value", fly_ash_bricks ? fly_ash_bricks_value : "");
        formdata.append("wall_putty_value", wall_putty ? wall_putty_value : "");
        formdata.append("water_proofing_compounds_value", water_proofing_compounds ? water_proofing_compounds_value : "");
        formdata.append("tiles_adhesive_value", tiles_adhesive ? tiles_adhesive_value : "");
        formdata.append("iron_and_steel_value", iron_and_steel ? iron_and_steel_value : "");
        formdata.append("paints_value", paints ? paints_value : "");
        formdata.append("gcc_value", gcc ? gcc_value : "");
        formdata.append("asbestos_value", asbestos ? asbestos_value : "");
        formdata.append("color_sheets_value", color_sheets ? color_sheets_value : "");
        formdata.append("tiles_value", tiles ? tiles_value : "");
        formdata.append("sanitary_or_hardware_value", sanitary_or_hardware ? sanitary_or_hardware_value : "");
        formdata.append("others_value", others ? others_value : "");
        formdata.append("none_of_above_value", none_of_above ? none_of_above_value : "");
        formdata.append("acc_value", acc ? acc_value : "");
        formdata.append("ambuja_value", ambuja ? ambuja_value : "");
        formdata.append("ultratech_value", ultratech ? ultratech_value : "");
        formdata.append("dalmia_or_konark_value", dalmia_or_konark ? dalmia_or_konark_value : "");
        formdata.append("birla_corp_value", birla_corp ? birla_corp_value : "");
        formdata.append("star_value", star ? star_value : "");
        formdata.append("wonder_value", wonder ? wonder_value : "");
        formdata.append("binani_value", binani ? binani_value : "");
        formdata.append("j_k_cement_value", j_k_cement ? j_k_cement_value : "");
        formdata.append("shree_value", shree ? shree_value : "");
        formdata.append("nuvoco_value", nuvoco ? nuvoco_value : "");
        formdata.append("others_cement_value", others_cement ? others_cement_value : "");
        formdata.append("p_first_name", p_first_name);
        formdata.append("p_middle_name", p_middle_name);
        formdata.append("p_last_name", p_last_name);
        formdata.append("father_name", isFather ? father_name : "");
        formdata.append("father_DOB", isFather ? moment(father_DOB).format('DD.MM.YYYY') : "");
        formdata.append("mother_name", isMother ? mother_name : "");
        formdata.append("mother_DOB", isMother ? moment(mother_DOB).format('DD.MM.YYYY') : "");
        formdata.append("spouse_name", isSpouse ? spouse_name : "");
        formdata.append("spouse_gender", isSpouse ? spouse_gender : "");
        formdata.append("spouse_DOB", isSpouse ? moment(spouse_DOB).format('DD.MM.YYYY') : "");
        formdata.append("firstchild_name", isFirstchild ? firstchild_name : "");
        formdata.append("firstchild_gender", isFirstchild ? firstchild_gender : "");
        formdata.append("firstchild_DOB", isFirstchild ? moment(firstchild_DOB).format('DD.MM.YYYY') : "");
        formdata.append("secondchild_name", isSecondchild ? secondchild_name : "");
        formdata.append("secondchild_gender", isSecondchild ? secondchild_gender : "");
        formdata.append("secondchild_DOB", isSecondchild ? moment(secondchild_DOB).format('DD.MM.YYYY') : "");
        formdata.append("account_hash", csrfToken);
        fetch(`${BASE_URL}/registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formdata
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("registration:", responseJson);
                if (responseJson.status == 'success') {
                    Toast.show({ description: responseJson.message });
                    setTimeout(function () {
                        setLoading(false);
                        setSuccess(true);
                    }, 1000);
                } else {
                    Toast.show({ description: responseJson.message });
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                //console.log("registration Error:", error);
                Toast.show({ description: t("Sorry! Somthing went Wrong. Maybe Network request Failed") });
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
                        <Text color="#ffffff" fontSize="16" textAlign="center" fontWeight="bold" textTransform="capitalize">{t("Registration")}</Text>
                    </HStack>
                </HStack>
                <VStack bg={colorTheme.normal} justifyContent="center" alignItems="center" paddingX="4" paddingY="5" space={2} borderBottomRightRadius={30} borderBottomLeftRadius={30}>
                    <Text color="#ffffff" fontSize="2xl" textAlign="center" fontWeight="bold" textTransform="capitalize">{firmName}</Text>
                    <VStack>
                        <Text color={colorTheme.light} fontSize="sm" textAlign="center" fontWeight="normal" textTransform="capitalize">{t("(Dealer SAP Code)")}</Text>
                        <Text color="#ffffff" fontSize="lg" textAlign="center" fontWeight="bold" textTransform="capitalize">{sapCode}</Text>
                    </VStack>
                </VStack>
                <ScrollView ref={scrollRef}>
                    <VStack padding="5">
                        <HStack style={{ backgroundColor: '#dddddd', height: 2, justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 40, marginHorizontal: 20 }}>
                            <Pressable style={{ backgroundColor: step1 == "done" ? colorTheme.dark : '#cccccc', width: 30, height: 30, borderRadius: 30 }}>
                                <Text color={step1 == "done" ? "#ffffff" : "#000000"} fontSize="md" textAlign="center" fontWeight="bold" lineHeight={30}>1</Text>
                            </Pressable>
                            <Pressable style={{ backgroundColor: step2 == "done" ? colorTheme.dark : '#cccccc', width: 30, height: 30, borderRadius: 30 }}>
                                <Text color={step2 == "done" ? "#ffffff" : "#000000"} fontSize="md" textAlign="center" fontWeight="bold" lineHeight={30}>2</Text>
                            </Pressable>
                            <Pressable style={{ backgroundColor: step3 == "done" ? colorTheme.dark : '#cccccc', width: 30, height: 30, borderRadius: 30 }}>
                                <Text color={step3 == "done" ? "#ffffff" : "#000000"} fontSize="md" textAlign="center" fontWeight="bold" lineHeight={30}>3</Text>
                            </Pressable>
                            <Pressable style={{ backgroundColor: step4 == "done" ? colorTheme.dark : '#cccccc', width: 30, height: 30, borderRadius: 30 }}>
                                <Text color={step4 == "done" ? "#ffffff" : "#000000"} fontSize="md" textAlign="center" fontWeight="bold" lineHeight={30}>4</Text>
                            </Pressable>
                            <Pressable style={{ backgroundColor: step5 == "done" ? colorTheme.dark : '#cccccc', width: 30, height: 30, borderRadius: 30 }}>
                                <Text color={step5 == "done" ? "#ffffff" : "#000000"} fontSize="md" textAlign="center" fontWeight="bold" lineHeight={30}>5</Text>
                            </Pressable>
                            <Pressable style={{ backgroundColor: step6 == "done" ? colorTheme.dark : '#cccccc', width: 30, height: 30, borderRadius: 30 }}>
                                <Text color={step6 == "done" ? "#ffffff" : "#000000"} fontSize="md" textAlign="center" fontWeight="bold" lineHeight={30}>6</Text>
                            </Pressable>
                            <Pressable style={{ backgroundColor: step7 == "done" ? colorTheme.dark : '#cccccc', width: 30, height: 30, borderRadius: 30 }}>
                                <Text color={step7 == "done" ? "#ffffff" : "#000000"} fontSize="md" textAlign="center" fontWeight="bold" lineHeight={30}>7</Text>
                            </Pressable>
                        </HStack>
                        {selectedStep == 1 && (
                            <VStack space={3}>
                                <Text color={colorTheme.dark} marginY={2} fontSize="md" textAlign="center" fontWeight="bold" textTransform="uppercase">{t("Personal Details")}</Text>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={firstName} readOnly onChangeText={(text) => setFirstName(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("First Name") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={middleName} readOnly onChangeText={(text) => setMiddleName(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Middle Name")} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={lastName} readOnly onChangeText={(text) => setLastName(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Last Name") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={mobile} readOnly onChangeText={(text) => setMobile(text)} keyboardType='number-pad' maxLength={10} variant="unstyled" InputLeftElement={<Icon name="phone-portrait-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Mobile") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Select variant="unstyled" size="lg" placeholder={t("Select Gender") + " *"}
                                        InputLeftElement={<Icon name="male-female-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />}
                                        selectedValue={gender}
                                        onValueChange={value => setGender(value)}
                                        _selectedItem={{
                                            backgroundColor: '#eeeeee',
                                            endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                        }}>
                                        <Select.Item label="Male" value="Male" />
                                        <Select.Item label="Female" value="Female" />
                                    </Select>
                                </View>
                                <View style={styles.inputbox}>
                                    <Select variant="unstyled" size="lg" placeholder={t("Marital Status") + " *"}
                                        InputLeftElement={<Icon name="people-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />}
                                        selectedValue={maritalStatus}
                                        onValueChange={value => onSelectMaritalStatus(value)}
                                        _selectedItem={{
                                            backgroundColor: '#eeeeee',
                                            endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                        }}>
                                        <Select.Item label="Single" value="Single" />
                                        <Select.Item label="Married" value="Married" />
                                        <Select.Item label="Widower / Divorced" value="Widower" />
                                    </Select>
                                </View>
                                {maritalStatus == "Married" && (
                                    <Pressable style={styles.inputbox} onPress={() => showDatePicker("anniversary")}>
                                        <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"}>
                                            <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />
                                            <Text color={anniversary != "" ? "#111111" : "#999999"} fontSize="md">{anniversary != "" ? moment(anniversary).format("DD MMMM, YYYY") : t("Anniversary") + " *"}</Text>
                                        </HStack>
                                    </Pressable>
                                )}
                                <Pressable style={styles.inputbox} onPress={() => showDatePicker("dob")}>
                                    <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"}>
                                        <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />
                                        <Text color={dob != "" ? "#111111" : "#999999"} fontSize="md">{dob != "" ? moment(dob).format("DD MMMM, YYYY") : t("DOB") + " *"}</Text>
                                    </HStack>
                                </Pressable>
                            </VStack>
                        )}
                        {selectedStep == 2 && (
                            <VStack space={3}>
                                <Text color={colorTheme.dark} marginY={2} fontSize="md" textAlign="center" fontWeight="bold" textTransform="uppercase">{t("Firm Address")}</Text>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address1} onChangeText={(text) => setAddress1(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 1") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address2} onChangeText={(text) => setAddress2(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 2") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address3} onChangeText={(text) => setAddress3(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 3")} />
                                </View>
                                <HStack style={styles.inputbox}>
                                    <Input width={'80%'} size="lg" value={pinCode} onChangeText={(text) => setPinCode(text)} keyboardType='number-pad' maxLength={6} variant="unstyled" InputLeftElement={<Icon name="locate-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Pincode") + " *"} />
                                    <Button style={[styles.solidBtn, { width: '20%' }]} variant="unstyled" backgroundColor={"#111111"} borderColor={colorTheme.dark} onPress={() => onPinSearch(pinCode, "Firm")}>
                                        <Icon name="search-outline" size={20} color="#ffffff" />
                                    </Button>
                                </HStack>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={stateName} readOnly variant="unstyled" InputLeftElement={<Icon name="pin-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("State") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={districtName} readOnly variant="unstyled" InputLeftElement={<Icon name="pin-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("District") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={city} onChangeText={(text) => setCity(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("City")} />
                                </View>
                            </VStack>
                        )}
                        {selectedStep == 3 && (
                            <VStack space={3}>
                                <Text color={colorTheme.dark} marginY={2} fontSize="md" textAlign="center" fontWeight="bold" textTransform="uppercase">{t("Mailling Address")}</Text>
                                <HStack space={1} alignItems={"center"} paddingHorizontal={5} backgroundColor={"#eeeeee"} padding={3} borderRadius={30} marginBottom={2}>
                                    <CheckBox value={sameAddress} onValueChange={() => onCheckSame(!sameAddress)} tintColors={{ true: colorTheme.dark }} />
                                    <Text fontSize="md" color={colorTheme.dark} fontWeight={"bold"}>{t("Same as Firm Address")}</Text>
                                </HStack>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address1Per} onChangeText={(text) => setAddress1Per(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 1") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address2Per} onChangeText={(text) => setAddress2Per(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 2") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={address3Per} onChangeText={(text) => setAddress3Per(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Address Line 3")} />
                                </View>
                                <HStack style={styles.inputbox}>
                                    <Input width={'80%'} size="lg" value={pinCodePer} onChangeText={(text) => setPinCodePer(text)} keyboardType='number-pad' maxLength={6} variant="unstyled" InputLeftElement={<Icon name="locate-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Pincode") + " *"} />
                                    <Button style={[styles.solidBtn, { width: '20%' }]} variant="unstyled" backgroundColor={"#111111"} borderColor={colorTheme.dark} onPress={() => onPinSearch(pinCodePer, "Mail")}>
                                        <Icon name="search-outline" size={20} color="#ffffff" />
                                    </Button>
                                </HStack>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={stateNamePer} readOnly variant="unstyled" InputLeftElement={<Icon name="pin-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("State") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={districtNamePer} readOnly variant="unstyled" InputLeftElement={<Icon name="pin-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("District") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={cityPer} onChangeText={(text) => setCity(text)} variant="unstyled" InputLeftElement={<Icon name="location-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("City")} />
                                </View>
                            </VStack>
                        )}
                        {selectedStep == 4 && (
                            <VStack space={3}>
                                <Text color={colorTheme.dark} marginY={2} fontSize="md" textAlign="center" fontWeight="bold" textTransform="uppercase">{t("KYC Details")}</Text>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={aadhaarCard} keyboardType='number-pad' maxLength={12} onChangeText={(text) => setAadhaarCard(text)} variant="unstyled" InputLeftElement={<Icon name="card-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Aadhaar Card No.") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={panCard} readOnly onChangeText={(text) => setPanCard(text)} variant="unstyled" maxLength={10} InputLeftElement={<Icon name="card-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("PAN Card No.") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={gstCard} readOnly onChangeText={(text) => setGstCard(text)} variant="unstyled" maxLength={15} InputLeftElement={<Icon name="card-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("GST No.") + " *"} />
                                </View>
                                <HStack flexWrap={"wrap"} justifyContent="space-between" alignItems="center">
                                    <Stack width={"48%"} space={2}>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={20} color={colorTheme.dark} />
                                            <Text color={colorTheme.dark} fontSize="sm">{t("Aadhaar Front Image")} *</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={aadhaarFrontImage != "" ? { uri: 'data:image/jpeg;base64,' + aadhaarFrontImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 120 }} />
                                            <Pressable onPress={() => onPickerOpen("AadhaarFrontImage")} bg={"#ff3705"} position="absolute" bottom="2" right="2" width="45" height="45" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </Stack>
                                    <Stack width={"48%"} space={2}>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={20} color={colorTheme.dark} />
                                            <Text color={colorTheme.dark} fontSize="sm">{t("Aadhaar Back Image")} *</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={aadhaarBackImage != "" ? { uri: 'data:image/jpeg;base64,' + aadhaarBackImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 120 }} />
                                            <Pressable onPress={() => onPickerOpen("AadhaarBackImage")} bg={"#ff3705"} position="absolute" bottom="2" right="2" width="45" height="45" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </Stack>
                                    <Stack width={"48%"} space={2}>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={20} color={colorTheme.dark} />
                                            <Text color={colorTheme.dark} fontSize="sm">{t("PAN Card Image")} *</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={panImage != "" ? { uri: 'data:image/jpeg;base64,' + panImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 120 }} />
                                            <Pressable onPress={() => onPickerOpen("PanImage")} bg={"#ff3705"} position="absolute" bottom="2" right="2" width="45" height="45" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </Stack>
                                    <Stack width={"48%"} space={2}>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={20} color={colorTheme.dark} />
                                            <Text color={colorTheme.dark} fontSize="sm">{t("GST Image")} *</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={gstImage != "" ? { uri: 'data:image/jpeg;base64,' + gstImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 120 }} />
                                            <Pressable onPress={() => onPickerOpen("GstImage")} bg={"#ff3705"} position="absolute" bottom="2" right="2" width="45" height="45" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </Stack>
                                    <Stack width={"48%"} space={2}>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={20} color={colorTheme.dark} />
                                            <Text color={colorTheme.dark} fontSize="sm">{t("Profile Image")} *</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={profileImage != "" ? { uri: 'data:image/jpeg;base64,' + profileImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 120 }} />
                                            <Pressable onPress={() => onPickerOpen("ProfileImage")} bg={"#ff3705"} position="absolute" bottom="2" right="2" width="45" height="45" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </Stack>
                                    <Stack width={"48%"} space={2}>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={20} color={colorTheme.dark} />
                                            <Text color={colorTheme.dark} fontSize="sm">{t("Upload Signature")} *</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={signatureImage != "" ? { uri: 'data:image/jpeg;base64,' + signatureImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 120 }} />
                                            <Pressable onPress={() => onPickerOpen("SignatureImage")} bg={"#ff3705"} position="absolute" bottom="2" right="2" width="45" height="45" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </Stack>
                                    <Stack width={"48%"} space={2}>
                                        <HStack alignItems="center" mt="3" space={0}>
                                            <Icon name="attach-outline" size={20} color={colorTheme.dark} />
                                            <Text color={colorTheme.dark} fontSize="sm">{t("Address Proof")}</Text>
                                        </HStack>
                                        <View style={styles.inputbox}>
                                            <Image source={addressImage != "" ? { uri: 'data:image/jpeg;base64,' + addressImage } : require('../assets/images/noimage.png')} alt="image" resizeMode='contain' style={{ width: '100%', height: 120 }} />
                                            <Pressable onPress={() => onPickerOpen("AddressImage")} bg={"#ff3705"} position="absolute" bottom="2" right="2" width="45" height="45" justifyContent="center" alignItems="center" borderRadius="30" overflow="hidden">
                                                <Icon name="camera" size={26} color="#ffffff" />
                                            </Pressable>
                                        </View>
                                    </Stack>
                                </HStack>
                                <HStack space={3} marginTop={3} paddingHorizontal={5} padding={3} borderRadius={30} alignItems="center">
                                    <CheckBox value={agreedDoc} onValueChange={() => setAgreedDoc(!agreedDoc)} tintColors={{ true: colorTheme.dark }} />
                                    <Text width="85%" fontSize="xs" color={colorTheme.dark} fontWeight="bold">{t("The information provided above are true to my knowledge and I hereby solemnly submit all the documents required. All details captured will be solely used for the purpose of CRM and Loyalty program only.")}</Text>
                                </HStack>
                            </VStack>
                        )}
                        {selectedStep == 5 && (
                            <VStack space={3}>
                                <Text color={colorTheme.dark} marginY={2} fontSize="md" textAlign="center" fontWeight="bold" textTransform="uppercase">{t("Other Businesses Dealing in")}</Text>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={aggreagate_and_sand} onValueChange={() => { set_aggreagate_and_sand(!aggreagate_and_sand), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Aggreagate And Sand")}</Text>
                                    </HStack>
                                    {aggreagate_and_sand && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" readOnly value={aggreagate_and_sand_value} onChangeText={(text) => set_aggreagate_and_sand_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={clay_bricks} onValueChange={() => { set_clay_bricks(!clay_bricks), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Clay Bricks")}</Text>
                                    </HStack>
                                    {clay_bricks && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" readOnly value={clay_bricks_value} onChangeText={(text) => set_clay_bricks_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={fly_ash_bricks} onValueChange={() => { set_fly_ash_bricks(!fly_ash_bricks), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Fly Ash Bricks")}</Text>
                                    </HStack>
                                    {fly_ash_bricks && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={fly_ash_bricks_value} onChangeText={(text) => set_fly_ash_bricks_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={wall_putty} onValueChange={() => { set_wall_putty(!wall_putty), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Wall Putty")}</Text>
                                    </HStack>
                                    {wall_putty && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={wall_putty_value} onChangeText={(text) => set_wall_putty_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={water_proofing_compounds} onValueChange={() => { set_water_proofing_compounds(!water_proofing_compounds), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Water Proofing Compounds")}</Text>
                                    </HStack>
                                    {water_proofing_compounds && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={water_proofing_compounds_value} onChangeText={(text) => set_water_proofing_compounds_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={tiles_adhesive} onValueChange={() => { set_tiles_adhesive(!tiles_adhesive), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Tiles Adhesive")}</Text>
                                    </HStack>
                                    {tiles_adhesive && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={tiles_adhesive_value} onChangeText={(text) => set_tiles_adhesive(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={iron_and_steel} onValueChange={() => { set_iron_and_steel(!iron_and_steel), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Iron And Steel")}</Text>
                                    </HStack>
                                    {iron_and_steel && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={iron_and_steel_value} onChangeText={(text) => set_iron_and_steel_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={paints} onValueChange={() => { set_paints(!paints), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Paints")}</Text>
                                    </HStack>
                                    {paints && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={paints_value} onChangeText={(text) => set_paints_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={gcc} onValueChange={() => { set_gcc(!gcc), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Gcc")}</Text>
                                    </HStack>
                                    {gcc && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={gcc_value} onChangeText={(text) => set_gcc_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={asbestos} onValueChange={() => { set_asbestos(!asbestos), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Asbestos")}</Text>
                                    </HStack>
                                    {asbestos && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={asbestos_value} onChangeText={(text) => set_asbestos_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={color_sheets} onValueChange={() => { set_color_sheets(!color_sheets), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Color Sheets")}</Text>
                                    </HStack>
                                    {color_sheets && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={color_sheets_value} onChangeText={(text) => set_color_sheets_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={tiles} onValueChange={() => { set_tiles(!tiles), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Tiles")}</Text>
                                    </HStack>
                                    {tiles && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={tiles_value} onChangeText={(text) => set_tiles_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={sanitary_or_hardware} onValueChange={() => { set_sanitary_or_hardware(!sanitary_or_hardware), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Sanitary Or Hardware")}</Text>
                                    </HStack>
                                    {sanitary_or_hardware && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={sanitary_or_hardware_value} onChangeText={(text) => set_sanitary_or_hardware_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={others} onValueChange={() => { set_others(!others), set_none_of_above(false) }} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Others")}</Text>
                                    </HStack>
                                    {others && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" value={others_value} onChangeText={(text) => set_others_value(text)} variant="unstyled" placeholder={t("Enter Company Name / Brand Name *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={none_of_above} onValueChange={() => onNoneOfAbove()} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("None of above")}</Text>
                                    </HStack>
                                </Stack>
                            </VStack>
                        )}
                        {selectedStep == 6 && (
                            <VStack space={3}>
                                <Text color={colorTheme.dark} marginY={2} fontSize="md" textAlign="center" fontWeight="bold" textTransform="uppercase">{t("Cement Business")}</Text>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={acc} onValueChange={() => set_acc(!acc)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Acc")}</Text>
                                    </HStack>
                                    {acc && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={acc_value} onChangeText={(text) => set_acc_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={ambuja} onValueChange={() => set_ambuja(!ambuja)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Ambuja")}</Text>
                                    </HStack>
                                    {ambuja && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={ambuja_value} onChangeText={(text) => set_ambuja_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={ultratech} onValueChange={() => set_ultratech(!ultratech)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Ultratech")}</Text>
                                    </HStack>
                                    {ultratech && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={ultratech_value} onChangeText={(text) => set_ultratech_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={dalmia_or_konark} onValueChange={() => set_dalmia_or_konark(!dalmia_or_konark)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Dalmia or Konark")}</Text>
                                    </HStack>
                                    {dalmia_or_konark && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={dalmia_or_konark_value} onChangeText={(text) => set_dalmia_or_konark_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={birla_corp} onValueChange={() => set_birla_corp(!birla_corp)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Birla Corp")}</Text>
                                    </HStack>
                                    {birla_corp && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={birla_corp_value} onChangeText={(text) => set_birla_corp_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={star} onValueChange={() => set_star(!star)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Star")}</Text>
                                    </HStack>
                                    {star && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={star_value} onChangeText={(text) => set_star_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={wonder} onValueChange={() => set_wonder(!wonder)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Wonder")}</Text>
                                    </HStack>
                                    {wonder && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={wonder_value} onChangeText={(text) => set_wonder_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={binani} onValueChange={() => set_binani(!binani)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Binani")}</Text>
                                    </HStack>
                                    {binani && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={binani_value} onChangeText={(text) => set_binani_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={j_k_cement} onValueChange={() => set_j_k_cement(!j_k_cement)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("J K Cement")}</Text>
                                    </HStack>
                                    {j_k_cement && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={j_k_cement_value} onChangeText={(text) => set_j_k_cement_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={shree} onValueChange={() => set_shree(!shree)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Shree")}</Text>
                                    </HStack>
                                    {shree && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={shree_value} onChangeText={(text) => set_shree_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={nuvoco} onValueChange={() => set_nuvoco(!nuvoco)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Nuvoco")}</Text>
                                    </HStack>
                                    {nuvoco && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" readOnly keyboardType='number-pad' value={nuvoco_value} onChangeText={(text) => set_nuvoco_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                                <Stack space={2}>
                                    <HStack space={1} alignItems="center">
                                        <CheckBox value={others_cement} onValueChange={() => set_others_cement(!others_cement)} tintColors={{ true: colorTheme.dark }} />
                                        <Text fontSize="md">{t("Other")}</Text>
                                    </HStack>
                                    {others_cement && (
                                        <View style={styles.inputbox}>
                                            <Input size="md" keyboardType='number-pad' value={others_cement_value} onChangeText={(text) => set_others_cement_value(text)} variant="unstyled" placeholder={t("Avg. MT Sold *")} />
                                        </View>
                                    )}
                                </Stack>
                            </VStack>
                        )}
                        {selectedStep == 7 && (
                            <VStack space={3}>
                                <VStack space={1} marginY={2}>
                                    <Text color={colorTheme.dark} fontSize="md" textAlign="center" fontWeight="bold" textTransform="uppercase">{t("Family Details for Insurance")}</Text>
                                    <Text fontSize="xs" textAlign="center">({t("Insurance is subject to qualify in the related Tier")})</Text>
                                </VStack>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={p_first_name} onChangeText={(text) => set_p_first_name(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Properietor First Name") + " *"} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={p_middle_name} onChangeText={(text) => set_p_middle_name(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Properietor Middle Name")} />
                                </View>
                                <View style={styles.inputbox}>
                                    <Input size="lg" value={p_last_name} onChangeText={(text) => set_p_last_name(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Properietor Last Name")} />
                                </View>
                                {maritalStatus == "Single" ?
                                    <Stack space={3} marginY={3}>
                                        <HStack space={1} paddingHorizontal={5} backgroundColor={"#eeeeee"} padding={3} borderRadius={30} alignItems="center">
                                            <CheckBox value={isFather} onValueChange={() => isSetFather(!isFather)} tintColors={{ true: colorTheme.dark }} />
                                            <Text fontSize="md" color={colorTheme.dark} fontWeight="bold">{t("Add Father's Details")}</Text>
                                        </HStack>
                                        {isFather && (
                                            <Stack space={2} marginBottom={3}>
                                                <View style={styles.inputbox}>
                                                    <Input size="lg" value={father_name} onChangeText={(text) => set_father_name(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Father's Name") + " *"} />
                                                </View>
                                                <Pressable style={styles.inputbox} onPress={() => showDatePicker("father_dob")}>
                                                    <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"}>
                                                        <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />
                                                        <Text color={father_DOB != "" ? "#111111" : "#999999"} fontSize="md">{father_DOB != "" ? moment(father_DOB).format("DD MMMM, YYYY") : t("Father's Date of Birth") + " *"}</Text>
                                                    </HStack>
                                                </Pressable>
                                            </Stack>
                                        )}
                                        <HStack space={1} paddingHorizontal={5} backgroundColor={"#eeeeee"} padding={3} borderRadius={30} alignItems="center">
                                            <CheckBox value={isMother} onValueChange={() => isSetMother(!isMother)} tintColors={{ true: colorTheme.dark }} />
                                            <Text fontSize="md" color={colorTheme.dark} fontWeight="bold">{t("Add Mother's Details")}</Text>
                                        </HStack>
                                        {isMother && (
                                            <Stack space={2} marginBottom={3}>
                                                <View style={styles.inputbox}>
                                                    <Input size="lg" value={mother_name} onChangeText={(text) => set_mother_name(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Mother's Name") + " *"} />
                                                </View>
                                                <Pressable style={styles.inputbox} onPress={() => showDatePicker("mother_dob")}>
                                                    <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"}>
                                                        <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />
                                                        <Text color={mother_DOB != "" ? "#111111" : "#999999"} fontSize="md">{mother_DOB != "" ? moment(mother_DOB).format("DD MMMM, YYYY") : t("Mother's Date of Birth") + " *"}</Text>
                                                    </HStack>
                                                </Pressable>
                                            </Stack>
                                        )}
                                    </Stack>
                                    :
                                    <Stack space={3} marginY={3}>
                                        <HStack space={1} paddingHorizontal={5} backgroundColor={"#eeeeee"} padding={3} borderRadius={30} alignItems="center">
                                            <CheckBox value={isSpouse} onValueChange={() => isSetSpouse(!isSpouse)} tintColors={{ true: colorTheme.dark }} />
                                            <Text fontSize="md" color={colorTheme.dark} fontWeight="bold">{t("Add Spouse Details")}</Text>
                                        </HStack>
                                        {isSpouse && (
                                            <Stack space={2}>
                                                <View style={styles.inputbox}>
                                                    <Input size="lg" value={spouse_name} onChangeText={(text) => set_spouse_name(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Spouse Name") + " *"} />
                                                </View>
                                                <View style={styles.inputbox}>
                                                    <Select variant="unstyled" size="lg" placeholder={t("Select Gender") + " *"}
                                                        InputLeftElement={<Icon name="male-female-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />}
                                                        selectedValue={spouse_gender}
                                                        onValueChange={value => set_spouse_gender(value)}
                                                        _selectedItem={{
                                                            backgroundColor: '#eeeeee',
                                                            endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                                        }}>
                                                        <Select.Item label="Male" value="Male" />
                                                        <Select.Item label="Female" value="Female" />
                                                    </Select>
                                                </View>
                                                <Pressable style={styles.inputbox} onPress={() => showDatePicker("spouse_dob")}>
                                                    <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"}>
                                                        <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />
                                                        <Text color={spouse_DOB != "" ? "#111111" : "#999999"} fontSize="md">{spouse_DOB != "" ? moment(spouse_DOB).format("DD MMMM, YYYY") : t("Date of Birth") + " *"}</Text>
                                                    </HStack>
                                                </Pressable>
                                                <Stack space={3} marginTop={3}>
                                                    <HStack space={1} paddingHorizontal={5} backgroundColor={"#eeeeee"} padding={3} borderRadius={30} alignItems="center">
                                                        <CheckBox value={isFirstchild} onValueChange={() => isSetFirstchild(!isFirstchild)} tintColors={{ true: colorTheme.dark }} />
                                                        <Text fontSize="md" color={colorTheme.dark} fontWeight="bold">{t("Add First Child Details")}</Text>
                                                    </HStack>
                                                    {isFirstchild && (
                                                        <Stack space={2}>
                                                            <View style={styles.inputbox}>
                                                                <Input size="lg" value={firstchild_name} onChangeText={(text) => set_firstchild_name(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("First Child Name") + " *"} />
                                                            </View>
                                                            <View style={styles.inputbox}>
                                                                <Select variant="unstyled" size="lg" placeholder={t("Select Gender") + " *"}
                                                                    InputLeftElement={<Icon name="male-female-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />}
                                                                    selectedValue={firstchild_gender}
                                                                    onValueChange={value => set_firstchild_gender(value)}
                                                                    _selectedItem={{
                                                                        backgroundColor: '#eeeeee',
                                                                        endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                                                    }}>
                                                                    <Select.Item label="Male" value="Male" />
                                                                    <Select.Item label="Female" value="Female" />
                                                                </Select>
                                                            </View>
                                                            <Pressable style={styles.inputbox} onPress={() => showDatePicker("firstchild_dob")}>
                                                                <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"}>
                                                                    <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />
                                                                    <Text color={firstchild_DOB != "" ? "#111111" : "#999999"} fontSize="md">{firstchild_DOB != "" ? moment(firstchild_DOB).format("DD MMMM, YYYY") : t("Date of Birth") + " *"}</Text>
                                                                </HStack>
                                                            </Pressable>
                                                            <Stack space={3} marginTop={3}>
                                                                <HStack space={1} paddingHorizontal={5} backgroundColor={"#eeeeee"} padding={3} borderRadius={30} alignItems="center">
                                                                    <CheckBox value={isSecondchild} onValueChange={() => isSetSecondchild(!isSecondchild)} tintColors={{ true: colorTheme.dark }} />
                                                                    <Text fontSize="md" color={colorTheme.dark} fontWeight="bold">{t("Add Second Child Details")}</Text>
                                                                </HStack>
                                                                {isSecondchild && (
                                                                    <Stack space={2}>
                                                                        <View style={styles.inputbox}>
                                                                            <Input size="lg" value={secondchild_name} onChangeText={(text) => set_secondchild_name(text)} variant="unstyled" InputLeftElement={<Icon name="person-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />} placeholder={t("Second Child Name") + " *"} />
                                                                        </View>
                                                                        <View style={styles.inputbox}>
                                                                            <Select variant="unstyled" size="lg" placeholder={t("Select Gender") + " *"}
                                                                                InputLeftElement={<Icon name="male-female-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, textAlign: 'center' }} />}
                                                                                selectedValue={secondchild_gender}
                                                                                onValueChange={value => set_secondchild_gender(value)}
                                                                                _selectedItem={{
                                                                                    backgroundColor: '#eeeeee',
                                                                                    endIcon: <Icon name="checkmark-circle" size={22} color="#2BBB86" style={{ right: 0, position: 'absolute' }} />
                                                                                }}>
                                                                                <Select.Item label="Male" value="Male" />
                                                                                <Select.Item label="Female" value="Female" />
                                                                            </Select>
                                                                        </View>
                                                                        <Pressable style={styles.inputbox} onPress={() => showDatePicker("secondchild_dob")}>
                                                                            <HStack paddingY={Platform.OS == "ios" ? "1.5" : "2.5"}>
                                                                                <Icon name="calendar-outline" size={20} color="#666666" style={{ width: 25, marginLeft: 10, marginRight: 10, textAlign: 'center' }} />
                                                                                <Text color={secondchild_DOB != "" ? "#111111" : "#999999"} fontSize="md">{secondchild_DOB != "" ? moment(secondchild_DOB).format("DD MMMM, YYYY") : t("Date of Birth") + " *"}</Text>
                                                                            </HStack>
                                                                        </Pressable>
                                                                    </Stack>
                                                                )}
                                                            </Stack>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        )}
                                    </Stack>
                                }
                                <HStack space={3} paddingHorizontal={5} padding={3} borderRadius={30} alignItems="center">
                                    <CheckBox value={isAgreed} onValueChange={() => isSetAgreed(!isAgreed)} tintColors={{ true: colorTheme.dark }} />
                                    <Text width="85%" fontSize="xs" color={colorTheme.dark} fontWeight="bold">{t("I certify that all answers given are true and complete to the best of my knowledge. I understand that submission of any false or misleading information would lead to the termination of my membership in the program.")}</Text>
                                </HStack>
                                <HStack space={3} paddingHorizontal={5} padding={3} borderRadius={30} alignItems="center">
                                    <CheckBox value={termsCheck} onValueChange={() => setTermsCheck(!termsCheck)} tintColors={{ true: colorTheme.dark }} />
                                    <Text width="85%" fontSize="xs" color={colorTheme.dark} fontWeight="bold">{t("I have read and agreed to the terms of services and privacy policy.")}</Text>
                                </HStack>
                            </VStack>
                        )}
                    </VStack>
                    {dateType == "dob" ?
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            maximumDate={new Date(year - 18, month, day)}
                        />
                        :
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            maximumDate={new Date()}
                        />
                    }
                </ScrollView>
                <HStack backgroundColor={"#eeeeee"} paddingY="3" paddingX="5" justifyContent="space-between">
                    <Button disabled={selectedStep == 1} variant="unstyled" style={[styles.outlineBtn, { width: '48%', opacity: selectedStep == 1 ? 0.2 : 1 }]} borderColor={colorTheme.dark} backgroundColor="#ffffff" onPress={() => onPrev()}>
                        <Text color={colorTheme.dark} fontSize="md" fontWeight="medium">{t("Back")}</Text>
                    </Button>
                    {selectedStep == 7 ?
                        <Button style={[styles.solidBtn, { width: '48%' }]} borderColor={colorTheme.dark} backgroundColor={colorTheme.dark} onPress={() => onSubmit()}>
                            <Text color={"#ffffff"} fontSize="md" fontWeight="medium">{t("Submit")}</Text>
                        </Button>
                        :
                        <Button style={[styles.solidBtn, { width: '48%' }]} borderColor={colorTheme.dark} backgroundColor={colorTheme.dark} onPress={() => onNext()}>
                            <Text color={"#ffffff"} fontSize="md" fontWeight="medium">{t("Next")}</Text>
                        </Button>
                    }
                </HStack>
            </Box>
            <Actionsheet isOpen={isPicker} onClose={onPickerClose}>
                <Actionsheet.Content>
                    <Text color="#666666" fontSize="md" textAlign="center">{t("Select Image Source")}</Text>
                    <Actionsheet.Item onPress={() => openProfilePicker("library")}>{t("Load from Library")}</Actionsheet.Item>
                    <Actionsheet.Item onPress={() => openProfilePicker("camera")}>{t("Use Camera")}</Actionsheet.Item>
                    <Actionsheet.Item onPress={() => openProfilePicker("cancel")}>{t("Cancel")}</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
            {success && (
                <View style={styles.spincontainer}>
                    <LinearGradient
                        colors={['#ffffff', "#cccccc"]}
                        start={{ x: 0.5, y: 0 }}
                        style={{ width: '80%', borderRadius: 15, overflow: 'hidden' }}
                    >
                        <VStack space={1} w="100%" paddingX="6" paddingY="10" alignItems="center" justifyContent="center">
                            <Icon name="checkmark-done-circle-outline" size={100} color={colorTheme.dark}></Icon>
                            <Text mt={8} fontSize="xl" fontWeight="bold" color="#111111">{t("Thank You")}</Text>
                            <Text textAlign="center" fontSize="sm" fontWeight="medium" color="#111111" mb={3}>{t("Registration has been successfull. Please check once, Username & Password send by SMS to your registered mobile number.")}.</Text>
                            <Button size="sm" style={{ backgroundColor: colorTheme.dark, width: 180, borderRadius: 30, overflow: 'hidden' }} onPress={() => navigation.goBack()} marginY={4}>
                                <Text color="#ffffff" fontSize="sm" fontWeight="medium">{t("Continue")}</Text>
                            </Button>
                        </VStack>
                    </LinearGradient>
                </View>
            )}
            {loading && (
                <View style={styles.spincontainer}>
                    <ActivityIndicator animating={loading} size="large" color="#42bb52" />
                </View>
            )}
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    inputbox: { backgroundColor: '#ffffff', borderRadius: 30, width: '100%', overflow: 'hidden', borderColor: '#e7e7e9', borderWidth: 2 },
    solidBtn: { borderWidth: 1, borderRadius: 30 },
    outlineBtn: { borderWidth: 1, borderRadius: 30 },
    spincontainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
});

export default RegistrationScreen;
