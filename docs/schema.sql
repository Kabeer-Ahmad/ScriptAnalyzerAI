-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS table is handled by Supabase Auth (auth.users)

-- FILES Table
create table files (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  filename text not null,
  original_filename text not null,
  file_type text not null, -- 'audio', 'video'
  file_size bigint not null,
  storage_path text not null,
  source_type text not null check (source_type in ('upload', 'youtube')),
  source_url text,
  status text not null default 'uploading' check (status in ('uploading', 'processing', 'transcribing', 'transcribed', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for files
alter table files enable row level security;

create policy "Users can view their own files" on files
  for select using (auth.uid() = user_id);

create policy "Users can insert their own files" on files
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own files" on files
  for update using (auth.uid() = user_id);

create policy "Users can delete their own files" on files
  for delete using (auth.uid() = user_id);


-- TRANSCRIPTIONS Table
create table transcriptions (
  id uuid primary key default uuid_generate_v4(),
  file_id uuid references files(id) on delete cascade not null,
  transcript_text text,
  transcription_service text not null, -- 'assemblyai', 'deepgram'
  confidence_score float,
  language text,
  duration_seconds integer,
  word_count integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for transcriptions
alter table transcriptions enable row level security;

create policy "Users can view transcriptions of their files" on transcriptions
  for select using (exists (select 1 from files where files.id = transcriptions.file_id and files.user_id = auth.uid()));

-- ANALYSES Table
create table analyses (
  id uuid primary key default uuid_generate_v4(),
  file_id uuid references files(id) on delete cascade not null,
  summary text,
  key_points jsonb,
  insights text,
  time_assessment text,
  analysis_service text, -- 'claude', 'gpt4'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for analyses
alter table analyses enable row level security;

create policy "Users can view analyses of their files" on analyses
  for select using (exists (select 1 from files where files.id = analyses.file_id and files.user_id = auth.uid()));


-- CHAT SESSIONS Table
create table chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  file_id uuid references files(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for chat_sessions
alter table chat_sessions enable row level security;

create policy "Users can view their own chat sessions" on chat_sessions
  for select using (auth.uid() = user_id);

create policy "Users can create their own chat sessions" on chat_sessions
  for insert with check (auth.uid() = user_id);


-- CHAT MESSAGES Table
create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  model_used text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for chat_messages
alter table chat_messages enable row level security;

create policy "Users can view messages in their sessions" on chat_messages
  for select using (exists (select 1 from chat_sessions where chat_sessions.id = chat_messages.session_id and chat_sessions.user_id = auth.uid()));

create policy "Users can insert messages in their sessions" on chat_messages
  for insert with check (exists (select 1 from chat_sessions where chat_sessions.id = chat_messages.session_id and chat_sessions.user_id = auth.uid()));


-- STORAGE BUCKET
insert into storage.buckets (id, name) values ('media-files', 'media-files');

create policy "Media Files Access" on storage.objects for select using (bucket_id = 'media-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Media Files Upload" on storage.objects for insert with check (bucket_id = 'media-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Media Files Delete" on storage.objects for delete using (bucket_id = 'media-files' and auth.uid()::text = (storage.foldername(name))[1]);
