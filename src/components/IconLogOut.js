import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function IconLogOut() {
  return <Image source={require('../assets/iconLogOut.png')} style={styles.image} />
}

const styles = StyleSheet.create({
    image: {
    width: 35,
    height: 35,
  },
})
