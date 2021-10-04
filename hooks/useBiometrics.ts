import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export default function useBiometrics() {
  const [biometricsActive, setBiometricsActive] = useState(false);
  const [hasHardware, setHasHardware] = useState(false);
  const [authTypes, setAuthTypes] = useState<
    LocalAuthentication.AuthenticationType[]
  >([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolledTypes, setEnrolledTypes] =
    useState<LocalAuthentication.SecurityLevel>();

  const getBiometricsStatus = () => {
    SecureStore.getItemAsync('biometricsActive').then((res) => {
      if (JSON.parse(res)) setBiometricsActive(true);
      else setBiometricsActive(false);
    });
  };

  const setBiometricsStatus = (status: boolean) => {
    SecureStore.setItemAsync('biometricsActive', JSON.stringify(status)).then(
      () => {
        setBiometricsActive(status);
      }
    );
  };

  const handleBiometricsStatus = () => {
    if (!biometricsActive) {
      LocalAuthentication.authenticateAsync()
        .then((result) => {
          if (result.success) {
            setBiometricsStatus(true);
          }
        })
        .catch((_) => {
          setBiometricsStatus(false);
        });
    } else {
      setBiometricsStatus(false);
    }
  };

  useEffect(() => {
    getBiometricsStatus();
    LocalAuthentication.hasHardwareAsync().then((res) => setHasHardware(res));
    LocalAuthentication.supportedAuthenticationTypesAsync().then((res) =>
      setAuthTypes(res)
    );
    LocalAuthentication.isEnrolledAsync().then((res) => setIsEnrolled(res));
    LocalAuthentication.getEnrolledLevelAsync().then((res) =>
      setEnrolledTypes(res)
    );
  }, []);

  return {
    biometricsActive,
    hasHardware,
    isEnrolled,
    handleBiometricsStatus,
  };
}
