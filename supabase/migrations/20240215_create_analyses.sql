-- Create analyses table if not exists
create table if not exists analyses (
  id uuid default gen_random_uuid() primary key,
  file_id uuid references files(id) on delete cascade not null,
  summary text,
  key_points text[], -- array of strings
  insights text,
  time_assessment text,
  analysis_service text,
  topics text[],
  sentiment text,
  action_items text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(file_id)
);

-- Add RLS policies
alter table analyses enable row level security;

create policy "Users can view their own analyses"
  on analyses for select
  using (
    exists (
      select 1 from files
      where files.id = analyses.file_id
      and files.user_id = auth.uid()
    )
  );

create policy "Users can insert their own analyses"
  on analyses for insert
  with check (
    exists (
      select 1 from files
      where files.id = analyses.file_id
      and files.user_id = auth.uid()
    )
  );

-- Create index for faster retrieval
create index if not exists analyses_file_id_idx on analyses(file_id);
