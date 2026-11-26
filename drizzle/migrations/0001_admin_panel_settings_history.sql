DROP POLICY IF EXISTS "public reads public settings" ON public.site_settings;
CREATE POLICY "public reads public settings" ON public.site_settings FOR SELECT TO anon, authenticated
USING (setting_key = ANY (ARRAY['recruitment_open','intro_text','clan_rules','classes','about_text','home_motto','recruit_text']));
CREATE UNIQUE INDEX IF NOT EXISTS site_settings_key_uniq ON public.site_settings(setting_key);

CREATE TABLE public.application_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL,
  old_status text,
  new_status text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.application_events(application_id, created_at DESC);
GRANT SELECT, INSERT ON public.application_events TO authenticated;
GRANT ALL ON public.application_events TO service_role;
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read events" ON public.application_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins insert own events" ON public.application_events FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin') AND admin_id = auth.uid());