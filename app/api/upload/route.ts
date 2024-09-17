import fs from "fs";

import { NextResponse } from "next/server";
import formidable from "formidable";
import FormData from "form-data";

const FLASK_BACKEND_URL = "http://localhost:5000/upload"; // Flask backend URL

export async function POST(request: Request): Promise<Response> {
  console.log("Received files");
  const formData = await request.formData();

  console.log("Files received:", formData);

  const flaskResponse = await fetch(FLASK_BACKEND_URL, {
    method: "POST",
    body: formData,
  });

  const flaskData = await flaskResponse.json();

  console.log("Flask response:", flaskData);

  if (!flaskResponse.ok) {
    console.error("Error processing files at Flask backend", flaskData);
    //throw new Error("Error processing files at Flask backend");
  }

  return flaskData;
}
