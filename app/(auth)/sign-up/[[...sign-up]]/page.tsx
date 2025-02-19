import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <SignUp
        appearance={{
          elements: {
            card: "shadow-lg rounded-lg p-6 bg-white",
            rootBox: "flex justify-center items-center h-screen",
            formFieldInput: "border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500",
            headerTitle: "text-xl font-bold text-gray-800",
            submitButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
          },
        }}
      />
    </div>
  );
}
