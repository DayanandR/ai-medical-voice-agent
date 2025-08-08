import React from "react";
import Image from "next/image";
import AddNewSessionDialog from "./AddNewSessionDialog";
import { IconBadge } from "@tabler/icons-react";

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
};

const DoctorAgentCard = ({ doctor }: props) => {
  const { description, specialist, image, subscriptionRequired } = doctor;

  return (
    <div className="flex flex-col border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 group w-full h-full max-w-md mx-auto">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={image}
          alt={specialist}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {subscriptionRequired && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <IconBadge className="h-3 w-3" />
            Premium
          </div>
        )}
      </div>

      {/* Text + Button */}
      <div className="flex flex-col flex-grow p-4">
        <h2 className="font-bold text-lg leading-tight mb-2 line-clamp-2 h-[48px]">
          {specialist}
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 h-[72px]">
          {description}
        </p>

        <div className="mt-auto pt-2">
          <AddNewSessionDialog
            selectedDoctor={doctor}
            triggerText="Start Consultation"
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorAgentCard;
