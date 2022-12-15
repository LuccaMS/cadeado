import { View, Image, Text } from "./styles";

export default function Navbar() {
  return (
    <View>
      <Text>Cadeado</Text>
      <Image source={require("./cadeado.png")} />
    </View>
  );
}
