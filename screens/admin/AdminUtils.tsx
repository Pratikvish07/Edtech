import AsyncStorage from '@react-native-async-storage/async-storage';

// ----- Utils -----
export const saveData = async (key: string, value: any) => { await AsyncStorage.setItem(key, JSON.stringify(value)); };
export const getData = async (key: string) => { const val = await AsyncStorage.getItem(key); return val ? JSON.parse(val) : null; };
