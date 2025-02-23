"use client";
import React, { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

interface props {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div className=" space-y-4 w-full flex flex-col justify-center items-center">
      <CldUploadButton
        onSuccess={(a: any) => {
          console.log("Button clicked!");
          console.log("Your URL is:", a?.info?.public_id); // Check if the URL is correct
          onChange(a.info.secure_url);
        }}
        options={{
          maxFiles: 1,
        }}
        uploadPreset="pi0yvkru"
      >
        <div className=" p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
          <div className=" relative h-40 w-40">
            <Image
              fill
              alt="uploadImage"
              src={value || "/placeholder.svg"}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;
