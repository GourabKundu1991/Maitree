import { Platform } from "react-native";

// UAT base url
/* const BASE_URL = "https://uat-mandres.straightline.in/nvcl_nvl_maitree/v3/Maitree_req";
export const successReturnUrl = 'https://uat-nuvomaitree.mjunction.in/F2A_general_complaint/success_return';
export const errorReturnUrl = 'https://uat-nuvomaitree.mjunction.in/F2A_general_complaint/error_return'; */

// LIVE base url
const BASE_URL = "https://api.straightline.in/nvcl_nvl_maitree/v3/Maitree_req";
export const successReturnUrl = 'https://maitree.co.in/F2A_general_complaint/success_return';  
export const errorReturnUrl = 'https://maitree.co.in/F2A_general_complaint/error_return';

export {BASE_URL};

export const OS_TYPE = Platform.OS == 'ios' ? "ios" : "android";
export const APP_VERSION = Platform.OS == 'ios' ? "1.1.2" : "11.2.1";
export const API_KEY = '332827c90c411790ffa33170c13daa8efb12fd4c';
export const f2a_ownership_token = 'af9gXg8cPtZVJvQ1';