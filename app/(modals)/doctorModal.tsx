import { StyleSheet, View, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { DoctorType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/context/auhtContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateDoctor, deleteDoctor } from "@/services/walletService";

const DoctorModal = () => {
  const { user, updateUserData } = useAuth();
  const [doctor, setDoctor] = useState<DoctorType>({
    name: "",
    daysNumber: 0,
    dailyRate: 0,
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const oldDoctor: {
    name: string;
    daysNumber: string;
    dailyRate: string;
    image: any;
    id: string;
  } = useLocalSearchParams();

  console.log("old doctor: ", oldDoctor);
  useEffect(() => {
    if (oldDoctor?.id) {
      setDoctor({
        name: oldDoctor?.name,
        daysNumber: Number(oldDoctor?.daysNumber),
        dailyRate: Number(oldDoctor?.dailyRate),
        image: oldDoctor?.image,
      });
    }
  }, []);

  const onSubmit = async () => {
    let { name, daysNumber, dailyRate, image } = doctor;
    if (!name.trim() || !daysNumber || !dailyRate) {
      Alert.alert("Medecin", "Veuillez remplir tous les champs");
      return;
    }

    const data: DoctorType = {
      name,
      daysNumber,
      dailyRate,
      image: image ? image : null,
      uid: user?.uid,
    };
    if (oldDoctor?.id) data.id = oldDoctor?.id;

    //console.log("good to go");
    // todo: include doctor id if updating
    setLoading(true);
    const res = await createOrUpdateDoctor(data);
    setLoading(false);
    console.log("result: ", res);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Medecin", res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldDoctor?.id) return;
    setLoading(true);
    const res = await deleteDoctor(oldDoctor?.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Medecin", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Êtes-vous sûr de vouloir faire cela ? \nCette action supprimera tous les médecins",
      [
        {
          text: "Annuler",
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldDoctor?.id ? "Mettre à jour le médecin" : "Nouveau médecin"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/** Form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} style={{ fontSize: 16 }}>
              Nom du médecin
            </Typo>
            <Input
              placeholder="Entrer le nom du médecin"
              value={doctor.name}
              onChangeText={(value) => setDoctor({ ...doctor, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} style={{ fontSize: 16 }}>
              Nombre de jours travaillés
            </Typo>
            <Input
              keyboardType="numeric"
              value={doctor.daysNumber?.toString()}
              onChangeText={(value) =>
                setDoctor({
                  ...doctor,
                  daysNumber: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} style={{ fontSize: 16 }}>
              Taux de rémunération par jour
            </Typo>
            <Input
              keyboardType="numeric"
              value={doctor.dailyRate?.toString()}
              onChangeText={(value) =>
                setDoctor({
                  ...doctor,
                  dailyRate: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} style={{ fontSize: 16 }}>
              Profile du médecin
            </Typo>
            {/** image input */}
            <ImageUpload
              file={doctor.image}
              onClear={() => {
                setDoctor({ ...doctor, image: null });
              }}
              onSelect={(file) => setDoctor({ ...doctor, image: file })}
              placeholder="upload image"
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {oldDoctor?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo
            color={colors.black}
            fontWeight={"700"}
            style={{ fontSize: 16 }}
          >
            {oldDoctor?.id ? "Mettre à jour le médecin" : "Ajouter un médecin"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default DoctorModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._35,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
