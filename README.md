# SheetLock — Excel to Password-Protected PDF

A React + Vite static web app that reads `.xlsx` and `.xls` files locally in the browser, creates a tabular PDF, and applies a genuine PDF open password using AES-256 through `@cantoo/pdf-lib`.

## Privacy model

- Excel file bytes are read through the browser File API and parsed locally by SheetJS.
- PDF creation and AES-256 encryption happen in the browser.
- There is no backend, upload endpoint, analytics, authentication, or document storage.
- Static hosting only serves the app's HTML, JavaScript, CSS, and dependency bundle.
- No analytics or third-party font requests are included.

## Features

- `.xlsx` and `.xls` parsing (unprotected workbooks)
- Choose one, several, or all worksheets
- A4, Letter, and Legal page sizes
- Landscape or portrait layout
- Optional cell gridlines and repeated first-row headers on page breaks
- PDF open password (minimum 8 characters), confirmation, and AES-256 encryption
- Separate random owner password and restrictive permissions
- Local download; no file or password sent to a server
- Responsive interface, drag/drop, status feedback, and a 40 MB input cap

## Important limitations

- This is a data/table export, not an exact Excel print-rendering engine. It does not faithfully reproduce all cell styling, merged-cell layouts, charts, images, conditional formatting, formulas as formulas, print areas, or every Excel feature.
- Password-encrypted input workbooks may not be supported by the community SheetJS parser. Save an unprotected copy first if permitted by your organization's policy.
- The PDF standard fonts have limited Unicode glyph coverage. Some non-Latin scripts or unusual symbols may not render correctly; test your real documents before production use.
- PDF password encryption protects the file at rest. It cannot prevent screenshots, copying after opening, or disclosure by someone who knows the password.
- Browser processing uses device memory and CPU. Very large sheets may be slow or run out of memory.
- `@cantoo/pdf-lib` implements PDF encryption, but this project should still be validated with the PDF readers used by your recipients and your organization's security requirements before being trusted for sensitive records.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The encryption API requires Web Crypto; local development on `localhost` is a secure context in modern browsers.

Build production files:

```bash
npm run build
npm run preview
```

The static production output is in `dist/`.

## Deploy free on Cloudflare Pages

1. Create a new public or private repository on GitHub and push the contents of this folder.
2. In Cloudflare Dashboard, open **Workers & Pages** and choose **Create application → Pages → Connect to Git**.
3. Select your repository.
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Deploy. Cloudflare Pages provides a `*.pages.dev` address on its free tier, subject to the provider's current plan and usage limits.
7. Open the deployed URL and test a small non-confidential sample workbook. Confirm the resulting PDF prompts for the open password and that the password works in the PDF reader your recipients use.

Official guide: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/

## Deploy free on GitHub Pages (alternative)

Cloudflare Pages is the simpler option for this Vite project. GitHub Pages can also host static output, but configure the correct Vite `base` path if deploying under a repository subpath. For a custom domain or root user/organization site, the default base path is usually simpler.

## Security review checklist before handling confidential company records

- Test generated PDFs in Adobe Acrobat Reader and the actual recipient PDF viewer; ensure an open password is required.
- Verify files remain local by checking browser DevTools Network while selecting a file and generating a PDF. No document request should occur.
- Consider removing the Google Fonts import for a strict no-third-party-network policy.
- Pin and review dependencies and rebuild from a trusted environment.
- Use strong unique passwords and share them via a different channel.
- Do not treat this app as a compliance certification or substitute for your organization's approved document-handling process.
