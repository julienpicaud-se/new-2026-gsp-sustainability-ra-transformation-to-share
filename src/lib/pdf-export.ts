import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// High-fidelity PDF export: captures each <section> in the live playbook
// as an image and lays it out on A4 landscape pages with auto page-breaks.
export async function exportToPdf(filename = "Sustainability-Transformation-with-RA-Plus.pdf") {
  // Ensure appendix sections are expanded so they are captured.
  const appendix = document.getElementById("appendix");
  const expandedButtons: HTMLButtonElement[] = [];
  if (appendix) {
    const triggers = appendix.querySelectorAll<HTMLButtonElement>(
      '[data-state="closed"]'
    );
    triggers.forEach((t) => {
      if (t.tagName === "BUTTON") {
        t.click();
        expandedButtons.push(t);
      }
    });
    await new Promise((r) => setTimeout(r, 400));
  }

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("main section, body > div section, section")
  ).filter(
    (el, idx, arr) =>
      // dedupe & skip empty
      arr.indexOf(el) === idx && el.offsetHeight > 50
  );

  // A4 landscape in pt: 842 x 595
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const usableW = pageW - margin * 2;
  const usableH = pageH - margin * 2;

  // Capture hero/nav header by adding a title page from <header>/hero first.
  const hero = document.querySelector<HTMLElement>("#hero, header, section");
  const ordered = sections;

  let first = true;
  for (let i = 0; i < ordered.length; i++) {
    const sec = ordered[i];
    // Skip nested sections that are already inside a captured one
    if (ordered.some((other, j) => j < i && other.contains(sec))) continue;

    try {
      const canvas = await html2canvas(sec, {
        scale: 2,
        useCORS: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor || "#0a0a0a",
        windowWidth: document.documentElement.scrollWidth,
        logging: false,
      });

      const imgW = usableW;
      const imgH = (canvas.height * imgW) / canvas.width;

      if (imgH <= usableH) {
        if (!first) pdf.addPage();
        first = false;
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.92),
          "JPEG",
          margin,
          margin,
          imgW,
          imgH
        );
      } else {
        // Slice tall sections across multiple pages
        const pxPerPage = (usableH / imgW) * canvas.width;
        let offset = 0;
        while (offset < canvas.height) {
          const sliceH = Math.min(pxPerPage, canvas.height - offset);
          const slice = document.createElement("canvas");
          slice.width = canvas.width;
          slice.height = sliceH;
          const ctx = slice.getContext("2d")!;
          ctx.drawImage(
            canvas,
            0,
            offset,
            canvas.width,
            sliceH,
            0,
            0,
            canvas.width,
            sliceH
          );
          if (!first) pdf.addPage();
          first = false;
          const sH = (sliceH * imgW) / canvas.width;
          pdf.addImage(
            slice.toDataURL("image/jpeg", 0.92),
            "JPEG",
            margin,
            margin,
            imgW,
            sH
          );
          offset += sliceH;
        }
      }
    } catch (err) {
      console.warn("PDF capture skipped for section", sec.id, err);
    }
  }

  pdf.save(filename);
}
