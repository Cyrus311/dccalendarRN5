import { customVariables } from "../constants/customVariables"
import Toast from 'react-native-tiny-toast';

const getErrorMessage = err => {
  let errorMessage = "";
  let statusCode = err.status.toString();
  switch (statusCode) {
    case customVariables.ERRORCODE[422]:
      errorMessage = err.data.error.details[0].message;
      return errorMessage;

    case customVariables.ERRORCODE[400]:
      errorMessage = err.data.error.message;
      return errorMessage;
    default:
      return "İşlem başarısız. Lütfen tekrar deneyiniz.";
  }
};

// Detail prop : https://reactnativeexample.com/react-native-toast-like-component-works-on-ios-and-android/
const showToastMessage = (message) => {
  Toast.show(message);
}


export const helperService = {
  getErrorMessage,
  showToastMessage
};
