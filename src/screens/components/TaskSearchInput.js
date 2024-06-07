import { useState } from 'react';
import { Image, TextInput, View } from 'react-native';

const IconSearch = () => (
    <View>
      <Image
        style={{width: 15, height: 15}}
        source={require('../../assets/lupa.png')}
      />
    </View>
  )

  export const TaskSearchInput = ( {getSearch} ) => {
    const [searchInput, setSearchInput] = useState(null);
    
    return(
      <View style = {{ flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 10, height: 35, backgroundColor: "#ddd", width: 260,  }}>
        <View style={{  justifyContent: "center", alignItems: "center", paddingLeft: 10, height: 35 }}><IconSearch /></View>
        <View style={{ marginLeft: 10, width: 200, height: 35}} >
          <TextInput style={{ backgroundColor: "#ddd", height: 35}} 
            placeholder="Tarea"
            value={searchInput} 
            onChangeText={(text) => {
              getSearch(text)
              setSearchInput(text)
            }}
          />
        </View>
      </View>
    )
  }