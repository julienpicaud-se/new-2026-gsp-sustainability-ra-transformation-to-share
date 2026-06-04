// High-fidelity PDF export via the browser's native print engine.
// This produces vector text, real fonts, and pixel-accurate styling —
// far better than rasterizing with html2canvas.
//
// Flow:
//   1. Expand any collapsed appendix sections so everything is visible.
//   2. Add a temporary <style> tag that hides chrome (nav, buttons),
//      forces a light-friendly print layout, and inserts page-breaks
//      between <section> elements.
//   3. Call window.print(). The user picks "Save as PDF" in the dialog.
//   4. Clean up the injected styles afterwards.

export async function exportToPdf() {
  // 1. Expand collapsed appendix triggers
  const appendix = document.getElementById("appendix");
  if (appendix) {
    const triggers = appendix.querySelectorAll<HTMLButtonElement>(
      'button[data-state="closed"]'
    );
    triggers.forEach((t) => t.click());
    await new Promise((r) => setTimeout(r, 500));
  }

  // 2. Inject print stylesheet
  const styleId = "pdf-export-print-styles";
  document.getElementById(styleId)?.remove();
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @page {
      size: A4 landscape;
      margin: 14mm;
    }
    @media print {
      html, body {
        background: #ffffff !important;
      }
      /* Hide chrome that shouldn't appear in the PDF */
      nav, [role="navigation"],
      #pdf-export-skip,
      .no-print,
      [data-radix-popper-content-wrapper],
      [data-sonner-toaster],
      button[aria-label="Scroll to top"],
      .fixed { 
        display: none !important; 
      }

      /* Reveal collapsed content */
      [data-state="closed"] > [hidden],
      [data-state="closed"] + div[hidden] {
        display: block !important;
      }
      [hidden] { display: revert !important; }

      /* Page-break between major sections */
      section {
        break-inside: avoid;
        page-break-inside: avoid;
        break-before: page;
        page-break-before: always;
      }
      section:first-of-type {
        break-before: auto;
        page-break-before: auto;
      }

      /* Avoid clipping cards across pages */
      .card, [class*="Card"], article {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      /* Make sure container widths fit the page */
      .container, main, body > div {
        max-width: 100% !important;
        width: 100% !important;
      }

      /* Ensure backgrounds & colors print */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Tighten oversized hero spacing for print */
      section { padding-top: 16px !important; padding-bottom: 16px !important; }
    }
  `;
  document.head.appendChild(style);

  // 3. Trigger native print dialog
  // Slight delay so layout settles after expanding sections
  await new Promise((r) => setTimeout(r, 200));
  window.print();

  // 4. Cleanup after dialog closes
  const cleanup = () => {
    document.getElementById(styleId)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  // Fallback cleanup in case afterprint never fires
  setTimeout(cleanup, 60_000);
}
