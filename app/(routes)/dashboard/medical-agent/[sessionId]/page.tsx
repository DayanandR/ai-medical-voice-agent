"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doctorAgent } from "../../(_components)/SuggestedDoctorCard";
import {
  Circle,
  Loader,
  PhoneCall,
  PhoneOff,
  CheckCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type Message = {
  role: string;
  text: string;
};

// ✅ Report generation stages for better UX
type ReportStage = {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
};

const MedicalVoiceAgent = () => {
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(
    null
  );
  const [callStarted, setCallStarted] = useState<boolean>(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [reportProgress, setReportProgress] = useState(0); // ✅ Progress tracking
  const [reportStages, setReportStages] = useState<ReportStage[]>([
    // ✅ Stage tracking
    {
      id: "analyze",
      label: "Analyzing conversation",
      completed: false,
      active: false,
    },
    {
      id: "extract",
      label: "Extracting medical information",
      completed: false,
      active: false,
    },
    {
      id: "generate",
      label: "Generating report",
      completed: false,
      active: false,
    },
    {
      id: "save",
      label: "Saving to database",
      completed: false,
      active: false,
    },
  ]);
  const [currentStage, setCurrentStage] = useState<string>(""); // ✅ Current stage
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { sessionId } = useParams();

  useEffect(() => {
    if (sessionId) {
      getSessionDetails();
    }
  }, [sessionId]);

  // Call timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStarted) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStarted]);

  // ✅ Progress simulation effect for smooth UX
  useEffect(() => {
    if (isGeneratingReport && reportProgress < 90) {
      const timer = setTimeout(() => {
        setReportProgress((prev) => Math.min(prev + Math.random() * 15, 85));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isGeneratingReport, reportProgress]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getSessionDetails = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        "/api/session-chat?sessionId=" + sessionId
      );
      setSessionDetail(result?.data[0]);
    } catch (error) {
      console.error("Failed to fetch session:", error);
      toast.error("Failed to load session details");
    } finally {
      setLoading(false);
    }
  };

  console.log("Session Detail:", sessionDetail);
  console.log("Messages:", messages);

  // ✅ Update stage helper function
  const updateStage = (stageId: string, completed: boolean = false) => {
    setCurrentStage(stageId);
    setReportStages((prev) =>
      prev.map((stage) => ({
        ...stage,
        active: stage.id === stageId && !completed,
        completed:
          stage.id === stageId
            ? completed
            : stage.completed ||
              prev.findIndex((s) => s.id === stageId) >
                prev.findIndex((s) => s.id === stage.id),
      }))
    );
  };

  const StartCall = () => {
    if (!sessionDetail?.selectedDoctor) {
      toast.error("Doctor information not loaded");
      return;
    }

    setIsStartingCall(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const vapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hi There! I'm your AI Medical Assistant. I'm here to help you with any health questions or concerns you might have today. How are you feeling?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetail?.selectedDoctor?.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };

    //@ts-ignore
    vapi.start(vapiAgentConfig);

    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
      setIsStartingCall(false);
      toast.success("Call connected successfully");
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
    });

    vapi.on("message", (message: any) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${message.role}: ${message.transcript}`);

        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => [...prev, { role: role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
      setIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setCurrentRole("user");
      setIsSpeaking(false);
    });

    vapi.on("error", (error: any) => {
      console.error("Vapi error:", error);
      setIsStartingCall(false);
      toast.error("Failed to start call");
    });
  };

  const generateReport = async () => {
    if (!messages || messages.length === 0) {
      console.log("No messages to generate report from");
      toast.error("No conversation found to generate report");
      return;
    }

    console.log("Generating report with messages:", messages);

    try {
      // ✅ Stage 1: Analyzing conversation
      updateStage("analyze");
      setReportProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Small delay for UX

      // ✅ Stage 2: Extracting information
      updateStage("extract");
      setReportProgress(40);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ✅ Stage 3: Generating report (actual API call)
      updateStage("generate");
      setReportProgress(60);

      const result = await axios.post("/api/medical-report", {
        messages: messages,
        sessionDetail: sessionDetail,
        sessionId: sessionId,
      });

      // ✅ Stage 4: Saving to database
      updateStage("save");
      setReportProgress(80);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ✅ Complete all stages
      setReportProgress(100);
      updateStage("save", true);

      console.log("Report generated:", result?.data);
      return result?.data;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  };

  const endCall = async () => {
    if (vapiInstance) {
      vapiInstance.stop();
      vapiInstance.removeAllListeners();
      setCallStarted(false);
      setVapiInstance(null);
      setIsGeneratingReport(true);
      setReportProgress(0); // ✅ Reset progress

      try {
        await generateReport();
        toast.success("Your report has been generated successfully!");

        setTimeout(() => {
          router.replace("/dashboard");
        }, 1000);
      } catch (error) {
        console.error("Failed to generate report:", error);
        toast.error("Failed to generate report. Please try again.");

        setTimeout(() => {
          router.replace("/dashboard");
        }, 2000);
      } finally {
        setIsGeneratingReport(false);
        setReportProgress(0);
        // ✅ Reset stages
        setReportStages((prev) =>
          prev.map((stage) => ({
            ...stage,
            completed: false,
            active: false,
          }))
        );
      }
    }
  };

  // ✅ Report Generation Overlay Component
  const ReportGenerationOverlay = () => {
    if (!isGeneratingReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-9999 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generating Your Medical Report
            </h3>
            <p className="text-gray-600 text-sm">
              Please wait while we process your consultation
            </p>
          </div>

          {/* ✅ Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(reportProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${reportProgress}%` }}
              ></div>
            </div>
          </div>

          {/* ✅ Stage Indicators */}
          <div className="space-y-3">
            {reportStages.map((stage) => (
              <div key={stage.id} className="flex items-center space-x-3">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    stage.completed
                      ? "bg-green-500"
                      : stage.active
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  {stage.completed ? (
                    <CheckCircle className="h-3 w-3 text-white" />
                  ) : stage.active ? (
                    <Clock className="h-3 w-3 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    stage.completed
                      ? "text-green-600 font-medium"
                      : stage.active
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {stage.label}
                  {stage.active && <span className="ml-2">...</span>}
                </span>
              </div>
            ))}
          </div>

          {/* ✅ Estimated Time */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Estimated time: 10-15 seconds • Processing {messages.length}{" "}
              messages
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-5 rounded-3xl border bg-secondary min-h-[600px]">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-6">
          <h2 className="p-1 px-2 border rounded-md gap-2 flex items-center">
            <Circle
              className={`h-4 w-4 rounded-full ${
                callStarted ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {callStarted ? "Connected..." : "Not Connected"}
          </h2>
          <h2 className="font-bold text-xl text-gray-400">
            {formatTime(callDuration)}
          </h2>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          {loading ? (
            // Shimmer Loader
            <div className="flex flex-col items-center animate-pulse">
              <div className="h-[100px] w-[100px] bg-gray-300 rounded-full"></div>
              <div className="mt-2 h-4 w-24 bg-gray-300 rounded"></div>
              <div className="mt-1 h-3 w-32 bg-gray-200 rounded"></div>
              <div className="mt-20">
                <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-40 bg-gray-300 rounded"></div>
              </div>
              <div className="mt-6 h-10 w-32 bg-gray-300 rounded"></div>
            </div>
          ) : sessionDetail ? (
            // Actual Content
            <div className="flex flex-col items-center w-full max-w-4xl">
              {/* Doctor Info Section */}
              <div className="flex flex-col items-center mb-8">
                <Image
                  src={
                    sessionDetail.selectedDoctor?.image || "/default-doctor.png"
                  }
                  alt="Doctor"
                  width={100}
                  height={100}
                  className="h-[100px] w-[100px] object-cover rounded-full"
                />
                <h2 className="mt-2 text-lg font-semibold">
                  {sessionDetail.selectedDoctor?.specialist}
                </h2>
                <p className="text-sm text-gray-400">AI Medical Voice Agent</p>
              </div>

              {/* Conversation Display */}
              <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 mb-8">
                {messages?.slice(-3).map((msg: Message, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 rounded-lg bg-gray-50 w-full"
                  >
                    <span className="font-semibold text-sm capitalize">
                      {msg.role === "assistant" ? "Doctor" : "You"}:
                    </span>
                    <p className="text-gray-700 text-sm mt-1 break-words">
                      {msg.text}
                    </p>
                  </div>
                ))}

                {/* Live Transcript Display */}
                {liveTranscript && liveTranscript?.length > 0 && (
                  <div className="mb-3 p-3 rounded-lg bg-blue-50 w-full border border-blue-200">
                    <span className="font-semibold text-sm capitalize text-blue-600">
                      {currentRole === "assistant" ? "Doctor" : "You"}{" "}
                      (speaking...):
                    </span>
                    <p className="text-blue-700 text-sm mt-1 italic break-words">
                      {liveTranscript}
                    </p>
                  </div>
                )}

                {/* Empty state */}
                {!callStarted && messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">
                      Start the call to begin your conversation with the AI
                      doctor
                    </p>
                  </div>
                )}

                {/* Message counter when call is active */}
                {callStarted && messages.length > 3 && (
                  <div className="text-center text-xs text-gray-400 mt-2">
                    Showing last 3 messages • Total: {messages.length} messages
                  </div>
                )}
              </div>

              {/* Call Control Buttons */}
              <div className="flex justify-center">
                {!callStarted ? (
                  <Button
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={StartCall}
                    disabled={isStartingCall}
                    size="lg"
                  >
                    {isStartingCall ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <PhoneCall className="h-4 w-4" />
                        Start Call
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={endCall}
                    variant="destructive"
                    disabled={isGeneratingReport}
                    size="lg"
                  >
                    {isGeneratingReport ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <PhoneOff className="h-4 w-4" />
                        End Call & Generate Report
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <p className="text-gray-400 text-lg">No session found.</p>
              <Button
                className="mt-4"
                onClick={() => router.replace("/dashboard")}
                variant="outline"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>

      <ReportGenerationOverlay />
    </>
  );
};

export default MedicalVoiceAgent;
