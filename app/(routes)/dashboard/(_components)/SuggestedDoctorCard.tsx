import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

export type doctorAgent = {
  id: number;
  description: string;
  agentPrompt: string;
  specialist: string;
  voiceId: string;
  subscriptionRequired: boolean;
  image: string;
};

type props = {
  doctor: doctorAgent;
  setSelectedDoctor: (doctor: doctorAgent) => void;
  selectedDoctor: any;
};
const SuggestedDoctorCard = ({
  doctor,
  setSelectedDoctor,
  selectedDoctor,
}: props) => {
  const { specialist, image, description, id } = doctor;
  return (
    <div
      className={`rounded-4xl ${
        selectedDoctor?.id === id ? "border-2 border-blue-300" : "border-2"
      } m-4 p-6 w-[200px] text-center flex flex-col justify-center shadow-2xl cursor-pointer hover:border-blue-300`}
      onClick={() => setSelectedDoctor(doctor)}
    >
      <div className="flex justify-center">
        <Image
          src={image}
          alt={specialist}
          width={70}
          height={70}
          className="w-[70px] h-[70px] object-cover rounded-4xl text-center "
        />
      </div>
      <h2 className="font-bold mt-1">{specialist}</h2>
      <p className="text-sm text-gray-500  mt-1">{description}</p>
    </div>
  );
};

export default SuggestedDoctorCard;
