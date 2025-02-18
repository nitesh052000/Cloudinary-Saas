import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp 
    path="/sign-up"
        routing="path"
        signInUrl="/sign-in"  // Link to the sign-in page
        appearance={{
          variables: {
            colorPrimary: "#ff6347",  // Custom color
          },
        }}
     />
}