// hooks/useSyncUserRole.ts
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useSyncUserRole() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    const checkRole = async () => {
      try {
        const res = await fetch("/api/user-role");
        const data = await res.json();

        if (!data?.role) return;

        if (session?.user?.role !== data.role) {
          // Обновляем сессию с новой ролью
          await update({ role: data.role });
        }

        // Если пользователь больше не админ — уводим
        if (data.role !== "admin") {
          router.push("/");
        }
      } catch (error) {
        console.error("Ошибка при обновлении роли:", error);
      }
    };

    checkRole();
  }, [session?.user?.role, status, router, update]);
}
