import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Main from "./Pages/Main";
import Profile from "./Pages/Profile";

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: Main,
        navigationOptions: {
          title: "Dev Radar"
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          title: "Perfil Dev"
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: "#7D40E7"
        },
        headerTintColor: "#fff",
        headerBackTitleVisible: false
      }
    }
  )
);

export default Routes;
