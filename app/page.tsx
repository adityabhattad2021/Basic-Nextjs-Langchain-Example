"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCompletion } from "ai/react";
import { toast } from "react-hot-toast";

export default function Home() {

  const { completion, input, isLoading, handleInputChange, handleSubmit } =
    useCompletion({
      api: "api/completion"
    });

  async function handleSubmitPressed(e: any) {
    e.preventDefault()
    console.log("Submitting", input, completion);
    handleSubmit(e);
  }

  async function handleFileUploadPromise(file: File) {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch("/api/store", {
          method: "POST",
          body: formData
        })

        const data = await response.json();
        if (data.status === 200) {
          resolve(data);
        }

      } catch (error) {

        console.log(error);
        reject(error);
      }
    })

  }

  const onDrop = useCallback(async (accepetedFiles: File[]) => {
    const file = accepetedFiles[0];
    toast.promise(handleFileUploadPromise(file), {
      loading: "Uploading file to pinecone DB",
      success: "Successfully uploaded file to the pinecone DB",
      error: "There was an error uploading file to the pinecone DB"
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <main className="
    flex
    min-h-screen
    flex-col
    items-center
    justify-between
    px-24
    py-5
  "
    >
      <h1
        className="
          md:text-5xl
          text-3xl
          font-sans
        "
      >
        Langchain PDF Chatbot
      </h1>
      <div
        className="
          flex
          h-[35rem]
          md:min-w-[50rem]
          min-w-[18rem]
          flex-col
          items-center
          bg-gray-600
          rounded-xl
        "
      >
        <div
          {...getRootProps({
            className:
              "dropzone w-full mb-4 bg-gray-900 border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer",
          })}
        >
          <input {...getInputProps()} />
          <p>Upload a PDF to add new data</p>
        </div>
        <div className="
          h-[40rem]
          p-3
          max-w-full
        ">
          {completion && `${completion}`}
        </div>
        <form onSubmit={handleSubmitPressed} className="flex flex-col gap-4 w-full p-3">
        <textarea
            value={input}
            onChange={handleInputChange}
            className="w-full h-10 px-3 py-2 resize-none overflow-y-aupto text-black bg-gray-300 rounded"
          />
          <button
            type="submit"
            className="py-2 border rounded-lg bg-gray-900 text-sm px-6 border-none"
          >
            Submit
          </button>
        </form>
      </div>



    </main>
  )
}
