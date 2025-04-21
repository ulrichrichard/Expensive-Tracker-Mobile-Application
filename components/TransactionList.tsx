import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { DoctorListType, DoctorType, TransactionItemProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "./Typo";
import Loading from "./Loading";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: DoctorListType) => {
  const handleClick = (item: DoctorType) => {
    router.push({
      pathname: "/(modals)/doctorModal",
      params: {
        id: item?.id,
        name: item?.name,
        daysNumber: item?.daysNumber?.toString(),
        dailyRate: item?.dailyRate?.toString(),
        image: item?.image,
        uid: item?.uid,
      },
    });
  };
  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />
      </View>
      {!loading && data.length == 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  //let category = expenseCategories[item.category!];
  const IconComponent = item.image;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: colors.primaryDark }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>

        <View style={styles.categoryDes}>
          <Typo size={16}>{item.name}</Typo>
          <Typo
            size={16}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item?.daysNumber + " jours"}
          </Typo>
        </View>

        <View style={styles.amoutData}>
          <Typo size={16}>{item.dailyRate + " Ar par jour"}</Typo>
          <Typo size={16} color={colors.primary}>
            {item.payment}Ar
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  list: {
    minWidth: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amoutData: {
    alignItems: "flex-end",
    gap: 3,
  },
});
