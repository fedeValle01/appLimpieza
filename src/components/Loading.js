import { Image } from "react-native"
export default function LoadingGif(){
    return(
            <Image
              style={{ width: 175, height: 175 }}
              source={require("../assets/loading.gif")}
            />
        
    )
}
