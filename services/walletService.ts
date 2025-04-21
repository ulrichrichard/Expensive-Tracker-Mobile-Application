 import { DoctorType, ResponseType } from "@/types";
 import { firestore } from "@/config/Firebase";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateDoctor = async (
    doctorData: Partial<DoctorType> 
): Promise<ResponseType> => {
    try {
        let doctorToSave = {...doctorData};

        if(doctorData.image) {
            const imageUploadRes = await uploadFileToCloudinary(doctorData.image, "doctors");
            if (!imageUploadRes.success) {
                return {success: false, msg: imageUploadRes.msg || "Failed to upload doctor profile"};
            }
            doctorToSave.image = imageUploadRes.data;
        }

        if(!doctorData?.id) {
            // new doctor
            doctorToSave.payment = doctorData.daysNumber! * doctorData.dailyRate!;
            doctorToSave.created = new Date();
        }

        doctorToSave.payment = doctorData.daysNumber! * doctorData.dailyRate!;
        
        const doctorRef = doctorData?.id ? doc(firestore, "doctors", doctorData?.id) : 
        doc(collection(firestore, "doctors"));

        await setDoc(doctorRef, doctorToSave, {merge: true}) // updates only the data provided
        return {success: true, data: { ...doctorToSave, id: doctorRef.id }};
    } catch (error: any) {
        console.log("error creating or updating doctor: ", error);
        return { success: false, msg: error.message };
    }
}; 



export const deleteDoctor = async (doctorId: string): Promise<ResponseType> => {
    try {
        const doctorRef = doc(firestore, 'doctors', doctorId);
        await deleteDoc(doctorRef);

        return {success: true, msg: "doctor deleted successfully"};
    } catch (err: any) {
        console.log("error deleting doctor: ", err);
        return {success: false, msg: err.message};
    }
}