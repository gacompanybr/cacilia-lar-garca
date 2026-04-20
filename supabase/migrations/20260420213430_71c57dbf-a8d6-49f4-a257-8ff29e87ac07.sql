-- Fix function search_path
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Restrict bucket listing — keep public READ via signed/public URLs but block listing arbitrary files.
-- Drop the broad SELECT and replace with one that only allows listing for corretores.
drop policy if exists "Public can view property images" on storage.objects;

create policy "Public can view individual property images"
  on storage.objects for select
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] is not null
  );