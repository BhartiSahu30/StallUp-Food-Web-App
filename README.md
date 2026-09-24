# StallUp

StallUp is a platform that connects skilled street-food entrepreneurs with people who want to discover and support promising local food businesses.

It helps food vendors present their business ideas, allows supporters to explore verified opportunities, and provides business analysis, recommendation matching, and transparent progress tracking.

> StallUp is a hackathon prototype. It does not process real investments, loans, or financial returns.

## Problem

Many skilled street-food vendors have the talent and experience to run or expand a food business but lack capital for equipment, carts, raw materials, branding, or rent.

At the same time, people interested in supporting local businesses often lack a transparent way to:

- Find credible vendors
- Understand how much support is needed
- Evaluate a business proposal
- Compare local opportunities
- Track the progress of a supported business

## Solution

StallUp creates a bridge between food entrepreneurs and potential supporters through:

- Vendor profiles and business proposals
- Admin-led verification and trust badges
- Business viability calculations
- Smart recommendations based on supporter preferences
- Discovery through filters and map-based browsing
- Interest requests and business-progress tracking

## Main Features

### Vendor Features

- Create an account and vendor profile
- Submit a food-business proposal
- Add experience, location, food category, and required capital
- Explain the intended use of funds
- Upload food images and verification-document placeholders
- Calculate estimated revenue, expenses, profit, and break-even period
- Track verification status and supporter interest

### Supporter Features

- Create a supporter profile
- Set budget, location, category, and risk preferences
- Browse verified vendor proposals
- Search and filter by location, food category, funding need, and experience
- Receive recommendation matches with compatibility scores
- View detailed business viability information
- Save opportunities and express interest
- Track businesses they have chosen to support

### Admin Features

- Review vendor profiles and documents
- Approve or reject business proposals
- Assign verification status and trust scores
- Monitor platform activity and pending requests
- Review reports or flagged profiles

## Example Proposal

| Field | Example |
| --- | --- |
| Business | Momo Junction |
| Vendor | Riya Sharma |
| Location | Indore |
| Experience | 4 years |
| Capital Required | ₹80,000 |
| Use of Funds | Cart, steamer, raw materials, and branding |
| Estimated Monthly Revenue | ₹90,000 |
| Estimated Monthly Expenses | ₹55,000 |
| Estimated Monthly Profit | ₹35,000 |
| Estimated Break-even | 2–3 months |

## User Roles

| Role | Purpose |
| --- | --- |
| Vendor | Creates a food-business proposal and tracks interest |
| Supporter | Discovers and evaluates verified business opportunities |
| Admin | Reviews, verifies, and manages proposals |

## Business Viability Calculator

The calculator uses information submitted by a vendor to estimate business performance.

```text
Monthly Revenue = Daily Customers × Average Order Value × Working Days

Monthly Profit = Monthly Revenue − Total Monthly Expenses

Break-even Period = Initial Capital Required ÷ Estimated Monthly Profit
```

All numbers shown in StallUp are estimates based on user-provided inputs and should not be treated as guaranteed financial returns.

## Recommendation Logic

The prototype recommends businesses to supporters by comparing:

- Funding budget
- Preferred location
- Food category
- Vendor experience
- Business stage
- Capital required
- Expected revenue and profitability

Each recommendation includes a match score and a short explanation of why it suits the supporter’s preferences.

## Suggested Tech Stack

- Frontend: React.js, Next.js, or HTML/CSS/JavaScript
- Styling: Tailwind CSS or CSS Modules
- Backend: Node.js/Express, Flask, or FastAPI
- Database: PostgreSQL, MySQL, Firebase, or mock JSON data for MVP
- Authentication: Firebase Auth or JWT
- Maps: OpenStreetMap or Google Maps
- Recommendations: Python, Pandas, and Scikit-learn

## Running the Project

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal to view the application.

## Hackathon Scope

The MVP focuses on this flow:

```text
Vendor creates proposal
        ↓
Admin verifies proposal
        ↓
Supporter discovers verified businesses
        ↓
Recommendation engine suggests matches
        ↓
Supporter expresses interest
        ↓
Vendor and supporter track progress
```

Real payments, investment contracts, lending, equity, and returns are intentionally outside the scope of this prototype.

## Future Scope

- Secure identity and document verification
- Partner integrations with banks and financial institutions
- Vendor learning resources and business coaching
- Equipment and raw-material supplier partnerships
- Sales integration with POS systems
- Community ratings and references
- Expansion to home bakers, cloud kitchens, cafés, and other micro-entrepreneurs

## Vision

> Skills should not go to waste simply because someone does not have enough capital to begin.

StallUp aims to help local food entrepreneurs turn their skills into sustainable businesses through discovery, trust, and meaningful support.
