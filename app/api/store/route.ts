import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { NextRequest, NextResponse } from "next/server";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("file") as File;
  console.log(file);

  if (!file) {
    return NextResponse.json({ status: 400, error: "No file found" });
  }

  try {
    let loader;
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("This is a docx file");
      loader = new DocxLoader(file);
    } else if (file.type === "application/pdf") {
      console.log("This is a pdf file");
      loader = new PDFLoader(file);
    } else {
      console.log("Invalid file type. Please upload a docx or pdf file.");
      return NextResponse.json({ status: 400, error: "Invalid file type" });
    }
    const splitDocument = await loader.loadAndSplit();

    const pineconeClient = new PineconeClient();
    await pineconeClient.init({
      apiKey: process.env.PINECONE_API_KEY || "",
      environment: process.env.PINECONE_ENVIRONMENT || "",
    });

    const pineconeIndex = pineconeClient.Index(
      process.env.PINECONE_INDEX_NAME as string
    );

    await PineconeStore.fromDocuments(splitDocument, new OpenAIEmbeddings(), {
      pineconeIndex,
    });

    return NextResponse.json({ status: 200 });

  } catch (error) {

    console.log(error);

    return NextResponse.json({ status: 500 });
    
  }
}
