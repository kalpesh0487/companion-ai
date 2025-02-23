import prismadb from "@/lib/prismadb";
import React from "react";
import CompanionForm from "./components/CompanionForm";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";

interface CompanionPageProps {
  params: {
    companionId: string;
  };
}

const CompanionIdPage = async ({ params }: CompanionPageProps) => {

  const {userId} = auth();
  if(!userId) return redirectToSignIn()

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId
    },
  });

  const catagory = await prismadb.catagory.findMany();
  return (
    <div>
      <CompanionForm initialData={companion} catagories={catagory} />
    </div>
  );
};

export default CompanionIdPage;
