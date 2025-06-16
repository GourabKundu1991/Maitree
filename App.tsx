/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { LogBox, Platform, SafeAreaView, StatusBar, View } from 'react-native';

import WelcomeScreen from './screens/Welcome';
import LoginScreen from './screens/Login';
import OtpScreen from './screens/Otp';
import HomeScreen from './screens/Home';
import LeftMenuBarScreen from './screens/LeftMenuBar';
import ProfileScreen from './screens/Profile';
import ProfileDetailsScreen from './screens/ProfileDetails';
import LanguageScreen from './screens/Language';
import ChangePasswordScreen from './screens/ChangePassword';
import GiftVouchersScreen from './screens/GiftVouchers';
import PerformanceUpdateScreen from './screens/PerformanceUpdate';
import RewardScreen from './screens/Rewards';
import ProductDetailsScreen from './screens/ProductDetails';
import CartScreen from './screens/Cart';


import AddreessScreen from './screens/Address';
import AboutProgramScreen from './screens/AboutProgram';
import ContentDetailsScreen from './screens/ContentDetail';

import ContactUsScreen from './screens/ContactUs';
import LeaderBoardScreen from './screens/LeaderBoard';


import SubDealerOrderListScreen from './screens/SubDealerOrderList';
import NewsUpdatesScreen from './screens/NewsUpdates';
import GalleryScreen from './screens/Gallery';
import MemberListScreen from './screens/MemberList';

import MemberChildOptionScreen from './screens/MemberChildOption';
import MemberLiftingScreen from './screens/MemberLifting';
import MySaleTargetScreen from './screens/MySaleTarget';


import TakeStorePictureScreen from './screens/TakeStorePicture';
import EConnectScreen from './screens/EConnect';
import TermsConditionsScreen from './screens/TermsConditions';
import MyRewardOrdersScreen from './screens/MyRewardOrders';

import OrderDetailsScreen from './screens/OrderDetails';
import PointStatementScreen from './screens/PointStatement';

import From16ListScreen from './screens/From16List';
import InsuranceDocumentsScreen from './screens/InsuranceDocuments';


import MySupportTicketsScreen from './screens/MySupportTickets';

import MemberOrdersScreen from './screens/MemberOrders';
import ForgotPassScreen from './screens/ForgotPass';

import MemberOrderDetailsScreen from './screens/MemberOrderDetails';

import MemberPointStatementScreen from './screens/MemberPointHistory';

import OrderNuvocoProductsScreen from './screens/OrderNuvocoProducts';




import RegisterVriddhiLiftingScreen from './screens/RegisterVriddhiLifting';
import VerifyFirmScreen from './screens/VerifyFirm';


import RegistrationScreen from './screens/Registration';


import NuvocoOrdersScreen from './screens/NuvocoOrders';

import UpdateKYCScreen from './screens/UpdateEKYC';

import F2AScreen from './screens/FreedomToAsk';
import F2ACategoryScreen from './screens/F2ACategory';

import F2ARelatedProgramScreen from './screens/F2ARelatedProgram';
import F2AAaddComplainScreen from './screens/F2AAaddComplain';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {

  useEffect(() => {
    LogBox.ignoreLogs([
      'Animated: `useNativeDriver`',
      'Sending `onAnimatedValueUpdate` with no listeners registered.'
    ]);
  }, [])

  function MyStack() {
    return (
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="MyGiftVouchers" component={GiftVouchersScreen} />
        <Stack.Screen name="PerformanceUpdate" component={PerformanceUpdateScreen} />
        <Stack.Screen name="Rewards" component={RewardScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Address" component={AddreessScreen} />
        <Stack.Screen name="AboutProgram" component={AboutProgramScreen} />
        <Stack.Screen name="ContentDetail" component={ContentDetailsScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderBoardScreen} />
        <Stack.Screen name="SubDealerOrderList" component={SubDealerOrderListScreen} />
        <Stack.Screen name="NewsUpdates" component={NewsUpdatesScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="MemberList" component={MemberListScreen} />
        <Stack.Screen name="MemberChild" component={MemberChildOptionScreen} />
        <Stack.Screen name="MemberLifting" component={MemberLiftingScreen} />
        <Stack.Screen name="MySaleTarget" component={MySaleTargetScreen} />
        <Stack.Screen name="TakeStorePicture" component={TakeStorePictureScreen} />
        <Stack.Screen name="Econnect" component={EConnectScreen} />
        <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
        <Stack.Screen name="MyRewardOrders" component={MyRewardOrdersScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="PointStatement" component={PointStatementScreen} />
        <Stack.Screen name="From16List" component={From16ListScreen} />
        <Stack.Screen name="InsurancePage" component={InsuranceDocumentsScreen} />
        <Stack.Screen name="MySupportTickets" component={MySupportTicketsScreen} />
        <Stack.Screen name="MemberOrders" component={MemberOrdersScreen} />
        <Stack.Screen name="ForgotPass" component={ForgotPassScreen} />
        <Stack.Screen name="MemberOrderDetails" component={MemberOrderDetailsScreen} />
        <Stack.Screen name="MemberPointStatement" component={MemberPointStatementScreen} />
        <Stack.Screen name="OrderNuvocoProducts" component={OrderNuvocoProductsScreen} />
        <Stack.Screen name="RegisterVriddhiLifting" component={RegisterVriddhiLiftingScreen} />
        <Stack.Screen name="VerifyFirm" component={VerifyFirmScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="NuvocoOrders" component={NuvocoOrdersScreen} />
        <Stack.Screen name="UpdateKYC" component={UpdateKYCScreen} />
        <Stack.Screen name="FreedomToAsk" component={F2AScreen} />
        <Stack.Screen name="F2ACategory" component={F2ACategoryScreen} />
        <Stack.Screen name="F2ARelatedProgram" component={F2ARelatedProgramScreen} />
        <Stack.Screen name="F2AAaddComplain" component={F2AAaddComplainScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Drawer.Navigator drawerContent={(props) => <LeftMenuBarScreen {...props} />}>
          <Drawer.Screen name="Intro" options={{ headerShown: false, swipeEnabled: false }} component={MyStack} />
        </Drawer.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
