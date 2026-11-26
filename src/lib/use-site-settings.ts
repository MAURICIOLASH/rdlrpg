import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublicSettings } from "./settings.functions";
import { DEFAULT_SETTINGS } from "./settings";

export const SITE_SETTINGS_KEY = ["site-settings"] as const;

export function useSiteSettings() {
  const fetchSettings = useServerFn(getPublicSettings);
  const q = useQuery({ queryKey: SITE_SETTINGS_KEY, queryFn: () => fetchSettings(), staleTime: 60_000 });
  return { settings: q.data ?? DEFAULT_SETTINGS, loaded: q.isSuccess };
}
