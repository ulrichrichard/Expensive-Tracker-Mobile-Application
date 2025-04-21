import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import { BarChart } from "react-native-gifted-charts";
import Loading from "@/components/Loading";
import useFetchData from "@/hooks/useFetchData";
import { DoctorType } from "@/types";
import { where, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/auhtContext";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";

const Statistics = () => {
  const { user } = useAuth();

  const {
    data: doctors,
    error,
    loading: doctorsLoading,
  } = useFetchData<DoctorType>("doctors", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotals = () => {
    return doctors.reduce(
      (totals: any, item: DoctorType, index: number) => {
        const payment = Number(item.payment) || 0;

        // Total
        totals.payment += payment;

        // Min
        if (index === 0 || payment < totals.min) {
          totals.min = payment;
        }

        // Max
        if (index === 0 || payment > totals.max) {
          totals.max = payment;
        }

        return totals;
      },
      { payment: 0, min: 0, max: 0 }
    );
  };

  const chartData = doctors.map((doctor, index) => ({
    label: doctor.name?.slice(0, 3) || "N/A",
    value: Number(doctor.payment),
    frontColor: colors.primary,
  }));

  const totals = getTotals();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Statistiques" />

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          {doctorsLoading ? (
            <Loading color={colors.white} />
          ) : error ? (
            <Text style={{ color: colors.rose }}>Error loading data</Text>
          ) : (
            <>
              {/* Résumé des paiements */}
              {/*               <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Total: ${totals.payment}</Text>
                <Text style={styles.summaryText}>Min: ${totals.min}</Text>
                <Text style={styles.summaryText}>Max: ${totals.max}</Text>
              </View> */}
              <HomeCard />

              {/* Histogramme */}
              <View style={styles.chartContainer}>
                {chartData.length > 0 ? (
                  <BarChart
                    data={chartData}
                    barWidth={scale(14)}
                    spacing={scale(20)}
                    roundedTop
                    roundedBottom
                    hideRules
                    yAxisLabelPrefix="Ar"
                    yAxisThickness={0}
                    xAxisThickness={0}
                    yAxisLabelWidth={scale(35)}
                    yAxisTextStyle={{ color: colors.neutral350 }}
                    xAxisLabelTextStyle={{
                      color: colors.neutral350,
                      fontSize: verticalScale(13),
                    }}
                    noOfSections={3}
                    minHeight={5}
                  />
                ) : (
                  <View style={styles.noChart}>
                    <Text style={{ color: colors.white }}>
                      No data available
                    </Text>
                  </View>
                )}
              </View>
              {/** We need to create an index to the database */}
              <TransactionList
                data={doctors}
                loading={doctorsLoading}
                emptyListMessage="Pas encore de Medecin ajouté !"
                title="Médecins récents"
              />
            </>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
  summaryContainer: {
    backgroundColor: colors.neutral700,
    borderRadius: radius._12,
    padding: spacingY._10,
    gap: spacingY._5,
  },
  summaryText: {
    color: colors.white,
    fontSize: verticalScale(14),
    fontWeight: "bold",
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
  },
});
