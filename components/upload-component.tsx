"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function UploadComponent() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [result, setResult] = useState(null);

  const handleFiles = (files: FileList) => {
    setSelectedFiles(files);
  };

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }

    const files = event.target.files;

    for (const file of Array.from(files)) {
      try {
        console.log("Uploading file:", file);

        // Send the file to the flask backend
        const formData = new FormData();
        formData.append("files", file);

        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setResult(data);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Error while uploading:", error);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFiles) {
      console.error("No files selected.");

      return;
    }

    // Create FormData object to send the files
    const formData = new FormData();

    for (const file of Array.from(selectedFiles)) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData, // Send the files as FormData
      });

      const data = await response.json();
      console.log("Data:", data);

      if (response.ok) {
        setResult(data);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error while uploading:", error);
    }
    /* 
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Send the files as FormData
      });

      const data = await response.json();
      console.log("Data:", data);

      if (response.ok) {
        setResult(data);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error while uploading:", error);
    } */
  };

  return (
    <div>
      <Input
        label="Select PDFs"
        type="file"
        multiple
        accept="application/pdf" // Only allow PDF files
        onChange={handleFileUpload}
      />
      {/* <form onSubmit={handleSubmit}>
        
        <Button type="submit">Upload and Analyze</Button>
      </form> */}

      {result && (
        <div>
          <h3>Analyzed Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
