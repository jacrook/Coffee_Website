# Google Analytics 4 Setup Guide

This site is configured with Google Analytics 4 (GA4) using best practices.

## Setup Instructions

### 1. Create a Google Analytics 4 Property

1. Go to https://analytics.google.com/
2. Click "Start measuring" or create a new GA4 property
3. Enter account name, property name (e.g., "Coffee Portfolio"), and reporting time zone
4. Choose your industry category and business size
5. Accept the Terms of Service

### 2. Get Your Measurement ID

After creating the property:
1. Go to **Admin** → **Data Streams** (under Property column)
2. Click on your web data stream
3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### 3. Add Your Measurement ID to the Project

1. Open the `.env` file in the project root
2. Replace `G-XXXXXXXXXX` with your actual measurement ID:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Save the file

### 4. Test Locally

```bash
npm run dev
```

- Open browser DevTools → Network tab
- Look for `gtag/js?id=G-XXXXXXXXXX` request
- Check Console - you should see a message that GA is disabled on localhost

### 5. Deploy and Verify

```bash
npm run build
npm run preview  # Test the production build locally
git add .
git commit -m "Configure Google Analytics"
git push
```

After deployment to GitHub Pages:
1. Visit your site
2. Go to **Google Analytics → Realtime** report
3. You should see your active user (may take a few minutes to appear)

## Configuration Details

### Best Practices Implemented:

1. **Async Loading**: GA script loads asynchronously to prevent blocking page render
2. **Environment Variable**: Measurement ID is stored in `.env` (not in code)
3. **Localhost Exclusion**: No tracking during development (`localhost` and `127.0.0.1` are excluded)
4. **Production Only**: Only tracks on live domains (GitHub Pages, custom domain)
5. **GA4 Latest**: Uses modern gtag.js with Google Analytics 4

### Files Modified:

- `index.html` - Added GA tracking code with hostname check
- `.env` - Contains your GA measurement ID (not in git)
- `.env.example` - Template for other developers

### Privacy Compliance:

This setup respects user privacy by:
- Not tracking on localhost/development
- Using Google's official tag (maintains Google's privacy practices)
- Not collecting PII (personally identifiable information)

For additional privacy compliance (GDPR, CCPA), consider adding:
- Cookie consent banner
- Anonymize IP feature: `gtag('config', 'GA_MEASUREMENT_ID', { 'anonymize_ip': true });`

## Viewing Analytics

After 24-48 hours of data collection:

### Key Reports:
- **Realtime**: See active users right now
- **Reports → Engagement**: Pages and screens, events, conversions
- **Reports → Acquisition**: How users found your site
- **Reports → Demographics**: User location, device, browser

### Custom Events (if needed):

To track custom events (like menu clicks, form submissions):

```javascript
// Example: Track menu click
gtag('event', 'menu_click', {
  'menu_item': 'Journey'
});

// Example: Track contact form submission
gtag('event', 'generate_lead', {
  'form_id': 'contact_form'
});
```

## Troubleshooting

### Not seeing data in Realtime report?
- Wait 5-10 minutes after first visit
- Check you're on the production site (not localhost)
- Verify the Measurement ID in `.env` matches GA property
- Check browser Console for errors
- View page source and search for your Measurement ID

### Build issues?
- Ensure `.env` file exists in project root
- Restart dev server after changing `.env`
- Variable format must be `VITE_GA_MEASUREMENT_ID` (VITE_ prefix required)

### Want to disable tracking?
- Set `VITE_GA_MEASUREMENT_ID=` (empty value) in `.env`
- Or remove the GA code block from `index.html`

## Resources

- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [gtag.js Documentation](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [GA4 Best Practices](https://support.google.com/analytics/answer/9213394)
