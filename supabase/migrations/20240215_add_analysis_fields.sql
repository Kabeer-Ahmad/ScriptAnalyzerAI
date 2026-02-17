alter table analyses 
add column if not exists rewrite_suggestions text[],
add column if not exists target_audience text;
