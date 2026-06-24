// app/signup/page.jsx
import { Suspense } from "react";
import SignupPage from "./Signup";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPage />
    </Suspense>
  );
}