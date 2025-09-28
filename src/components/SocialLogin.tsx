"use client";
import { auth, googleProvider, githubProvider } from "@/lib/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SocialLogin() {
  const router = useRouter();

  const handleLogin = async (provider: any, name: string) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.emailVerified) {
        toast.error(`Verifique seu e-mail no ${name} antes de continuar.`);
        return;
      }

      toast.success(`Login com ${name} realizado!`);
      router.push("/dashboard");
    } catch (error) {
      toast.error(`Erro ao logar com ${name}.`);
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      <button
        type="button"
        onClick={() => handleLogin(googleProvider, "Google")}
        className="flex-1 btn-secondary py-2 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.925-5.445 3.925-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.483l2.816-2.815c-1.621-1.519-3.926-2.464-6.737-2.464-5.014 0-9.067 4.053-9.067 9.067s4.053 9.067 9.067 9.067c5.014 0 9.067-4.053 9.067-9.067c0-0.552-0.05-1.092-0.14-1.618h-6.533z"/>
        </svg>
        Google
      </button>

      <button
        type="button"
        onClick={() => handleLogin(githubProvider, "GitHub")}
        className="flex-1 btn-secondary py-2 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577 0-.285-.01-1.04-.015-2.084-3.338.724-4.033-1.607-4.033-1.607-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.362 1.234-3.226-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.509 11.509 0 016.002 0c2.293-1.552 3.301-1.23 3.301-1.23.652 1.652.241 2.873.117 3.176.766.864 1.234 1.915 1.234 3.226 0 4.609-2.807 5.624-5.479 5.921.43.372.814 1.102.814 2.222 0 1.606-.01 2.896-.01 3.286 0 .316.194.691.815.577 4.765-1.589 8.207-6.086 8.207-11.387 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </button>
    </div>
  );
}