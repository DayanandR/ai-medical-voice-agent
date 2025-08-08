"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  selectedDoctor?: doctorAgent; // ✅ Optional prop for pre-selected doctor
  triggerText?: string; // ✅ Custom trigger text
};

const AddNewSessionDialog = ({ selectedDoctor, triggerText }: Props) => {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<
    doctorAgent[] | null
  >(null);
  const [currentSelectedDoctor, setCurrentSelectedDoctor] =
    useState<doctorAgent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"notes" | "doctors" | "final">("notes");

  const router = useRouter();

  // ✅ Initialize with pre-selected doctor if provided
  useEffect(() => {
    if (selectedDoctor) {
      setCurrentSelectedDoctor(selectedDoctor);
      setStep("final"); // Skip to final step for pre-selected doctor
    }
  }, [selectedDoctor]);

  const handleClickNext = async (note: string) => {
    if (!note.trim()) {
      toast.error("Please provide some details about your health concerns");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      setSuggestedDoctors(result?.data || []);
      setStep("doctors");
      console.log("result", result?.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get doctor suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    if (!currentSelectedDoctor) {
      toast.error("Please select a doctor first");
      return;
    }

    if (!note.trim()) {
      toast.error("Please provide some details about your health concerns");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor: currentSelectedDoctor,
      });

      console.log(result.data);

      if (result?.data?.sessionId) {
        console.log(result?.data?.sessionId);
        toast.success("Consultation session created successfully!");
        setIsOpen(false);
        resetForm();
        router.push("/dashboard/medical-agent/" + result?.data?.sessionId);
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create consultation session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNote("");
    setSuggestedDoctors(null);
    if (!selectedDoctor) {
      setCurrentSelectedDoctor(null);
    }
    setStep(selectedDoctor ? "final" : "notes");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleBack = () => {
    if (selectedDoctor) {
      setIsOpen(false);
      return;
    }

    if (step === "doctors") {
      setStep("notes");
      setSuggestedDoctors(null);
    } else if (step === "final") {
      if (suggestedDoctors && suggestedDoctors.length > 0) {
        setStep("doctors");
      } else {
        setStep("notes");
        setSuggestedDoctors(null);
      }
    }
  };

  const handleDoctorSelect = (doctor: doctorAgent) => {
    setCurrentSelectedDoctor(doctor);
    setStep("final");
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger className="w-full mt-2 cursor-pointer bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 p-2 rounded-sm">
          {triggerText ||
            (selectedDoctor
              ? `Consult ${selectedDoctor.specialist}`
              : "+ Start Consultation")}
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDoctor
                ? `Consultation with ${selectedDoctor.specialist}`
                : step === "notes"
                ? "Add Basic Details"
                : step === "doctors"
                ? "Select Doctor"
                : "Confirm Consultation"}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4 space-y-4">
                {/* ✅ Step 1: Notes Input */}
                {step === "notes" && (
                  <>
                    <h2 className="text-sm text-muted-foreground">
                      Add symptoms or any other details:
                    </h2>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Describe your symptoms, concerns, or any specific health issues you'd like to discuss..."
                      className="h-[200px] mt-1"
                    />
                  </>
                )}

                {/* ✅ Step 2: Doctor Selection (only for non-pre-selected) */}
                {step === "doctors" && (
                  <div className="space-y-4">
                    {suggestedDoctors?.length === 0 ? (
                      <p className="text-sm text-red-500">
                        No doctors found for given details.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-5">
                        {suggestedDoctors?.map((doc: doctorAgent) => (
                          <SuggestedDoctorCard
                            doctor={doc}
                            key={doc.id}
                            setSelectedDoctor={() => handleDoctorSelect(doc)}
                            selectedDoctor={currentSelectedDoctor}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ✅ Step 3: Final Confirmation */}
                {step === "final" && currentSelectedDoctor && (
                  <div className="space-y-4">
                    {/* Show selected doctor info */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentSelectedDoctor.image}
                          alt={currentSelectedDoctor.specialist}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-blue-900">
                            {currentSelectedDoctor.specialist}
                          </h3>
                          <p className="text-sm text-blue-700">
                            {currentSelectedDoctor.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes section */}
                    <div>
                      <h2 className="text-sm font-semibold mb-2">
                        Your Health Concerns:
                      </h2>
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Describe your symptoms, concerns, or any specific health issues..."
                        className="h-[150px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            {/* ✅ Notes Step Footer */}
            {step === "notes" && (
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!note.trim() || loading}
                  onClick={() => handleClickNext(note)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* ✅ Doctor Selection Footer */}
            {step === "doctors" && (
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={!currentSelectedDoctor || loading}
                    onClick={() => setStep("final")}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ✅ Final Step Footer */}
            {step === "final" && (
              <div className="flex justify-between w-full">
                {!selectedDoctor && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                <div
                  className={`flex gap-2 ${
                    selectedDoctor ? "w-full justify-end" : ""
                  }`}
                >
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={!note.trim() || !currentSelectedDoctor || loading}
                    onClick={onStartConsultation}
                    className="min-w-[140px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Start Consultation"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewSessionDialog;
