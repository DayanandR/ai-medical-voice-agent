"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import {
  IconHeartHandshake,
  IconMicrophone,
  IconStethoscope,
  IconBrain,
  IconShieldCheck,
} from "@tabler/icons-react";
import { motion } from "motion/react";

export function FeatureBentoGrid() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col items-center justify-center space-y-4"
    >
      <motion.div
        variants={variants}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center"
      >
        <div className="w-6 h-6 rounded-full bg-white animate-pulse" />
      </motion.div>
      <div className="text-center">
        <div className="w-32 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mb-2" />
        <div className="w-24 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
    </motion.div>
  );
};

const SkeletonTwo = () => {
  const variants = {
    initial: { width: 0 },
    animate: {
      width: "100%",
      transition: { duration: 0.3 },
    },
  };

  const symptoms = ["Fever", "Headache", "Cough", "Fatigue"];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-3 p-4"
    >
      {symptoms.map((symptom, i) => (
        <motion.div
          key={i}
          variants={variants}
          style={{ animationDelay: `${i * 0.1}s` }}
          className="flex items-center space-x-2"
        >
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs">
            {symptom}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SkeletonThree = () => {
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(-45deg, #22c55e, #3b82f6, #8b5cf6, #06b6d4)",
        backgroundSize: "400% 400%",
      }}
    >
      <div className="text-white text-center p-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm font-medium">Analyzing Vitals</p>
      </div>
    </motion.div>
  );
};

const SkeletonFour = () => {
  const first = {
    initial: { x: 20, rotate: -5 },
    hover: { x: 0, rotate: 0 },
  };
  const second = {
    initial: { x: -20, rotate: 5 },
    hover: { x: 0, rotate: 0 },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2 p-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-3 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-400 rounded-full mb-2" />
        <p className="text-xs text-center font-semibold text-neutral-600 mb-2">
          "I have chest pain"
        </p>
        <p className="border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5">
          Urgent
        </p>
      </motion.div>

      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-3 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-2" />
        <p className="text-xs text-center font-semibold text-neutral-600 mb-2">
          "Mild headache"
        </p>
        <p className="border border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 text-xs rounded-full px-2 py-0.5">
          Moderate
        </p>
      </motion.div>

      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-3 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-2" />
        <p className="text-xs text-center font-semibold text-neutral-600 mb-2">
          "Routine checkup"
        </p>
        <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5">
          Low Priority
        </p>
      </motion.div>
    </motion.div>
  );
};

const SkeletonFive = () => {
  const variants = {
    initial: { x: 0, opacity: 0.7 },
    animate: {
      x: [0, 5, 0],
      opacity: [0.7, 1, 0.7],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-3 p-4">
      <motion.div
        variants={variants}
        className="flex items-start space-x-3 bg-white dark:bg-black rounded-2xl p-3 border border-neutral-200 dark:border-white/[0.1]"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-1">
            AI Analysis Complete
          </p>
          <div className="w-full bg-green-200 dark:bg-green-800 h-1 rounded-full">
            <motion.div
              className="h-1 bg-green-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          🔒 HIPAA Compliant • End-to-End Encrypted
        </p>
      </div>
    </motion.div>
  );
};

const items = [
  {
    title: "Voice-to-Diagnosis",
    description: (
      <span className="text-sm">
        Convert patient voice descriptions into structured medical insights
        using advanced AI.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconMicrophone className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Symptom Recognition",
    description: (
      <span className="text-sm">
        Automatically identify and categorize symptoms from natural speech
        patterns.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconStethoscope className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Real-time Health Monitoring",
    description: (
      <span className="text-sm">
        Continuous analysis of patient vitals and health indicators through
        voice.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconHeartHandshake className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Intelligent Triage System",
    description: (
      <span className="text-sm">
        AI-powered priority assessment to route patients based on symptom
        severity.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconBrain className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "HIPAA-Compliant Processing",
    description: (
      <span className="text-sm">
        Secure, encrypted voice processing that meets healthcare privacy
        standards.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconShieldCheck className="h-4 w-4 text-neutral-500" />,
  },
];
