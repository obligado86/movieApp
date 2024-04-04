import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from '../pages/Home';
import Movie from "../pages/Movie";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" options={{headerShown: false}} component={Home}/>
                <Stack.Screen name="Movie" options={{headerShown: false}} component={Movie}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;