-- =====================================================
-- 减脂记录网站 - 数据库 Schema
-- 单用户应用，无需 user_id 和 RLS 策略
-- =====================================================

create extension if not exists "pgcrypto";

-- ============ 1. 体重记录 ============
create table weight_logs (
  id          uuid primary key default gen_random_uuid(),
  date        date not null unique,
  weight_kg   numeric(5,1) not null,
  note        text,
  created_at  timestamptz default now()
);

-- ============ 2. 饮食记录 ============
create type meal_slot as enum (
  'breakfast',
  'lunch',
  'afternoon',
  'dinner',
  'night'
);

create table meals (
  id              uuid primary key default gen_random_uuid(),
  date            date not null,
  slot            meal_slot not null,
  description     text not null,
  calories        integer not null,
  protein_g       integer default 0,
  fat_g           integer default 0,
  carbs_g         integer default 0,
  is_cafeteria    boolean default false,
  created_at      timestamptz default now(),
  unique(date, slot)
);

-- ============ 3. 饮水记录 ============
create table water_logs (
  id          uuid primary key default gen_random_uuid(),
  date        date not null unique,
  ml          integer not null default 0,
  target_ml   integer default 2000,
  created_at  timestamptz default now()
);

-- ============ 4. 蛋白粉记录 ============
create table protein_powder_logs (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  slot        meal_slot not null,
  scoops      numeric(3,1) not null default 1,
  created_at  timestamptz default now()
);

-- ============ 5. 运动记录 ============
create type exercise_type as enum (
  'tennis',
  'walking',
  'jump_rope',
  'hiit',
  'other'
);

create table exercises (
  id              uuid primary key default gen_random_uuid(),
  date            date not null,
  type            exercise_type not null,
  duration_min    integer not null,
  calories_burned integer default 0,
  note            text,
  created_at      timestamptz default now()
);

-- ============ 6. 欺骗餐记录 ============
create table cheat_meals (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  meal_type   text not null,
  restaurant  text,
  calories    integer,
  note        text,
  created_at  timestamptz default now()
);

create or replace function can_have_cheat_meal(check_date date)
returns boolean as $$
  select not exists (
    select 1 from cheat_meals
    where date >= (check_date - interval '13 days')
      and date <  check_date
  );
$$ language sql stable;

-- ============ 7. 每日清单 ============
create table daily_checklist (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  item_key    text not null,
  completed   boolean default false,
  unique(date, item_key)
);

-- ============ 8. 每周清单 ============
create table weekly_checklist (
  id          uuid primary key default gen_random_uuid(),
  week_start  date not null,
  item_key    text not null,
  completed   boolean default false,
  unique(week_start, item_key)
);

-- ============ 9. 阶段目标 ============
create table phases (
  id            uuid primary key default gen_random_uuid(),
  phase_number  integer not null,
  name          text not null,
  start_week    integer not null,
  end_week      integer not null,
  target_weight numeric(5,1) not null,
  description   text,
  created_at    timestamptz default now()
);

insert into phases (phase_number, name, start_week, end_week, target_weight, description) values
  (1, '适应期',     1,  4, 98, '建立饮食习惯，不用完美'),
  (2, '稳定减脂期', 5, 12, 92, '体重持续下降'),
  (3, '平台突破期', 13, 20, 86, '可能遇到平台期，坚持住'),
  (4, '冲刺期',    21, 26, 80, '适当收紧饮食');

-- ============ 10. 每日汇总 ============
create table daily_summaries (
  id              uuid primary key default gen_random_uuid(),
  date            date not null unique,
  total_calories  integer default 0,
  total_protein_g integer default 0,
  total_fat_g     integer default 0,
  total_carbs_g   integer default 0,
  total_water_ml  integer default 0,
  total_protein_powder_scoops numeric(3,1) default 0,
  exercise_calories integer default 0,
  net_calories    integer default 0,
  created_at      timestamptz default now()
);

create or replace function refresh_daily_summary(target_date date)
returns void as $$
begin
  insert into daily_summaries (date, total_calories, total_protein_g, total_fat_g, total_carbs_g,
    total_water_ml, total_protein_powder_scoops, exercise_calories, net_calories)
  select
    target_date,
    coalesce((select sum(calories) from meals where date = target_date), 0),
    coalesce((select sum(protein_g) from meals where date = target_date), 0),
    coalesce((select sum(fat_g) from meals where date = target_date), 0),
    coalesce((select sum(carbs_g) from meals where date = target_date), 0),
    coalesce((select ml from water_logs where date = target_date), 0),
    coalesce((select sum(scoops) from protein_powder_logs where date = target_date), 0),
    coalesce((select sum(calories_burned) from exercises where date = target_date), 0),
    coalesce((select sum(calories) from meals where date = target_date), 0)
    - coalesce((select sum(calories_burned) from exercises where date = target_date), 0)
  on conflict (date) do update set
    total_calories = excluded.total_calories,
    total_protein_g = excluded.total_protein_g,
    total_fat_g = excluded.total_fat_g,
    total_carbs_g = excluded.total_carbs_g,
    total_water_ml = excluded.total_water_ml,
    total_protein_powder_scoops = excluded.total_protein_powder_scoops,
    exercise_calories = excluded.exercise_calories,
    net_calories = excluded.net_calories;
end;
$$ language plpgsql;

-- ============ 11. 饥饿事件 ============
create table hunger_logs (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  time        time not null default now()::time,
  severity    smallint check (severity between 1 and 5),
  action_taken text,
  note        text,
  created_at  timestamptz default now()
);

-- ============ 12. 饮料记录 ============
create type beverage_category as enum (
  'zero_cal',
  'controlled',
  'water',
  'other'
);

create table beverages (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  name        text not null,
  category    beverage_category not null,
  calories    integer default 0,
  created_at  timestamptz default now()
);

-- ============ 索引 ============
create index idx_meals_date on meals(date);
create index idx_exercises_date on exercises(date);
create index idx_weight_logs_date on weight_logs(date desc);
create index idx_daily_summaries_date on daily_summaries(date desc);
create index idx_hunger_logs_date on hunger_logs(date);
create index idx_beverages_date on beverages(date);
create index idx_protein_powder_date on protein_powder_logs(date);
create index idx_cheat_meals_date on cheat_meals(date desc);
create index idx_daily_checklist_date on daily_checklist(date);
