import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ViewProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const usernameQuery = router.query.username;
    const username = Array.isArray(usernameQuery)
      ? usernameQuery[0]
      : usernameQuery;

    if (username) {
      router.replace({
        pathname: "/view_profile/[username]",
        query: { username },
      });
      return;
    }

    router.replace("/discover");
  }, [router]);

  return null;
}
