import { memo } from 'react';
import { Image } from 'react-native';

export const IconInfo = memo(() => (
    <Image
      style={{ width: 14, height: 14 }}
      source={require("../../assets/info-circle.png")}
    />
  )
);