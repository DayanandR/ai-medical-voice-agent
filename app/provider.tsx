"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

interface ProviderProps {
  children: React.ReactNode;
}

export type UserDetail = {
  name: string;
  credits: number;
  email: string;
};

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [userDetail, setUserDetail] = useState<UserDetail | undefined>();
  const { user } = useUser();

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    const result = await axios.post("/api/users");
    setUserDetail(result.data);
    console.log(result.data);
  };
  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
