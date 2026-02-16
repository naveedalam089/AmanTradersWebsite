

## Plan: Fix Password Reset, Navbar, Brands Mobile Links, Reviews, and Logo Management

### 1. Fix Password Reset via setup-admin Edge Function

**Problem**: The `setup-admin` function detects the existing admin and returns "already exists" without resetting the password.

**Fix**: Update `supabase/functions/setup-admin/index.ts` to always reset the password to the default (`Admin@123`) when the admin already exists, using `supabase.auth.admin.updateUserById()`.

### 2. Remove Phone/Call from Navbar

**Fix**: In `src/components/Navbar.tsx`, remove the phone number link and its container (the `<a href="tel:...">` block and the Phone icon import).

### 3. Fix Brand Links Not Opening on Mobile

**Problem**: In `src/components/Brands.tsx`, the `target` and `rel` attributes are conditionally applied. Some mobile browsers need explicit handling.

**Fix**: Ensure `target="_blank"` and `rel="noopener noreferrer"` are always set when `website_url` exists, and add an `onClick` handler as fallback that calls `window.open()` for mobile compatibility.

### 4. Compact Reviews on Mobile with Expand Option

**Fix**: In `src/components/Reviews.tsx`, add a fixed max-height for review text on mobile (e.g., 4 lines via `line-clamp-4`) with a "Read more" toggle button that expands the full review text.

### 5. Admin-Managed Logo in Navbar

**Fix**:
- Create a new storage bucket `site-logos` (public) via migration.
- Add a logo upload section in the **Settings** tab of `src/pages/AdminDashboard.tsx` that saves the URL to `site_settings` with key `site_logo_url`.
- Update `src/components/Navbar.tsx` to fetch `site_logo_url` from `site_settings` and display the uploaded logo image instead of the "AT" text icon. Fall back to "AT" if no logo is set.
- Update `src/components/Footer.tsx` similarly to show the logo.

---

### Technical Details

**Files to modify:**
- `supabase/functions/setup-admin/index.ts` -- add password reset logic
- `src/components/Navbar.tsx` -- remove phone, add dynamic logo
- `src/components/Brands.tsx` -- fix mobile link opening
- `src/components/Reviews.tsx` -- add collapsible review text
- `src/pages/AdminDashboard.tsx` -- add logo upload in Settings tab
- `src/components/Footer.tsx` -- use dynamic logo

**New migration:**
- Create `site-logos` storage bucket with public access and RLS for admin uploads

**Edge function redeployment:**
- `setup-admin` function will be redeployed with the password reset fix

