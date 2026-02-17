-- Create chat_messages table
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  file_id uuid references files(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table chat_messages enable row level security;

create policy "Users can view their own chat messages"
  on chat_messages for select
  using (
    exists (
      select 1 from files
      where files.id = chat_messages.file_id
      and files.user_id = auth.uid()
    )
  );

create policy "Users can insert their own chat messages"
  on chat_messages for insert
  with check (
    exists (
      select 1 from files
      where files.id = chat_messages.file_id
      and files.user_id = auth.uid()
    )
  );

-- Create index for faster retrieval
create index if not exists chat_messages_file_id_idx on chat_messages(file_id);
