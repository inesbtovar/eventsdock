# EventFlow — Full Build Guide

## Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Emails**: Resend (free tier)

---

## Project Structure

```
your-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx                  # List of events
│   │   └── [eventId]/
│   │       ├── page.tsx              # Event overview
│   │       ├── guests/page.tsx       # Guest management
│   │       ├── website/page.tsx      # Template picker + editor
│   │       └── settings/page.tsx
│   ├── event/
│   │   └── [slug]/
│   │       ├── page.tsx              # Public event website
│   │       └── rsvp/[token]/page.tsx # Guest RSVP page (no login needed)
│   └── api/
│       ├── events/route.ts
│       ├── guests/route.ts
│       ├── guests/import/route.ts    # Excel/CSV upload
│       └── rsvp/[token]/route.ts     # Public RSVP endpoint
├── components/
│   ├── dashboard/
│   ├── templates/
│   │   ├── TemplateElegant.tsx
│   │   ├── TemplateRustic.tsx
│   │   └── TemplateModern.tsx
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils.ts
└── middleware.ts
```

---

## Phase 1 — Setup (Day 1)

### 1. Install dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install xlsx                          # Excel parsing
npm install resend                        # Email sending
npm install @radix-ui/react-dialog @radix-ui/react-tabs
npm install lucide-react
npm install nanoid                        # Unique tokens
npm install react-hot-toast
```

### 2. Environment variables (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Phase 2 — Supabase Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- EVENTS
create table events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,           -- for public URL: /event/my-wedding
  date timestamptz,
  location text,
  description text,
  template text default 'elegant',     -- elegant | rustic | modern
  template_config jsonb default '{}',  -- colors, fonts, custom text
  cover_image text,                    -- Supabase Storage URL
  is_published boolean default false,
  created_at timestamptz default now()
);

-- GUESTS
create table guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  rsvp_token text unique not null,     -- unique per guest, used in link
  rsvp_status text default 'pending',  -- pending | confirmed | declined
  plus_one boolean default false,
  plus_one_name text,
  dietary text,
  notes text,
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- RLS POLICIES
alter table events enable row level security;
alter table guests enable row level security;

-- Organizer can do anything with their events
create policy "owner_all_events" on events
  for all using (auth.uid() = user_id);

-- Organizer can do anything with guests of their events
create policy "owner_all_guests" on guests
  for all using (
    event_id in (select id from events where user_id = auth.uid())
  );

-- Anyone can read published events (for public website)
create policy "public_read_events" on events
  for select using (is_published = true);

-- Anyone can read/update guests via token (for RSVP)
create policy "public_rsvp_guests" on guests
  for select using (true);

create policy "public_update_rsvp" on guests
  for update using (true)
  with check (rsvp_token = rsvp_token);
```

---

## Phase 3 — Key Files to Create

See the individual `.tsx` and `.ts` files in this guide package.

---

## Phase 4 — Core User Flows

### Flow 1: Organizer creates event
1. Register/login → Dashboard
2. "New Event" → fill name, date, location
3. Auto-generates a `slug` (e.g., "ana-joao-wedding-2025")
4. Pick template → customize colors/text
5. Publish → public URL is `/event/ana-joao-wedding-2025`

### Flow 2: Import guests
1. Upload Excel/CSV with columns: Name, Email, Phone
2. App parses it, creates guest records
3. Each guest gets a unique `rsvp_token`
4. Organizer sees table of all guests + status

### Flow 3: Send invitations
1. For each guest, a shareable link is generated:
   `/event/[slug]/rsvp/[token]`
2. Organizer copies/shares via WhatsApp, email, etc.
3. Guest opens link → sees event site → confirms/declines
4. No account needed for guest

### Flow 4: Guest RSVP
1. Guest opens link → beautiful event page
2. Clicks "Confirm Attendance" or "Decline"
3. Optional: dietary notes, +1 info
4. Submit → status updates in DB
5. Organizer sees real-time dashboard update

---

## Phase 5 — Templates Strategy

Start with 3 free templates:
- **Elegant** — white/gold, serif fonts, minimalist
- **Rustic** — warm earthy tones, handwritten feel  
- **Modern** — bold typography, full-bleed images

Paid templates later:
- Floral, Tropical, Winter, etc.
- Custom color picker (premium)
- Custom domain (premium)

---

## Phase 6 — Deployment Checklist

1. Push to GitHub
2. Import repo in Vercel
3. Add all environment variables in Vercel dashboard
4. In Supabase: add your Vercel domain to allowed URLs
5. Set up Supabase email templates for auth
6. Configure Resend domain (or use their test domain)

---

## Monetization Plan

**Free forever:**
- 3 templates
- Up to 100 guests per event
- Up to 2 active events

**Paid (future):**
- Premium templates (one-time purchase)
- Unlimited guests
- Custom domain
- PDF guest list export
- Analytics (who viewed, when)
