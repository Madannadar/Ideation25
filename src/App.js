import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>My PWA with Clerk Auth</h1>

      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>

      <SignedIn>
        <p>Welcome! You are signed in ✅</p>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default App;
