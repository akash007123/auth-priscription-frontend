import React, { forwardRef } from "react";
import { PatientData } from "./PatientForm";
import { useAuth } from "../contexts/AuthContext";

interface Medicine {
  id: number;
  name: string;
  dose: string;
}

interface PrescriptionPreviewProps {
  patientData: PatientData;
  medicines: Medicine[];
  note?: string;
}

const formatSimpleDate = (date: string | Date): string => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";

  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

const PrescriptionPreview = forwardRef<
  HTMLDivElement,
  PrescriptionPreviewProps
>(({ patientData, medicines, note }, ref) => {
  const { user } = useAuth();
  return (
    <div
      ref={ref}
      id="prescription"
      className="bg-white print:bg-white p-8 max-w-4xl mx-auto min-h-screen flex flex-col"
    >
      {/* Top Section */}
      <div className="border-b border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-start gap-4">
          {/* LEFT: Logo + Clinic Info */}
          <div className="flex gap-4 items-start">
            {/* Logo */}
            <div className=" rounded-lg p-2 w-20 h-20 flex items-center justify-center">
              <img
                src={user?.logoPic || "/logo.png"}
                alt="Clinic Logo"
                className="w-15 h-15 object-contain"
              />
            </div>

            {/* Text Content */}
            <div>
              <h1 className="font-bold  leading-tight" style={{color:'#0d66a5'}}>
                {user?.clinicHospitalName}
              </h1>

              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {user?.name || "Dr Shashank Bhargava"}
              </p>

              <p className="text-xs text-gray-700">{user?.qualification || "MBBS, MD, FAHRS"} - {user?.specialty}</p>

              <p className="text-xs text-gray-600 mt-1 max-w-xl">
                {user?.address || "MPEB Office, Opposite Gate No. 4, Maksi Road, Freeganj, Ujjain"}
              </p>

              <p className="text-xs italic text-gray-500 mt-0.5">
                Online consultation as per the NMC guidelines.
              </p>
            </div>
          </div>

          {/* RIGHT: Date + Registration */}
          <div className="text-right text-xs text-gray-700 whitespace-nowrap">
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {formatSimpleDate(patientData.date)}
            </p>
            <p className="mt-1">
              <span className="font-semibold">Reg. No.</span> {user?.registrationNo || "MP 19579"}
            </p>
            <p>
              <span className="font-semibold">Ph:</span> {user?.mobile || "9329198211"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mb-6 flex-grow">
        <div className="grid grid-cols-1">
          <div className="text-lg">
            <strong>{patientData.name}</strong>
          </div>
          <div>
            <strong>Age:</strong> {patientData.age}
          </div>
          <div>
            <strong>Gender:</strong> {patientData.gender}
          </div>
        </div>

        <div>
          <strong>Diagnosis:</strong> &nbsp;
          <span className="mt-1">{patientData.diagnosis}</span>
        </div>

        <div className="mt-5">
          <img src="./rx.png" className="w-10 mb-2" alt="" />
          <strong>Medicines:</strong>
          <ul className="mt-2 ml-5 space-y-1 list-disc">
            {medicines
              .filter((m) => m.name.trim())
              .map((medicine) => (
                <li key={medicine.id}>
                  {medicine.name} &nbsp;&nbsp;--&nbsp;&nbsp; {medicine.dose}
                </li>
              ))}
          </ul>
        </div>

        {note && (
          <div className="mt-4">
            <strong>Notes</strong>
            <p className="mt-1">{note}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end border-t-[7px] border-blue-600 pt-4">
        <div>
          <p className="font-semibold">{user?.name || "Dr Shashank Bhargava"}</p>
          <p className="text-sm">{user?.qualification || "MBBS, MD, FAHRS"}</p>
          <p className="text-sm">Reg. No. {user?.registrationNo || "MP 19579"}</p>
        </div>
        <div>
          <p className="font-semibold text-blue-600">Made by Sosapient</p>
          <p className="text-sm">www.sosapient.in</p>
        </div>
      </div>
    </div>
  );
});

export default PrescriptionPreview;
