import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/auhtContext";
import Loading from "@/components/Loading";
import { DoctorType } from "@/types";
import DoctorListItem from "@/components/DoctorListItem";

const Doctor = () => {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: doctors,
    error,
    loading,
  } = useFetchData<DoctorType>("doctors", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  console.log("doctor: ", doctors?.length);

  const getTotalPayment = () =>
    doctors.reduce((total, item) => total + (item.payment || 0), 0);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/** doctors */}
        <View style={styles.doctors}>
          {/** header */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              Tous les médecins
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/doctorModal")}
            >
              <Icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>

          {/** todo:  doctors list */}

          {loading && <Loading />}
          <FlatList
            data={doctors}
            renderItem={({ item, index }) => {
              return (
                <DoctorListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={styles.listStyle}
          />
        </View>

        {/** balance view */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>
              ${getTotalPayment()?.toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Payment
            </Typo>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Doctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  doctors: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
