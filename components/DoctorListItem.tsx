import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { Router } from "expo-router";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { DoctorType } from "@/types";

const DoctorListItem = ({
  item,
  index,
  router,
}: {
  item: DoctorType;
  index: number;
  router: Router;
}) => {
  const openDoctor = () => {
    router.push({
      pathname: "/(modals)/doctorModal",
      params: {
        id: item?.id,
        name: item?.name,
        daysNumber: item?.daysNumber,
        dailyRate: item?.dailyRate,
        payment: item?.payment,
        image: item?.image,
      },
    });
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity style={styles.container} onPress={openDoctor}>
        <View style={styles.imageContainer}>
          <Image
            style={{ flex: 1 }}
            source={item?.image}
            contentFit="cover"
            transition={100}
          />
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item?.name}</Typo>
          <Typo size={20} color={colors.neutral400}>
            {item?.daysNumber + " days"}
          </Typo>
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item?.dailyRate + " $ per day"}</Typo>
          <Typo size={20} color={colors.neutral400}>
            ${item?.payment}
          </Typo>
        </View>

        <Icons.CaretRight
          size={verticalScale(20)}
          weight="bold"
          color={colors.white}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default DoctorListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(17),
  },
  imageContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  nameContainer: {
    flex: 1,
    gap: 2,
    marginLeft: spacingX._10,
  },
});
